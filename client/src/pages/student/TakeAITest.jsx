import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../api';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

const TakeAITest = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { questions, testId } = location.state || { questions: [], testId: null };

    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState({}); // { questionText: 'A' }
    const [timeLeft, setTimeLeft] = useState(questions.length * 60); // 1 min per question
    const [isSubmitting, setIsSubmitting] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        if (!questions || questions.length === 0) {
            navigate('/student/dashboard');
            return;
        }

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, []);

    const handleOptionSelect = (option) => {
        setAnswers(prev => ({
            ...prev,
            [questions[currentIdx].question]: option
        }));
    };

    const handleSubmit = async () => {
        clearInterval(timerRef.current);
        setIsSubmitting(true);

        try {
            const res = await api.post('/ai-test/submit', {
                questions,
                answers
            });

            if (res.data.success) {
                const { xpResult } = res.data;
                Swal.fire({
                    title: 'Test Completed!',
                    html: `
                        <div class="space-y-4 pt-4">
                            <div class="text-4xl font-black text-indigo-600 mb-2">${xpResult.awarded} XP</div>
                            <div class="text-slate-600">${xpResult.reasons.join('<br>')}</div>
                            <div class="mt-4 p-4 bg-slate-50 rounded-xl text-sm italic">
                                "Your performance data has been updated to personalize your next test."
                            </div>
                        </div>
                    `,
                    icon: 'success',
                    confirmButtonText: 'Back to Dashboard',
                    confirmButtonColor: '#4f46e5'
                }).then(() => {
                    navigate('/student/dashboard');
                });
            }
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'Failed to submit test. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!questions || questions.length === 0) return null;

    const currentQ = questions[currentIdx];
    const progress = ((currentIdx + 1) / questions.length) * 100;

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            {/* Header / Info */}
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm sticky top-4 z-20">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                        {currentIdx + 1}
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-800">AI Personal Test</h2>
                        <p className="text-xs text-slate-500">Topic: {currentQ.topic}</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${timeLeft < 60 ? 'border-rose-100 bg-rose-50 text-rose-600 animate-pulse' : 'border-slate-100 text-slate-600'}`}>
                        <span className="material-symbols-rounded text-sm font-bold">timer</span>
                        <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
                    </div>
                    <button 
                        onClick={handleSubmit} 
                        className="btn-premium bg-slate-900 text-white px-6 py-2"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Finish Test'}
                    </button>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-indigo-600"
                ></motion.div>
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIdx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm min-h-[400px]"
                >
                    <div className="flex items-center justify-between mb-8">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold uppercase tracking-wider">
                            {currentQ.difficulty} Difficulty
                        </span>
                        <span className="text-slate-400 text-sm">Question {currentIdx + 1} of {questions.length}</span>
                    </div>

                    <h1 className="text-2xl font-bold text-slate-800 mb-10 leading-relaxed">
                        {currentQ.question}
                    </h1>

                    <div className="grid grid-cols-1 gap-4">
                        {currentQ.options.map((opt, idx) => {
                            const isSelected = answers[currentQ.question] === opt;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleOptionSelect(opt)}
                                    className={`
                                        p-6 rounded-2xl border-2 text-left transition-all flex items-center gap-4
                                        ${isSelected 
                                            ? 'border-indigo-600 bg-indigo-50 shadow-md ring-4 ring-indigo-500/10' 
                                            : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}
                                    `}
                                >
                                    <div className={`
                                        w-8 h-8 rounded-full flex items-center justify-center font-bold border-2
                                        ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-400'}
                                    `}>
                                        {String.fromCharCode(65 + idx)}
                                    </div>
                                    <span className={`font-semibold ${isSelected ? 'text-indigo-700' : 'text-slate-600'}`}>
                                        {opt}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6">
                <button
                    onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                    disabled={currentIdx === 0}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all"
                >
                    <span className="material-symbols-rounded">arrow_back</span>
                    Previous
                </button>
                
                {currentIdx < questions.length - 1 ? (
                    <button
                        onClick={() => setCurrentIdx(prev => prev + 1)}
                        className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all"
                    >
                        Next Question
                        <span className="material-symbols-rounded">arrow_forward</span>
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all"
                    >
                        Submit Final Answers
                        <span className="material-symbols-rounded">check_circle</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default TakeAITest;
