import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../api';

const StudentMockTestReports = () => {
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttempts = async () => {
            try {
                const res = await api.get('/student/mock-test-results');
                setAttempts(res.data);
            } catch (err) {
                console.error("Failed to load mock test reports", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAttempts();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-full min-h-[400px]">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Mock Test Reports</h1>
                    <p className="text-slate-500 font-medium mt-1">Review your past mock test performances and detailed analysis.</p>
                </div>
            </div>

            {attempts.length === 0 ? (
                <div className="card-premium p-12 text-center flex flex-col items-center justify-center">
                    <span className="material-symbols-rounded text-6xl text-slate-300 mb-4">history</span>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">No Reports Yet</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-6">You haven't completed any mock tests yet. Take a mock test to see your detailed performance report here.</p>
                    <Link to="/student/mock-tests" className="btn-primary-gradient px-6 py-2">
                        Browse Mock Tests
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {attempts.map((attempt, index) => {
                        const test = attempt.MockTest;
                        if (!test) return null; // Defensive check
                        
                        // Calculate accuracy
                        const totalAttempted = attempt.correct_answers + attempt.wrong_answers;
                        const accuracy = totalAttempted > 0 
                            ? Math.round((attempt.correct_answers / totalAttempted) * 100) 
                            : 0;

                        // Calculate percentage score
                        const maxScore = test.total_marks || (test.total_questions * (test.positive_marks || 1));
                        const percentage = maxScore > 0 ? (attempt.score / maxScore) * 100 : 0;
                        
                        let scoreColor = 'slate';
                        if (percentage >= 80) scoreColor = 'emerald';
                        else if (percentage >= 50) scoreColor = 'amber';
                        else if (percentage > 0) scoreColor = 'rose';

                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                key={attempt.id}
                                className="card-premium p-6 flex flex-col h-full hover:border-primary-300 transition-colors group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-wider">
                                                {test.exam_type || 'Mock Test'}
                                            </span>
                                            <span className="text-xs font-bold text-slate-400">
                                                {new Date(attempt.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-primary-700 transition-colors">{test.title}</h3>
                                    </div>
                                    <div className={`shrink-0 ml-4 w-12 h-12 rounded-full flex items-center justify-center font-black bg-${scoreColor}-50 text-${scoreColor}-600 border border-${scoreColor}-100`}>
                                        {Math.round(percentage)}%
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-6 flex-1">
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col justify-center">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Score</span>
                                        <span className="font-bold text-slate-700 text-sm leading-none">{attempt.score} <span className="text-xs text-slate-400 font-medium">/ {maxScore}</span></span>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col justify-center">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Accuracy</span>
                                        <div className="flex flex-col gap-1">
                                            <span className="font-bold text-slate-700 text-sm leading-none">{accuracy}%</span>
                                            <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary-500" style={{ width: `${accuracy}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    to={`/student/mock-test-result/${attempt.id}`}
                                    className="w-full py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm text-center hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
                                >
                                    View Full Report
                                    <span className="material-symbols-rounded text-sm">arrow_forward</span>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default StudentMockTestReports;
