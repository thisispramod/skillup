import React, { useEffect, useState, useRef, useContext } from 'react';
import api from '../../api';
import { AuthContext } from '../../context/AuthContext';
import StatCard from '../../components/common/StatCard';
import Modal from '../../components/common/Modal';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';

const MistakeBook = () => {
    const [mistakes, setMistakes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [retryMistake, setRetryMistake] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [retryResult, setRetryResult] = useState(null);
    const { updateXP } = useContext(AuthContext);

    // Language Toggle States
    const [language, setLanguage] = useState(() => localStorage.getItem('mistakebook_language') || 'en');
    const [translations, setTranslations] = useState({});
    const translationsRef = useRef({});
    useEffect(() => {
        translationsRef.current = translations;
    }, [translations]);
    const [isTranslating, setIsTranslating] = useState(false);

    const toggleLanguage = () => {
        const newLang = language === 'en' ? 'hi' : 'en';
        setLanguage(newLang);
        localStorage.setItem('mistakebook_language', newLang);
    };

    const translateText = async (text, targetLang) => {
        if (!text) return '';
        try {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
            const res = await fetch(url);
            const data = await res.json();
            return data[0].map(item => item[0]).join('');
        } catch (e) {
            console.error(e);
            return text;
        }
    };

    useEffect(() => {
        fetchMistakes();
    }, []);

    useEffect(() => {
        if (mistakes.length > 0) {
            let isActive = true;

            const runTranslationTasks = async () => {
                let firstNeedTran = true;
                for (let i = 0; i < mistakes.length; i++) {
                    if (!isActive) break;
                    const qObj = mistakes[i]?.Question;
                    if (!qObj) continue;

                    const qOrigLang = /[\u0900-\u097F]/.test(qObj.text || '') ? 'hi' : 'en';
                    if (qOrigLang === language || translationsRef.current[qObj.id]?.[language]) continue;

                    if (firstNeedTran) setIsTranslating(true);
                    firstNeedTran = false;

                    try {
                        // Fetch sequentially to prevent rate limits causing partial translations
                        const text = await translateText(qObj.text, language);
                        const optA = await translateText(qObj.option_a, language);
                        const optB = await translateText(qObj.option_b, language);
                        const optC = await translateText(qObj.option_c, language);
                        const optD = await translateText(qObj.option_d, language);
                        const expl = await translateText(qObj.explanation, language);
                        if (isActive) {
                            setTranslations(prev => ({
                                ...prev,
                                [qObj.id]: {
                                    ...prev[qObj.id],
                                    [language]: { text, option_a: optA, option_b: optB, option_c: optC, option_d: optD, explanation: expl }
                                }
                            }));
                        }
                    } catch (e) { }
                    await new Promise(r => setTimeout(r, 100)); // slight pause to prevent blocking
                }
                if (isActive) setIsTranslating(false);
            };
            runTranslationTasks();
            return () => { isActive = false; };
        }
    }, [language, mistakes]);

    const fetchMistakes = async () => {
        try {
            setLoading(true);
            const res = await api.get('/student/mistakes');
            setMistakes(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRetry = async () => {
        if (!selectedAnswer) return;
        try {
            const res = await api.post(`/student/mistakes/${retryMistake.id}/retry`, { answer: selectedAnswer });
            setRetryResult(res.data);
            // if (res.data.isCorrect) {
            //     // Update local status
            //     setMistakes(prev => prev.map(m => m.id === retryMistake.id ? { ...m, status: 'improved' } : m));

            // }
            if (res.data.isCorrect) {
                // Update local status
                setMistakes(prev => prev.map(m => m.id === retryMistake.id ? { ...m, status: res.data.status } : m));

                if (res.data.xpResult && res.data.xpResult.awarded > 0) {
                    if (updateXP) updateXP(res.data.xpResult.totalXP);
                }
            }
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'Failed to submit retry', 'error');
        }
    };

    const handleMarkRevised = async (mistakeId) => {
        try {
            await api.put(`/student/mistakes/${mistakeId}/revise`);
            setMistakes(prev => prev.map(m => m.id === mistakeId ? { ...m, status: 'revised' } : m));
            Swal.fire({
                icon: 'success',
                title: 'Marked as Revised',
                timer: 1500,
                showConfirmButton: false,
                toast: true,
                position: 'top-end'
            });
        } catch (err) { console.error(err); }
    };

    const filteredMistakes = mistakes.filter(m => {
        if (!m) return false;
        if (m.status === 'improved' || m.status === 'revised') return false;
        if (filter === 'all') return true;
        if (filter === 'incorrect') return m.is_incorrect;
        if (filter === 'slow') return m.is_slow;
        if (filter === 'bookmarked') return m.is_bookmarked;
        return true;
    });

    const stats = {
        active: mistakes.filter(m => m && m.status === 'active').length,
        improved: mistakes.filter(m => m && m.status === 'improved').length,
        total: mistakes.filter(Boolean).length
    };

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
    );

    let displayRetryQ = null;
    if (retryMistake?.Question) {
        const q = retryMistake.Question;
        const origLang = /[\u0900-\u097F]/.test(q.text || '') ? 'hi' : 'en';
        displayRetryQ = (origLang !== language && translations[q.id]?.[language])
            ? { ...q, ...translations[q.id][language] }
            : q;
    }

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Mistake Book</h1>
                    <p className="text-slate-500 font-medium">Focus on your weak areas and turn mistakes into mastery.</p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Language Toggle */}
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden font-bold text-sm shadow-sm transition-all hover:shadow"
                    >
                        <div className={`px-4 py-2 transition-colors ${language === 'en' ? 'bg-primary-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>EN</div>
                        <div className={`px-4 py-2 transition-colors ${language === 'hi' ? 'bg-primary-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>हिंदी</div>
                    </button>
                    {isTranslating && <div className="w-5 h-5 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Active Mistakes" value={stats.active} icon="error" color="danger" />
                <StatCard title="Improved" value={stats.improved} icon="check_circle" color="success" />
                <StatCard title="Total Logged" value={stats.total} icon="menu_book" color="primary" />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mr-2">Filter By:</span>
                {[
                    { id: 'all', label: 'All Pending', icon: 'list' },
                    { id: 'incorrect', label: 'Incorrect', icon: 'close' },
                    { id: 'slow', label: 'Slow', icon: 'timer' },
                    { id: 'bookmarked', label: 'Bookmarked', icon: 'bookmark' },
                ].map(f => (
                    <button
                        key={f.id}
                        onClick={() => setFilter(f.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === f.id
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                            : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                            }`}
                    >
                        <span className="material-symbols-rounded text-lg">{f.icon}</span>
                        {f.label}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="grid grid-cols-1 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredMistakes.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="card-premium p-20 text-center text-slate-400"
                        >
                            <span className="material-symbols-rounded text-6xl mb-4 text-emerald-500">task_alt</span>
                            <p className="text-lg font-bold text-slate-800">No active mistakes!</p>
                            <p>You've cleared all the flags in this category. Excellent work.</p>
                        </motion.div>
                    ) : filteredMistakes.map(mistake => {
                        const q = mistake.Question;
                        const origLang = /[\u0900-\u097F]/.test(q?.text || '') ? 'hi' : 'en';
                        const displayQ = (q && origLang !== language && translations[q.id]?.[language])
                            ? { ...q, ...translations[q.id][language] }
                            : q;

                        return (
                            <motion.div
                                key={mistake.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="card-premium p-6 border-l-4 border-l-rose-500 group"
                            >
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                    <div className="space-y-3 flex-1">
                                        <div className="flex flex-wrap gap-2">
                                            {mistake.is_incorrect && <span className="px-2 py-0.5 rounded-lg bg-rose-50 text-rose-600 text-[10px] font-bold uppercase tracking-wider">Wrong Answer</span>}
                                            {mistake.is_slow && <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider">Time Limit Exceeded</span>}
                                            {mistake.is_bookmarked && <span className="px-2 py-0.5 rounded-lg bg-primary-50 text-primary-600 text-[10px] font-bold uppercase tracking-wider">Flagged</span>}
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800 leading-relaxed">{displayQ?.text || 'Deleted Question'}</h3>
                                        <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                                            <div className="flex items-center gap-1">
                                                <span className="material-symbols-rounded text-sm">quiz</span>
                                                {mistake.Test?.title || 'Unknown Test'}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="material-symbols-rounded text-sm">label</span>
                                                {mistake.Question?.topic || 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-row md:flex-col gap-2 shrink-0">
                                        <button
                                            onClick={() => {
                                                setRetryMistake(mistake);
                                                setRetryResult(null);
                                                setSelectedAnswer('');
                                            }}
                                            className="btn-primary-gradient px-6 py-2 text-sm"
                                        >
                                            <span className="material-symbols-rounded mr-2 text-base">replay</span>
                                            Retry Now
                                        </button>
                                        <button
                                            onClick={() => handleMarkRevised(mistake.id)}
                                            className="btn-premium px-6 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 text-sm"
                                        >
                                            <span className="material-symbols-rounded mr-2 text-base">check</span>
                                            Mark Revised
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
            </div>

            {/* Retry Modal */}
            <Modal
                isOpen={!!retryMistake}
                onClose={() => setRetryMistake(null)}
                title="Review & Retry"
                size="md"
                footer={
                    !retryResult ? (
                        <div className="flex gap-3">
                            <button onClick={() => setRetryMistake(null)} className="btn-premium px-6 py-2 bg-slate-100 text-slate-600">Cancel</button>
                            <button
                                onClick={handleRetry}
                                disabled={!selectedAnswer}
                                className="btn-primary-gradient px-8 py-2"
                            >
                                Submit Answer
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setRetryMistake(null)} className="btn-primary-gradient px-8 py-2">Close Review</button>
                    )
                }
            >
                {retryMistake && (
                    <div className="space-y-6">
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                            <p className="text-lg font-bold text-slate-800 leading-relaxed">{displayRetryQ?.text || 'Deleted Question'}</p>
                        </div>

                        {!retryResult ? (
                            <div className="grid grid-cols-1 gap-3">
                                {['A', 'B', 'C', 'D'].map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => setSelectedAnswer(opt)}
                                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${selectedAnswer === opt
                                            ? 'bg-primary-50 border-primary-600 ring-4 ring-primary-500/10'
                                            : 'bg-white border-slate-100 hover:border-slate-300'
                                            }`}
                                    >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${selectedAnswer === opt ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                            {opt}
                                        </div>
                                        <span className={`font-semibold ${selectedAnswer === opt ? 'text-primary-900' : 'text-slate-700'}`}>
                                            {displayRetryQ?.[`option_${opt.toLowerCase()}`] || 'N/A'}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className={`p-6 rounded-3xl border-2 flex items-center gap-4 ${retryResult.isCorrect
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                    : 'bg-rose-50 border-rose-200 text-rose-800'
                                    }`}>
                                    <span className={`material-symbols-rounded text-4xl ${retryResult.isCorrect ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {retryResult.isCorrect ? 'check_circle' : 'cancel'}
                                    </span>
                                    <div>
                                        <p className="text-xl font-bold">{retryResult.isCorrect ? 'Correct Mastery!' : 'Still not quite right'}</p>
                                        <p className="text-sm font-medium opacity-80">{retryResult.isCorrect ? 'You have successfully improved this skill.' : 'Review the explanation below and try again later.'}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Learning Insight</p>
                                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                        <p className="text-slate-700 leading-relaxed font-medium">
                                            {displayRetryQ?.explanation || 'The correct answer is Option ' + retryMistake.Question?.correct_option + '.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default MistakeBook;
