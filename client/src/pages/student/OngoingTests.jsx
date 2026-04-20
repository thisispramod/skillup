import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import Swal from 'sweetalert2';

const OngoingTests = () => {
    const [ongoingTests, setOngoingTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOngoingTests();
    }, []);

    const fetchOngoingTests = async () => {
        try {
            const res = await api.get('/student/ongoing-tests');
            setOngoingTests(res.data || []);
        } catch (err) {
            Swal.fire('Error', 'Failed to fetch ongoing tests', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleResume = (test) => {
        if (test.type === 'mock') {
            navigate(`/student/mock-test/${test.mock_test_id}/take`);
        } else {
            navigate(`/student/test/${test.test_id}`);
        }
    };

    const formatTime = (seconds) => {
        if (!seconds) return '0m';
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Ongoing Tests</h1>
                    <p className="text-slate-500 text-sm mt-1">Resume tests you paused earlier</p>
                </div>
            </div>

            {ongoingTests.length === 0 ? (
                <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200 text-center">
                    <span className="material-symbols-rounded text-6xl text-slate-200 mb-4 inline-block">pause_circle</span>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">No Ongoing Tests</h3>
                    <p className="text-slate-500 max-w-md mx-auto">You don't have any paused tests at the moment. When you start a test, you can pause it and resume here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {ongoingTests.map(test => {
                        let totalQ = test.total_questions; 
                        let answeredQ = 0;
                        try {
                            const ans = JSON.parse(test.answers_json || '{}');
                            answeredQ = Object.keys(ans).filter(k => ans[k] && (!ans[k].status || ans[k].status !== 'markedReview')).length;
                        } catch(e) {}

                        const isMock = test.type === 'mock';

                        return (
                            <div key={`${test.type}-${test.id}`} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 group hover:border-primary-300 transition-all flex flex-col h-full">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1 pr-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md ${isMock ? 'bg-purple-100 text-purple-700' : 'bg-primary-100 text-primary-700'}`}>
                                                {isMock ? 'Mock Exam' : 'Standard Test'}
                                            </span>
                                            <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md bg-amber-100 text-amber-700">
                                                {test.status}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-lg text-slate-800 line-clamp-2">
                                            {test.test_title || 'Unnamed Test'}
                                        </h3>
                                        <div className="text-xs text-slate-400 mt-1">Last saved: {new Date(test.updatedAt).toLocaleString()}</div>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 mt-auto mb-6">
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <div className="text-xs text-slate-500 font-bold mb-1">Progress</div>
                                        <div className="font-bold text-slate-700 flex items-end gap-1">
                                            <span className="text-lg">{answeredQ}</span>
                                            <span className="text-xs text-slate-400 mb-0.5">/ {totalQ || '?'} Attempted</span>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <div className="text-xs text-slate-500 font-bold mb-1">Time Left</div>
                                        <div className="font-bold text-slate-700 flex items-end gap-1">
                                            <span className="text-lg">{formatTime(test.time_left)}</span>
                                            <span className="text-xs text-slate-400 mb-0.5">remaining</span>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => handleResume(test)}
                                    className="w-full btn-primary-gradient py-3 rounded-xl flex items-center justify-center gap-2 group/btn"
                                >
                                    <span className="material-symbols-rounded group-hover/btn:rotate-90 transition-transform">play_circle</span>
                                    Resume Test
                                </button>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
};

export default OngoingTests;
