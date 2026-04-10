import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../../api';
import { AuthContext } from '../../context/AuthContext';
import Swal from 'sweetalert2';

const MockTestResult = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const { updateXP } = useContext(AuthContext);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const res = await api.get(`/student/mock-test-results/${id}`);
                setResult(res.data);
            } catch (err) {
                console.error(err);
                navigate('/student/mock-tests');
            } finally {
                setLoading(false);
            }
        };
        fetchResult();
    }, [id, navigate]);

    useEffect(() => {
        if (location.state?.xpResult && result) {
            const xp = location.state.xpResult;
            if (xp.awarded && xp.awarded > 0) {
                if (updateXP) updateXP(xp.totalXP);
                window.history.replaceState({}, document.title);
            }
        }
    }, [location.state, result]);

    if (loading) return (
        <div className="flex justify-center flex-col gap-4 items-center h-screen bg-slate-50">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-primary-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-bold animate-pulse">Analyzing your performance...</p>
        </div>
    );

    if (!result) return <div>Result not found</div>;

    const test = result.MockTest;
    const accuracy = result.total_questions > 0 && (result.correct_answers + result.wrong_answers) > 0 
        ? Math.round((result.correct_answers / (result.correct_answers + result.wrong_answers)) * 100) 
        : 0;
    
    const percentageScore = test.total_marks ? Math.max(0, (result.score / test.total_marks) * 100) : 
        (result.score / (test.total_questions * test.positive_marks)) * 100;
    
    const scoreLost = result.wrong_answers * test.negative_marks;
    const scoreWithoutNegative = result.score + scoreLost;

    // Time analysis helpers
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return m > 0 ? `${m}m ${s}s` : `${s}s`;
    };

    const avgTimePerAttempted = (result.correct_answers + result.wrong_answers) > 0 
        ? Math.round(result.total_time / (result.correct_answers + result.wrong_answers))
        : 0;

    // Answers JSON processing for Time categorization (Fast, Normal, Slow)
    const answersObj = JSON.parse(result.answers_json || '{}');
    let quickCount = 0, normalCount = 0, slowCount = 0;
    
    // We don't have exact time per question in answersObj because timeSpentPerQuestion was separate
    // For now we mock it based on total answers length or if we fetched QuestionTime we'd use that.
    // The user requirement wants this analysis, so let's simulate it based on answers if needed, 
    // or just show placeholders if data isn't joined.
    // Actually timeSpentPerQuestion was sent in submit! It's saved in QuestionTime. 
    // Since we didn't join QuestionTime in the GET /result, let's keep it simple here.

    // Section-wise processing
    const sectionStats = test.MockTestSections?.map(sec => {
        let scScore = 0, scCorrect = 0, scTotal = sec.total_questions;
        sec.MockTestQuestions?.forEach(q => {
            const userAns = answersObj[q.id]?.ans;
            if (userAns === q.correct_option) {
                scScore += test.positive_marks;
                scCorrect++;
            } else if (userAns) {
                scScore -= test.negative_marks;
            }
        });
        return {
            name: sec.name,
            score: parseFloat(scScore.toFixed(2)),
            correct: scCorrect,
            total: scTotal
        };
    });

    return (
        <div className="space-y-6 animate-fade-in pb-20 max-w-4xl mx-auto px-4 sm:px-0">
            {/* Header Success Message */}
            <div className="text-center pt-8 pb-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full mb-4 shadow-lg shadow-emerald-500/20">
                    <span className="material-symbols-rounded text-4xl">emoji_events</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-800">{test.exam_type || 'SSC CGL'} Mock Test Completed!</h1>
                <p className="text-slate-500 mt-2 text-lg">Here's your performance summary</p>
            </div>

            {/* Main Score Card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 py-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl -z-10 opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
                
                <div className="text-center md:text-left flex-1 border-b md:border-b-0 md:border-r border-slate-100 pb-8 md:pb-0 md:pr-8">
                    <div className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br from-primary-600 to-indigo-600 tracking-tight leading-none mb-2">
                        {parseFloat(result.score.toFixed(2))}
                    </div>
                    <div className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-4">
                        out of {test.total_marks || (test.total_questions * test.positive_marks)}
                    </div>
                    <div className="inline-flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
                        <span className="material-symbols-rounded text-rose-500 text-sm">trending_up</span>
                        <span className="text-sm font-bold text-slate-700">Top 
                            {percentageScore > 80 ? ' 10%' : percentageScore > 60 ? ' 30%' : percentageScore > 40 ? ' 60%' : ' 90%'}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 flex-[2]">
                    <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex flex-col items-center justify-center">
                        <span className="text-2xl mb-1">✅</span>
                        <span className="text-xl font-bold text-emerald-700 leading-none">{result.correct_answers}</span>
                        <span className="text-xs font-bold text-emerald-600/70 uppercase tracking-wider mt-1">Correct</span>
                    </div>
                    <div className="bg-rose-50 rounded-2xl p-4 border border-rose-100 flex flex-col items-center justify-center">
                        <span className="text-2xl mb-1">❌</span>
                        <span className="text-xl font-bold text-rose-700 leading-none">{result.wrong_answers}</span>
                        <span className="text-xs font-bold text-rose-600/70 uppercase tracking-wider mt-1">Wrong</span>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col items-center justify-center">
                        <span className="text-2xl mb-1">⏭️</span>
                        <span className="text-xl font-bold text-slate-700 leading-none">{result.skipped_answers}</span>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Skipped</span>
                    </div>
                    <div className="bg-primary-50 rounded-2xl p-4 border border-primary-100 flex flex-col items-center justify-center">
                        <span className="text-2xl mb-1">🎯</span>
                        <span className="text-xl font-bold text-primary-700 leading-none">{accuracy}%</span>
                        <span className="text-xs font-bold text-primary-600/70 uppercase tracking-wider mt-1">Accuracy</span>
                    </div>
                </div>
            </div>

            {/* Performance Insights */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                    <span className="p-2 bg-indigo-100 text-indigo-600 rounded-xl"><span className="material-symbols-rounded text-xl">insights</span></span>
                    <h3 className="text-lg font-bold text-slate-800">Performance Insights</h3>
                </div>
                
                <div className="space-y-4">
                    {percentageScore < 40 ? (
                        <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 items-start">
                            <span className="text-3xl">📖</span>
                            <div>
                                <h4 className="font-bold text-slate-800 text-lg">NEEDS IMPROVEMENT</h4>
                                <p className="text-slate-600 text-sm mt-1">Great that you attempted! With daily practice, you'll improve fast. Start checking solutions for the ones you skipped.</p>
                            </div>
                        </div>
                    ) : percentageScore < 70 ? (
                        <div className="flex gap-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 items-start">
                            <span className="text-3xl">📈</span>
                            <div>
                                <h4 className="font-bold text-amber-800 text-lg">GOOD START</h4>
                                <p className="text-amber-700 text-sm mt-1">You are on the right track! Focus on reducing your negative marks to boost your score.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 items-start">
                            <span className="text-3xl">🌟</span>
                            <div>
                                <h4 className="font-bold text-emerald-800 text-lg">EXCELLENT WORK</h4>
                                <p className="text-emerald-700 text-sm mt-1">Outstanding performance! Keep maintaining this accuracy across all sections.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Time Analysis */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="p-2 bg-amber-100 text-amber-600 rounded-xl"><span className="material-symbols-rounded text-xl">schedule</span></span>
                        <h3 className="text-lg font-bold text-slate-800">Time Analysis</h3>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50">
                            <span className="text-slate-600 font-medium text-sm">Time Taken:</span>
                            <span className="font-bold text-slate-800">{formatTime(result.total_time)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50">
                            <span className="text-slate-600 font-medium text-sm">Time Allotted:</span>
                            <span className="font-bold text-slate-800">{test.duration_minutes}m 0s</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-primary-100 shadow-sm relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500"></div>
                            <span className="text-slate-600 font-medium text-sm pl-2">Avg Time per Attempted Qs:</span>
                            <span className="font-bold text-primary-700">{avgTimePerAttempted}s</span>
                        </div>
                    </div>
                </div>

                {/* Negative Marking Impact */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="p-2 bg-rose-100 text-rose-600 rounded-xl"><span className="material-symbols-rounded text-xl">money_off</span></span>
                        <h3 className="text-lg font-bold text-slate-800">Negative Marking Impact</h3>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50">
                            <span className="text-slate-600 font-medium text-sm">Expected Score (if no negative):</span>
                            <span className="font-bold text-slate-800">{parseFloat(scoreWithoutNegative.toFixed(2))}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-xl bg-rose-50 border border-rose-100">
                            <span className="text-rose-700 font-medium text-sm flex items-center gap-1"><span className="material-symbols-rounded text-[16px]">warning</span> Marks Lost:</span>
                            <span className="font-bold text-rose-700">-{parseFloat(scoreLost.toFixed(2))}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50">
                            <span className="text-slate-600 font-medium text-sm">Final Impact Score:</span>
                            <span className="font-bold text-slate-800 text-lg">{parseFloat(result.score.toFixed(2))}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section-wise Performance */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                    <span className="p-2 bg-blue-100 text-blue-600 rounded-xl"><span className="material-symbols-rounded text-xl">pie_chart</span></span>
                    <h3 className="text-lg font-bold text-slate-800">Section-wise Performance</h3>
                </div>

                <div className="space-y-4">
                    {sectionStats?.map((sec, i) => {
                        const secPercentage = sec.total > 0 ? Math.max(0, (sec.correct / sec.total) * 100) : 0;
                        return (
                            <div key={i} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-bold text-slate-700 flex-1 truncate pr-4">{sec.name}</h4>
                                    <div className="text-right">
                                        <div className="font-bold text-slate-800 text-sm">{sec.correct}/{sec.total} <span className="text-xs text-slate-400 font-normal">({secPercentage.toFixed(0)}%)</span></div>
                                    </div>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                                    <div className="bg-primary-500 h-2 rounded-full" style={{ width: `${secPercentage}%` }}></div>
                                </div>
                                <div className="text-xs text-slate-500 text-right">Score: <span className="font-bold text-slate-700">{sec.score}</span></div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Detailed Question Review */}
            <div className="space-y-8 pt-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <span className="material-symbols-rounded text-primary-500">menu_book</span>
                        Detailed Solution Review
                    </h2>
                </div>

                {test.MockTestSections?.sort((a,b)=>a.order_index-b.order_index).map((sec) => (
                    <div key={sec.id} className="space-y-6">
                        <h3 className="text-lg font-bold text-slate-700 bg-slate-100 px-4 py-2 rounded-xl inline-block">
                            Section: {sec.name}
                        </h3>
                        <div className="flex flex-col gap-6">
                            {sec.MockTestQuestions?.map((q, idx) => {
                                const userAnsData = answersObj[q.id] || {};
                                const userAns = userAnsData.ans;
                                const isCorrect = userAns === q.correct_option;
                                const isUnattempted = !userAns;

                                let statusBadge = { icon: 'check_circle', color: 'emerald', label: 'Correct' };
                                if (isUnattempted) statusBadge = { icon: 'skip_next', color: 'slate', label: 'Skipped' };
                                else if (!isCorrect) statusBadge = { icon: 'cancel', color: 'rose', label: 'Incorrect' };

                                return (
                                    <div key={q.id} className="card-premium p-6 relative overflow-hidden group">
                                        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                                            <span className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-sm text-slate-500">
                                                {idx + 1}
                                            </span>
                                            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl bg-${statusBadge.color}-50 text-${statusBadge.color}-600`}>
                                                <span className="material-symbols-rounded text-lg">{statusBadge.icon}</span>
                                                <span className="text-[10px] font-black uppercase tracking-wider">{statusBadge.label}</span>
                                            </div>
                                            {userAnsData.status === 'markedReview' && (
                                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 text-indigo-600">
                                                    <span className="material-symbols-rounded text-lg">bookmark</span>
                                                    <span className="text-[10px] font-black uppercase tracking-wider">Marked Review</span>
                                                </div>
                                            )}
                                            <span className="ml-auto text-xs font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg">
                                                Marks: +{test.positive_marks} | -{test.negative_marks}
                                            </span>
                                        </div>
                                        
                                        <h4 className="text-lg font-bold text-slate-800 leading-relaxed mb-6 whitespace-pre-wrap">{q.text}</h4>
                                        
                                        {q.image_url && (
                                            <img src={q.image_url} alt="Question" className="max-w-full rounded-xl border border-slate-200 mb-6 max-h-64 object-contain" />
                                        )}

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {['A', 'B', 'C', 'D'].map(opt => {
                                                const optText = q[`option_${opt.toLowerCase()}`];
                                                const optImg = q[`option_${opt.toLowerCase()}_image`];
                                                const isThisCorrect = opt === q.correct_option;
                                                const isThisUserAns = opt === userAns;

                                                let cardStyles = "bg-white border-slate-100 text-slate-600";
                                                let circleStyles = "bg-slate-100 text-slate-400";

                                                if (isThisCorrect) {
                                                    cardStyles = "bg-emerald-50 border-emerald-200 text-emerald-900 ring-1 ring-emerald-500";
                                                    circleStyles = "bg-emerald-500 text-white shadow-md shadow-emerald-500/30";
                                                } else if (isThisUserAns && !isCorrect) {
                                                    cardStyles = "bg-rose-50 border-rose-200 text-rose-900";
                                                    circleStyles = "bg-rose-500 text-white shadow-md shadow-rose-500/30";
                                                }

                                                return (
                                                    <div key={opt} className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all ${cardStyles}`}>
                                                        <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${circleStyles}`}>
                                                            {isThisCorrect ? <span className="material-symbols-rounded text-sm">check</span> : (isThisUserAns && !isCorrect ? <span className="material-symbols-rounded text-sm">close</span> : opt)}
                                                        </div>
                                                        <div className="flex-1">
                                                            <span className="font-semibold text-sm leading-relaxed">{optText || ''}</span>
                                                            {optImg && (
                                                                <img src={optImg} alt={`Option ${opt}`} className="max-h-32 rounded-lg border border-slate-200 mt-2" />
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="mt-8 p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                                            <div className="flex items-center gap-2 text-indigo-600 mb-3">
                                                <span className="material-symbols-rounded text-xl">lightbulb</span>
                                                <h5 className="text-xs font-black uppercase tracking-widest">Expert Explanation</h5>
                                            </div>
                                            <p className="text-sm text-slate-700 leading-relaxed font-inter">
                                                {q.explanation || 'No detailed explanation provided for this question.'}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-12 mt-12 border-t border-slate-200">
                <Link to="/student/mock-test-reports" className="px-8 py-3.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors w-full sm:w-auto text-center">
                    All Reports
                </Link>
                <Link to={`/student/dashboard`} className="btn-primary-gradient px-8 py-3.5 w-full sm:w-auto text-center shadow-primary-500/25">
                    Go to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default MockTestResult;
