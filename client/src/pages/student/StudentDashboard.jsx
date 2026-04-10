import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import { motion } from 'framer-motion';

const StudentDashboard = () => {
    const [tests, setTests] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userStats, setUserStats] = useState({
        totalAttempts: 0,
        averageScore: 0,
        rank: '--',
        mistakesCount: 0,
        accuracy: 0
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [testsRes, resultsRes, statsRes, rankRes] = await Promise.all([
                api.get('/student/tests'),
                api.get('/student/results'),
                api.get('/student/me'),
                api.get('/student/rank')
            ]);

            setTests(testsRes.data);
            setResults(resultsRes.data);

            // Calculate some local stats if not provided by API
            const totalScore = resultsRes.data.reduce((acc, curr) => acc + curr.score, 0);
            let avg;
            if (resultsRes.data.length > 0) {
                avg = (totalScore / resultsRes.data.length).toFixed(1);
            } else {
                avg = 0;
            }

            // Calculate total mistakes from tests
            const mistakes = resultsRes.data.reduce((acc, curr) => {
                const totalQs = curr.total_questions || 0;
                const correct = curr.correct_answers || 0;
                return acc + (totalQs - correct);
            }, 0);

            // Calculate total accuracy from all attempts
            const totalQsCount = resultsRes.data.reduce((acc, curr) => acc + (curr.total_questions || 0), 0);
            const totalCorrectCount = resultsRes.data.reduce((acc, curr) => acc + (curr.correct_answers || 0), 0);
            const overallAccuracy = totalQsCount > 0 ? Math.round((totalCorrectCount / totalQsCount) * 100) : 0;

            setUserStats({
                totalAttempts: resultsRes.data.length,
                averageScore: avg,
                rank: rankRes.data.rank,
                mistakesCount: mistakes,
                accuracy: overallAccuracy
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const resultColumns = [
        {
            header: 'Test Name', key: 'Test', render: (row) => (
                <div className="font-bold text-slate-800">{row.Test?.title || 'Unknown Test'}</div>
            )
        },
        { header: 'Date', key: 'createdAt', render: (row) => new Date(row.createdAt).toLocaleDateString() },
        {
            header: 'Score', key: 'score', render: (row) => (
                <div className="flex items-center gap-2">
                    <div className="w-12 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary-500"
                            style={{ width: `${(row.score / row.total_questions) * 100}%` }}
                        />
                    </div>
                    <span className="font-bold text-primary-600">{row.score}/{row.total_questions}</span>
                </div>
            )
        },
        {
            header: 'Accuracy', key: 'id', render: (row) => (
                <span className="text-sm font-medium text-slate-600">
                    {Math.round((row.correct_answers / row.total_questions) * 100)}%
                </span>
            )
        },
        {
            header: 'Action', key: 'id', render: (row) => (
                <Link to={`/student/result/${row.id}`} className="btn-premium px-4 py-1.5 bg-slate-100 text-slate-600 hover:bg-primary-50 hover:text-primary-600 text-sm">
                    Review Report
                </Link>
            )
        }
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Greeting */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Student Dashboard</h1>
                    <p className="text-slate-500">Ready to sharpen your skills today?</p>
                </div>
                {/* <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="material-symbols-rounded text-primary-500">verified_user</span>
                    <span className="text-sm font-bold text-slate-700">Level 4 Learner</span>
                </div> */}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Tests Taken" value={userStats.totalAttempts} icon="history" color="info" />
                <StatCard title="Avg. Score" value={`${userStats.averageScore}%`} icon="analytics" color="success" />
                <StatCard title="Current Rank" value={userStats.rank} icon="leaderboard" color="warning" />
                <StatCard title="Mistakes" value={userStats.mistakesCount} icon="error" color="danger" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Available Tests */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <span className="material-symbols-rounded text-primary-500">assignment</span>
                        Available Tests
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {tests.length === 0 && !loading ? (
                            <div className="col-span-full card-premium p-12 text-center text-slate-400">
                                <span className="material-symbols-rounded text-5xl mb-2">event_busy</span>
                                <p>No tests assigned to your class yet.</p>
                            </div>
                        ) : tests.map(test => {
                            if (!test) return null;
                            return (
                                <motion.div
                                    key={test.id}
                                    whileHover={{ scale: 1.02 }}
                                    className="card-premium p-5 flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                                                <span className="material-symbols-rounded">quiz</span>
                                            </div>
                                            <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-bold uppercase">
                                                {test.duration_minutes} Mins
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-slate-800 mb-1">{test.title}</h3>
                                        <p className="text-xs text-slate-500 line-clamp-2 mb-4">{test.description || 'No description provided.'}</p>
                                    </div>
                                    <Link to={`/student/test/${test.id}`} className="btn-primary-gradient w-full py-2 text-sm">
                                        Start Attempt
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Sidebar Cards */}
                <div className="space-y-6">
                    {/* Mistake Book Card */}
                    <div className="card-premium p-6 overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-rounded text-6xl text-rose-600">menu_book</span>
                        </div>
                        <h3 className="font-bold text-slate-800 mb-2">Mistake Book</h3>
                        <p className="text-sm text-slate-500 mb-4">Review {userStats.mistakesCount} questions you missed in previous tests.</p>
                        <Link to="/student/mistake-book" className="btn-premium w-full bg-rose-50 text-rose-600 hover:bg-rose-100 py-2 text-sm">
                            Open Workbook
                        </Link>
                    </div>

                    {/* Quick Link */}
                    <div className="card-premium p-6">
                        <h3 className="font-bold text-slate-800 mb-4">Performance</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Accuracy</span>
                                <span className="font-bold text-slate-800">{userStats.accuracy}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500" style={{ width: `${userStats.accuracy}%` }}></div>
                            </div>
                            <Link to="/student/reports" className="flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 mt-4">
                                Full Analysis Report
                                <span className="material-symbols-rounded text-sm">arrow_forward</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent History */}
            <div className="space-y-4 pt-4">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <span className="material-symbols-rounded text-emerald-500">history</span>
                    Recent Activity
                </h2>
                <DataTable
                    columns={resultColumns}
                    data={results}
                    loading={loading}
                    pageSize={5}
                />
            </div>
        </div>
    );
};

export default StudentDashboard;
