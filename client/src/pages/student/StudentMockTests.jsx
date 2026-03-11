import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';

const StudentMockTests = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const res = await api.get('/student/mock-tests');
                setTests(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTests();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link to="/student/dashboard" className="p-2 rounded-xl text-slate-400 hover:bg-white hover:text-slate-600 border border-transparent hover:border-slate-200 transition-all">
                        <span className="material-symbols-rounded">arrow_back</span>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">Mock Tests</h1>
                        <p className="text-slate-500 font-medium">Practice with full-length mocked exams aligned with exactly your exam patterns.</p>
                    </div>
                </div>
            </div>

            {tests.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
                    <span className="material-symbols-rounded text-6xl text-slate-300 mb-4">inbox</span>
                    <h3 className="text-xl font-bold text-slate-700">No mock tests available</h3>
                    <p className="text-slate-500 mt-2">Check back later when new tests are published.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tests.map(test => (
                        <div key={test.id} className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 overflow-hidden relative flex flex-col h-full">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                            
                            <div className="flex justify-between items-start mb-6">
                                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                                    {test.exam_type || 'SSC CGL'}
                                </span>
                                <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-primary-600">
                                    <span className="material-symbols-rounded">quiz</span>
                                </div>
                            </div>

                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                                    {test.title}
                                </h3>
                                <p className="text-slate-500 text-sm mb-6 line-clamp-2">{test.description || 'Full length practice test'}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                    <div className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1"><span className="material-symbols-rounded text-[14px]">timer</span>Time</div>
                                    <div className="font-bold text-slate-700 flex items-end gap-1 text-lg leading-none">{test.duration_minutes}<span className="text-xs font-normal text-slate-500 mb-0.5">Mins</span></div>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                    <div className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1"><span className="material-symbols-rounded text-[14px]">format_list_numbered</span>Questions</div>
                                    <div className="font-bold text-slate-700 flex items-end gap-1 text-lg leading-none">{test.total_questions || 0}<span className="text-xs font-normal text-slate-500 mb-0.5">Qs</span></div>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 col-span-2 flex justify-between items-center">
                                    <div>
                                        <div className="text-xs text-emerald-500 font-medium mb-1 flex items-center gap-1"><span className="material-symbols-rounded text-[14px]">check_circle</span>Correct</div>
                                        <div className="font-bold text-slate-700">+{test.positive_marks || 2} Marks</div>
                                    </div>
                                    <div className="w-px h-8 bg-slate-200 mx-2"></div>
                                    <div className="text-right">
                                        <div className="text-xs text-rose-500 font-medium mb-1 flex items-center justify-end gap-1"><span className="material-symbols-rounded text-[14px]">cancel</span>Incorrect</div>
                                        <div className="font-bold text-slate-700">-{test.negative_marks || 0.5} Marks</div>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => navigate(`/student/mock-test/${test.id}`)}
                                className="w-full btn-primary-gradient py-3.5 group-hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-auto"
                            >
                                View Details 
                                <span className="material-symbols-rounded text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentMockTests;
