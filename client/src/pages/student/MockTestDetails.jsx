import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api';

const MockTestDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [test, setTest] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestInfo = async () => {
            try {
                const res = await api.get(`/student/mock-tests/${id}/info`);
                setTest(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTestInfo();
    }, [id]);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
    );

    if (!test) return <div>Test not found</div>;

    const totalQuestions = test.MockTestSections?.reduce((acc, sec) => acc + sec.total_questions, 0) || test.total_questions || 0;

    return (
        <div className="space-y-6 animate-fade-in pb-20 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link to="/student/mock-tests" className="p-2 rounded-xl text-slate-400 hover:bg-white hover:text-slate-600 border border-transparent hover:border-slate-200 transition-all">
                    <span className="material-symbols-rounded">arrow_back</span>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">{test.title}</h1>
                    <p className="text-slate-500 font-medium">Test Instructions</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl -z-10 opacity-50 translate-x-1/2 -translate-y-1/2"></div>
                
                <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4 mb-6">Please read the instructions carefully</h2>
                
                <div className="space-y-6 text-slate-700 text-sm leading-relaxed">
                    <p className="font-semibold text-slate-800 text-base">General Instructions:</p>
                    <ol className="list-decimal pl-5 space-y-3">
                        <li>Total duration of the examination is <strong>{test.duration_minutes} minutes</strong>.</li>
                        <li>The clock will be set at the server. The countdown timer in the top right corner of screen will display the remaining time available for you to complete the examination. When the timer reaches zero, the examination will end by itself. You will not be required to end or submit your examination.</li>
                        <li>The Question Palette displayed on the right side of screen will show the status of each question using one of the following symbols:
                            <ul className="mt-4 space-y-3 list-none pl-2">
                                <li className="flex items-center gap-3"><span className="w-8 h-8 flex items-center justify-center rounded border-2 border-slate-200 bg-white text-slate-600 text-xs font-bold">1</span> You have not visited the question yet.</li>
                                <li className="flex items-center gap-3"><span className="w-8 h-8 flex items-center justify-center rounded-b-md bg-rose-500 text-white text-xs font-bold clip-not-answered" style={{clipPath: "polygon(50% 100%, 100% 75%, 100% 0, 0 0, 0 75%)"}}>2</span> You have not answered the question.</li>
                                <li className="flex items-center gap-3"><span className="w-8 h-8 flex items-center justify-center rounded-t-lg bg-emerald-500 text-white text-xs font-bold clip-answered" style={{clipPath: "polygon(50% 0%, 100% 25%, 100% 100%, 0 100%, 0 25%)"}}>3</span> You have answered the question.</li>
                                <li className="flex items-center gap-3"><span className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-500 text-white text-xs font-bold">4</span> You have NOT answered the question, but have marked the question for review.</li>
                                <li className="flex items-center gap-3"><span className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-500 text-white text-xs font-bold relative"><span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border border-white"></span>5</span> The question(s) "Answered and Marked for Review" will be considered for evaluation.</li>
                            </ul>
                        </li>
                    </ol>

                    <div className="mt-8">
                        <p className="font-semibold text-slate-800 mb-4 text-base">Exam Pattern:</p>
                        <div className="overflow-x-auto rounded-xl border border-slate-200">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
                                        <th className="p-4 border-b border-slate-200">Exam Section</th>
                                        <th className="p-4 border-b border-slate-200 text-center">Questions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {test.MockTestSections?.sort((a,b)=>a.order_index - b.order_index).map((sec, idx) => (
                                        <tr key={sec.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                                            <td className="p-4 border-b border-slate-100 font-medium text-slate-700">{sec.name}</td>
                                            <td className="p-4 border-b border-slate-100 text-center">{sec.total_questions}</td>
                                        </tr>
                                    ))}
                                    <tr className="bg-slate-50 font-bold">
                                        <td className="p-4">Total</td>
                                        <td className="p-4 text-center">{totalQuestions}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100/50 mt-8">
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2"><span className="material-symbols-rounded text-amber-500 text-sm">priority_high</span> <strong>Positive Mark:</strong> Each correct question carries <strong>+{test.positive_marks || 2} marks</strong>.</li>
                            <li className="flex items-center gap-2"><span className="material-symbols-rounded text-amber-500 text-sm">priority_high</span> <strong>Negative Mark:</strong> For every wrong answer, <strong>-{test.negative_marks || 0.5} marks</strong> will be deducted.</li>
                            <li className="flex items-center gap-2"><span className="material-symbols-rounded text-amber-500 text-sm">priority_high</span> Unanswered questions carry no marks and result in no penalty.</li>
                        </ul>
                    </div>

                    <div className="flex justify-center mt-12 mb-4">
                        <button 
                            onClick={() => navigate(`/student/mock-test/${test.id}/take`)}
                            className="btn-primary-gradient px-12 py-4 text-lg font-bold shadow-xl shadow-primary-500/30 hover:shadow-primary-500/40 transition-all flex items-center gap-2 hover:-translate-y-1"
                        >
                            Begin Test <span className="material-symbols-rounded">play_arrow</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MockTestDetails;
