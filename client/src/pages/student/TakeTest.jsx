import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';

const TakeTest = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [test, setTest] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState(() => {
        const saved = localStorage.getItem(`test_answers_${id}`);
        return saved ? JSON.parse(saved) : {};
    });
    const [markedForReview, setMarkedForReview] = useState(() => {
        const saved = localStorage.getItem(`test_marked_${id}`);
        return saved ? JSON.parse(saved) : {};
    });
    const [timeLeft, setTimeLeft] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const timerRef = useRef(null);

    useEffect(() => {
        const fetchTestData = async () => {
            try {
                const res = await api.get(`/student/test/${id}/questions`);
                setTest(res.data);
                setQuestions(res.data.Questions || []);
                const savedTimeLeft = localStorage.getItem(`test_timer_${id}`);
                setTimeLeft(savedTimeLeft ? parseInt(savedTimeLeft) : res.data.duration_minutes * 60);
                setLoading(false);
            } catch (err) {
                Swal.fire('Error', 'Could not load test data', 'error');
                navigate('/dashboard');
            }
        };
        fetchTestData();

        const preventRefresh = (e) => {
            e.preventDefault();
            e.returnValue = '';
        };
        window.addEventListener('beforeunload', preventRefresh);
        return () => window.removeEventListener('beforeunload', preventRefresh);
    }, [id, navigate]);

    useEffect(() => {
        if (!loading && timeLeft > 0 && !submitting) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    const newTime = prev - 1;
                    localStorage.setItem(`test_timer_${id}`, newTime.toString());
                    if (newTime <= 0) {
                        clearInterval(timerRef.current);
                        autoSubmit();
                        return 0;
                    }
                    return newTime;
                });
            }, 1000);
            return () => clearInterval(timerRef.current);
        }
    }, [loading, timeLeft, submitting, id]);

    useEffect(() => {
        if (Object.keys(answers).length > 0) {
            localStorage.setItem(`test_answers_${id}`, JSON.stringify(answers));
        }
    }, [answers, id]);

    useEffect(() => {
        localStorage.setItem(`test_marked_${id}`, JSON.stringify(markedForReview));
    }, [markedForReview, id]);

    const autoSubmit = () => submitTest(true);

    const handleSelect = (option) => {
        const qId = questions[currentQ]?.id;
        if (!qId) return;
        setAnswers(prev => ({ ...prev, [qId]: option }));
    };

    const handleMarkForReview = () => {
        const qId = currentQuestion?.id;
        if (!qId) return;
        setMarkedForReview(prev => ({
            ...prev,
            [qId]: !prev[qId]
        }));
    };

    const submitTest = async (isAuto = false) => {
        if (!isAuto) {
            const result = await Swal.fire({
                title: 'Finish Exam?',
                text: "Are you sure you want to submit your answers?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes, Submit',
                customClass: {
                    confirmButton: 'btn-primary-gradient',
                    popup: 'rounded-3xl'
                }
            });
            if (!result.isConfirmed) return;
        }

        setSubmitting(true);
        if (timerRef.current) clearInterval(timerRef.current);

        try {
            const res = await api.post('/student/submit', {
                test_id: id,
                answers,
                timeSpentPerQuestion: {} // Simplified for now
            });

            localStorage.removeItem(`test_answers_${id}`);
            localStorage.removeItem(`test_timer_${id}`);
            localStorage.removeItem(`test_marked_${id}`);

            await Swal.fire({
                icon: 'success',
                title: 'Submitted!',
                text: 'Your test has been successfully submitted.',
                timer: 2000,
                showConfirmButton: false
            });
            navigate(`/student/result/${res.data.attempt_id}`);
        } catch (err) {
            Swal.fire('Error', 'Failed to submit test. Please check your connection.', 'error');
            setSubmitting(false);
        }
    };

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="font-bold text-slate-600">Preparing your exam environment...</p>
            </div>
        </div>
    );

    const currentQuestion = questions[currentQ];
    const selectedOption = currentQuestion ? answers[currentQuestion.id] : null;

    if (!currentQuestion) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center">
                <span className="material-symbols-rounded text-6xl text-slate-300 mb-4">error</span>
                <p className="text-xl font-bold text-slate-800">Question not found</p>
                <button onClick={() => navigate('/dashboard')} className="mt-4 text-primary-600 font-bold">Back to Dashboard</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col fixed inset-0 z-[60]">
            {/* Top Bar */}
            <div className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white">
                        <span className="material-symbols-rounded">school</span>
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-800 leading-none">{test.title}</h2>
                        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-bold">Standard Achievement Exam</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className={`flex items-center gap-3 px-6 py-2.5 rounded-2xl font-mono text-xl font-bold border-2 transition-colors ${timeLeft < 300 ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse' : 'bg-slate-50 border-slate-100 text-slate-700'
                        }`}>
                        <span className="material-symbols-rounded">timer</span>
                        {formatTime(timeLeft)}
                    </div>
                    <button
                        onClick={() => submitTest(false)}
                        className="btn-premium px-8 py-2.5 bg-slate-900 text-white hover:bg-slate-800"
                    >
                        Finish Exam
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Question Area */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-12 custom-scrollbar">
                    <div className="max-w-3xl mx-auto space-y-10">
                        <div className="flex items-center gap-4">
                            <span className="w-12 h-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-primary-500/30">
                                {currentQ + 1}
                            </span>
                            <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-primary-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                                />
                            </div>
                            <span className="text-sm font-bold text-slate-400">
                                {currentQ + 1} / {questions.length}
                            </span>
                        </div>

                        <div className="space-y-8">
                            <h1 className="text-2xl font-bold text-slate-800 leading-relaxed">
                                {currentQuestion?.text}
                            </h1>

                            <div className="grid grid-cols-1 gap-4">
                                {['A', 'B', 'C', 'D'].map((opt) => (
                                    <motion.button
                                        key={opt}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleSelect(opt)}
                                        className={`group flex items-center gap-4 p-5 rounded-3xl border-2 text-left transition-all ${selectedOption === opt
                                            ? 'bg-primary-50 border-primary-600 ring-4 ring-primary-500/10'
                                            : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                                            }`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-colors ${selectedOption === opt
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                                            }`}>
                                            {opt}
                                        </div>
                                        <span className={`text-lg font-medium transition-colors ${selectedOption === opt ? 'text-primary-900' : 'text-slate-700'
                                            }`}>
                                            {currentQuestion?.[`option_${opt.toLowerCase()}`]}
                                        </span>
                                        {selectedOption === opt && (
                                            <span className="material-symbols-rounded ml-auto text-primary-600">check_circle</span>
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Question Palette (Desktop) */}
                <div className="hidden lg:block w-80 bg-white border-l border-slate-200 p-6 overflow-y-auto">
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <span className="material-symbols-rounded text-primary-500">grid_view</span>
                        Exam Navigator
                    </h3>

                    <div className="grid grid-cols-5 gap-3">
                        {questions.map((q, idx) => (
                            <button
                                key={q.id}
                                onClick={() => setCurrentQ(idx)}
                                className={`w-10 h-10 rounded-xl text-xs font-bold transition-all relative ${currentQ === idx
                                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30 ring-2 ring-primary-500 ring-offset-2'
                                    : markedForReview[q.id]
                                        ? 'bg-amber-100 text-amber-700 border border-amber-300'
                                        : answers[q.id]
                                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                            : 'bg-slate-50 text-slate-400 border border-slate-100 hover:border-slate-300'
                                    }`}
                            >
                                {idx + 1}
                                {markedForReview[q.id] && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white"></div>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="mt-10 space-y-3">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Legend</p>
                        <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                            <div className="w-3 h-3 rounded-full bg-primary-600"></div> Current
                        </div>
                        <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                            <div className="w-3 h-3 rounded-full bg-emerald-400"></div> Answered
                        </div>
                        <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                            <div className="w-3 h-3 rounded-full bg-amber-400"></div> Marked Review
                        </div>
                        <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                            <div className="w-3 h-3 rounded-full bg-slate-200"></div> Not Answered
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Navigation (Mobile Friendly) */}
            <div className="h-20 bg-white border-t border-slate-200 px-6 flex items-center justify-between shrink-0 mb-safe">
                <button
                    onClick={() => setCurrentQ(prev => Math.max(0, prev - 1))}
                    disabled={currentQ === 0}
                    className="btn-premium px-6 bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50"
                >
                    <span className="material-symbols-rounded">chevron_left</span>
                    <span className="hidden sm:inline ml-2">Previous</span>
                </button>

                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-700 sm:hidden">
                        {currentQ + 1} / {questions.length}
                    </span>
                    <button
                        onClick={handleMarkForReview}
                        className={`p-3 rounded-2xl transition-all ${markedForReview[currentQuestion?.id]
                            ? 'bg-amber-100 text-amber-600 ring-2 ring-amber-200'
                            : 'text-slate-400 hover:bg-slate-100'
                            }`}
                        title="Mark for Review"
                    >
                        <span className="material-symbols-rounded">
                            {markedForReview[currentQuestion?.id] ? 'bookmark_added' : 'bookmark'}
                        </span>
                    </button>
                </div>

                {currentQ < questions.length - 1 ? (
                    <button
                        onClick={() => setCurrentQ(prev => prev + 1)}
                        className="btn-primary-gradient px-8"
                    >
                        <span className="hidden sm:inline mr-2">Next Question</span>
                        <span className="material-symbols-rounded">chevron_right</span>
                    </button>
                ) : (
                    <button
                        onClick={() => submitTest(false)}
                        className="btn-premium px-8 bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20"
                    >
                        Submit Test
                        <span className="material-symbols-rounded ml-2">check_circle</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default TakeTest;
