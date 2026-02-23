import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api';
import StatCard from '../../components/common/StatCard';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';

const ResultReview = () => {
    const { id } = useParams();
    const [attempt, setAttempt] = useState(null);
    const [rankings, setRankings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/student/result/${id}`);
                setAttempt(res.data);

                if (res.data.test_id) {
                    try {
                        const rankRes = await api.get(`/rankings/${res.data.test_id}`);
                        setRankings(rankRes.data);
                    } catch (e) { console.error("Ranking fetch error", e); }
                }
            } catch (err) {
                console.error(err);
                Swal.fire('Error', 'Failed to load result', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchResult();
    }, [id]);

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
    );

    if (!attempt) return (
        <div className="card-premium p-20 text-center text-slate-400">
            <span className="material-symbols-rounded text-6xl mb-4">error</span>
            <p className="text-lg font-bold text-slate-800">Result not found</p>
            <Link to="/student/dashboard" className="mt-4 text-primary-600 font-bold hover:underline">Back to Dashboard</Link>
        </div>
    );

    const { Test: test, answers_json, QuestionTimes: qTimes } = attempt;
    const userAnswers = JSON.parse(answers_json || '{}');
    const questions = test.Questions || [];

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}s`;
    };

    const avgTime = qTimes?.length > 0
        ? (qTimes.reduce((acc, curr) => acc + curr.time_spent, 0) / questions.length).toFixed(1)
        : 0;

    const handleBookmark = async (qId) => {
        try {
            await api.post(`/student/mistakes/${qId}/bookmark`, { test_id: attempt.test_id });
            Swal.fire({
                icon: 'success',
                title: 'Question Flagged',
                text: 'This question has been added to your highlights.',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000
            });
        } catch (e) { console.error(e); }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link to="/student/reports" className="p-2 rounded-xl text-slate-400 hover:bg-white hover:text-slate-600 border border-transparent hover:border-slate-200 transition-all">
                        <span className="material-symbols-rounded">arrow_back</span>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">{test.title} - Review</h1>
                        <p className="text-slate-500 font-medium font-inter">Completed on {new Date(attempt.completed_at).toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Score" value={`${attempt.score}/${attempt.total_questions}`} icon="military_tech" color="primary" />
                <StatCard title="Correct" value={attempt.correct_answers} icon="check_circle" color="success" />
                <StatCard title="Wrong" value={attempt.wrong_answers} icon="cancel" color="danger" />
                <StatCard title="Avg Time/Q" value={`${avgTime}s`} icon="timer" color="info" />
            </div>

            {/* Rankings Section */}
            {rankings && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="card-premium p-6 lg:col-span-1">
                        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <span className="material-symbols-rounded text-primary-500">emoji_events</span>
                            Your Performance Rank
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { label: 'Overall', value: rankings.myRanks.overall, color: 'primary' },
                                { label: 'Class Rank', value: rankings.myRanks.class, color: 'info' },
                                { label: 'Batch Rank', value: rankings.myRanks.batch, color: 'purple' }
                            ].map((rank, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">{rank.label}</span>
                                    <span className="text-2xl font-black text-slate-800">#{rank.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card-premium p-6 lg:col-span-2">
                        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <span className="material-symbols-rounded text-amber-500">workspace_premium</span>
                            Leaderboard - Top 5
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-xs text-slate-400 font-bold uppercase tracking-widest border-b border-slate-100">
                                    <tr>
                                        <th className="py-3">Rank</th>
                                        <th className="py-3">Student</th>
                                        <th className="py-3">Score</th>
                                        <th className="py-3 text-right">Accuracy</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rankings.leaderboard.slice(0, 5).map((user, idx) => (
                                        <tr key={idx} className={`group ${user.user_id === attempt.user_id ? 'bg-primary-50/50' : ''}`}>
                                            <td className="py-3 font-black text-primary-600">#{user.rank}</td>
                                            <td className="py-3 font-bold text-slate-700">
                                                {user.name} {user.user_id === attempt.user_id && <span className="text-[10px] bg-primary-600 text-white px-1.5 py-0.5 rounded-md ml-2">YOU</span>}
                                            </td>
                                            <td className="py-3 font-bold text-slate-800">{user.score}</td>
                                            <td className="py-3 text-right">
                                                <div className="inline-flex items-center gap-2">
                                                    <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-emerald-500" style={{ width: `${user.accuracy}%` }} />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-500">{user.accuracy}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Analysis Badges Legend */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
                    <span className="material-symbols-rounded text-emerald-500">offline_bolt</span>
                    <div>
                        <p className="text-xs font-bold text-emerald-800 uppercase tracking-widest">Strong Area</p>
                        <p className="text-[11px] text-emerald-600 font-medium leading-none mt-1">Found answer in &lt; 30s</p>
                    </div>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-center gap-3">
                    <span className="material-symbols-rounded text-amber-500">slow_motion_video</span>
                    <div>
                        <p className="text-xs font-bold text-amber-800 uppercase tracking-widest">Speed Review</p>
                        <p className="text-[11px] text-amber-600 font-medium leading-none mt-1">Correct but took &gt; 60s</p>
                    </div>
                </div>
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-3">
                    <span className="material-symbols-rounded text-rose-500">priority_high</span>
                    <div>
                        <p className="text-xs font-bold text-rose-800 uppercase tracking-widest">Urgent Revision</p>
                        <p className="text-[11px] text-rose-600 font-medium leading-none mt-1">High time + Wrong answer</p>
                    </div>
                </div>
            </div>

            {/* Questions Review */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <span className="material-symbols-rounded text-primary-500">list_alt</span>
                    Detailed Question Review
                </h2>

                <div className="flex flex-col gap-6">
                    {questions.map((q, idx) => {
                        if (!q) return null;
                        const userAns = userAnswers[q.id];
                        const isCorrect = userAns === q.correct_option;
                        const isUnattempted = !userAns;
                        const timeSpent = qTimes?.find(t => t.question_id === q.id)?.time_spent || 0;

                        let statusBadge = { icon: 'check_circle', color: 'emerald', label: 'Correct' };
                        if (isUnattempted) statusBadge = { icon: 'help', color: 'slate', label: 'Skipped' };
                        else if (!isCorrect) statusBadge = { icon: 'cancel', color: 'rose', label: 'Incorrect' };

                        let aiAnalysis = null;
                        if (!isUnattempted) {
                            if (timeSpent > 60 && !isCorrect) aiAnalysis = { label: 'Urgent Revision', color: 'rose' };
                            else if (timeSpent > 60 && isCorrect) aiAnalysis = { label: 'Speed Review', color: 'amber' };
                            else if (timeSpent < 30 && isCorrect) aiAnalysis = { label: 'Strong Area', color: 'emerald' };
                        }

                        return (
                            <div key={q.id} className="card-premium p-6 lg:p-10 relative overflow-hidden group">
                                {aiAnalysis && (
                                    <div className={`absolute top-0 left-0 px-6 py-1 bg-${aiAnalysis.color}-600 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-br-2xl shadow-lg`}>
                                        {aiAnalysis.label}
                                    </div>
                                )}

                                <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-6">
                                            <span className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-sm text-slate-500">
                                                {idx + 1}
                                            </span>
                                            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl bg-${statusBadge.color}-50 text-${statusBadge.color}-600`}>
                                                <span className="material-symbols-rounded text-lg">{statusBadge.icon}</span>
                                                <span className="text-[10px] font-black uppercase tracking-wider">{statusBadge.label}</span>
                                            </div>
                                            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg">
                                                Time Spent: {formatTime(timeSpent)}
                                            </span>
                                        </div>
                                         <h3 className="text-xl font-bold text-slate-800 leading-relaxed mb-8">{q.text || 'Deleted Question'}</h3>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {['A', 'B', 'C', 'D'].map(opt => {
                                                const optText = q[`option_${opt.toLowerCase()}`];
                                                const isThisCorrect = opt === q.correct_option;
                                                const isThisUserAns = opt === userAns;

                                                let cardStyles = "bg-white border-slate-100 text-slate-600";
                                                let circleStyles = "bg-slate-100 text-slate-400";

                                                if (isThisCorrect) {
                                                    cardStyles = "bg-emerald-50 border-emerald-200 text-emerald-900";
                                                    circleStyles = "bg-emerald-500 text-white";
                                                } else if (isThisUserAns && !isCorrect) {
                                                    cardStyles = "bg-rose-50 border-rose-200 text-rose-900";
                                                    circleStyles = "bg-rose-500 text-white";
                                                }

                                                return (
                                                    <div key={opt} className={`flex items-center gap-4 p-4 rounded-3xl border-2 transition-all ${cardStyles}`}>
                                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 shadow-sm ${circleStyles}`}>
                                                            {isThisCorrect ? <span className="material-symbols-rounded">check</span> : (isThisUserAns && !isCorrect ? <span className="material-symbols-rounded">close</span> : opt)}
                                                        </div>
                                                        <span className="font-semibold text-sm leading-tight">{optText || 'N/A'}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="flex flex-row md:flex-col gap-2 shrink-0">
                                        <button
                                            onClick={() => handleBookmark(q.id)}
                                            className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:text-amber-500 hover:bg-amber-50 border border-slate-100 hover:border-amber-200 transition-all"
                                            title="Bookmark for Revision"
                                        >
                                            <span className="material-symbols-rounded">bookmark</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 bg-primary-600/5 rounded-3xl border border-primary-600/10 space-y-3">
                                    <div className="flex items-center gap-2 text-primary-600">
                                        <span className="material-symbols-rounded text-xl">lightbulb</span>
                                        <h4 className="text-xs font-black uppercase tracking-widest">Expert Insight</h4>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-800 font-bold mb-2">
                                            Correct Answer: <span className="text-emerald-600 ml-1">Option {q.correct_option}: {q[`option_${q.correct_option?.toLowerCase()}`] || 'N/A'}</span>
                                        </p>
                                        <p className="text-sm text-slate-600 leading-relaxed font-inter italic">
                                            {q.explanation || 'No detailed explanation currently available for this question. Consult your textbook for theoretical context.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ResultReview;
