import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import Swal from 'sweetalert2';

const TakeMockTest = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [test, setTest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(0);
    const [activeSectionId, setActiveSectionId] = useState(null);
    const [activeQuestionId, setActiveQuestionId] = useState(null);
    const [answers, setAnswers] = useState({}); 
    // { qId: { ans: 'A', status: 'answered'|'markedReview'|'notAnswered'|'notVisited' } }
    
    // For time tracking per question
    const [qStartTime, setQStartTime] = useState(Date.now());
    const [timeSpent, setTimeSpent] = useState({}); // { qId: seconds }

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const res = await api.get(`/student/mock-tests/${id}/start`);
                const testData = res.data;
                setTest(testData);
                setTimeLeft(testData.duration_minutes * 60);
                
                let initAnswers = {};
                let firstSecId = null;
                let firstQId = null;
                const sortedSections = [...(testData.MockTestSections || [])].sort((a, b) => a.order_index - b.order_index);

                const attempt = testData.attempt;

                if (attempt && attempt.status === 'IN_PROGRESS') {
                    try {
                        const dbAnswers = JSON.parse(attempt.answers_json || '{}');
                        if (Object.keys(dbAnswers).length > 0) initAnswers = dbAnswers;
                    } catch(e) {}
                    setTimeLeft(attempt.time_left);

                    firstQId = attempt.last_saved_question_index; 
                    if (!firstQId && sortedSections.length > 0 && sortedSections[0].MockTestQuestions?.length > 0) {
                        firstQId = sortedSections[0].MockTestQuestions[0].id;
                        firstSecId = sortedSections[0].id;
                    } else if (firstQId) {
                        sortedSections.forEach(sec => {
                            if (sec.MockTestQuestions?.some(q => q.id === firstQId)) {
                                firstSecId = sec.id;
                            }
                        });
                    }
                } else {
                    setTimeLeft(testData.duration_minutes * 60);
                }

                if (Object.keys(initAnswers).length === 0) {
                    sortedSections.forEach((sec) => {
                        sec.MockTestQuestions?.forEach((q) => {
                            initAnswers[q.id] = { ans: null, status: 'notVisited' };
                            if (!firstQId) {
                                firstQId = q.id;
                                firstSecId = sec.id;
                            }
                        });
                    });
                } else if (!firstQId && Object.keys(initAnswers).length > 0) {
                    firstQId = parseInt(Object.keys(initAnswers)[0]); 
                    sortedSections.forEach(sec => {
                        if (sec.MockTestQuestions?.some(q => q.id === firstQId)) {
                            firstSecId = sec.id;
                        }
                    });
                }
                
                if (!firstSecId && sortedSections.length > 0) {
                    firstSecId = sortedSections[0].id;
                }
                
                setAnswers(initAnswers);
                setActiveSectionId(firstSecId);
                setActiveQuestionId(firstQId);
                
                if (firstQId && !initAnswers[firstQId]) {
                    setAnswers(prev => ({...prev, [firstQId]: { ans: null, status: 'notAnswered' }}));
                } else if (firstQId && initAnswers[firstQId]?.status === 'notVisited') {
                    setAnswers(prev => ({...prev, [firstQId]: { ...prev[firstQId], status: 'notAnswered' }}));
                }
                
            } catch (err) {
                Swal.fire('Error', 'Failed to load test', 'error');
                navigate('/student/mock-tests');
            } finally {
                setLoading(false);
            }
        };
        fetchTest();
    }, [id, navigate]);

    const answersRefForUnload = useRef(answers);
    const timeLeftRefForUnload = useRef(timeLeft);
    const activeQuestionIdRefForUnload = useRef(activeQuestionId);

    useEffect(() => { answersRefForUnload.current = answers; }, [answers]);
    useEffect(() => { timeLeftRefForUnload.current = timeLeft; }, [timeLeft]);
    useEffect(() => { activeQuestionIdRefForUnload.current = activeQuestionId; }, [activeQuestionId]);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (token) {
                fetch(`${api.defaults.baseURL || 'http://localhost:5005/api'}/student/mock-tests/${id}/pause`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({
                        answers: answersRefForUnload.current,
                        timeLeft: timeLeftRefForUnload.current,
                        currentQ: activeQuestionIdRefForUnload.current
                    }),
                    keepalive: true
                }).catch(() => {});
            }
        };

        window.addEventListener('unload', handleBeforeUnload);
        return () => window.removeEventListener('unload', handleBeforeUnload);

    }, [id]);

    const timerRef = useRef(null);

    useEffect(() => {
        if (!loading && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    const nextTime = prev - 1;
                    if (nextTime <= 0) {
                        clearInterval(timerRef.current);
                        handleSubmit(true);
                        return 0;
                    }
                    return nextTime;
                });
            }, 1000);
            return () => clearInterval(timerRef.current);
        }
    }, [loading]);

    const recordTime = useCallback(() => {
        if (!activeQuestionId) return;
        const now = Date.now();
        const spentObj = Math.floor((now - qStartTime) / 1000);
        setTimeSpent(prev => ({
            ...prev,
            [activeQuestionId]: (prev[activeQuestionId] || 0) + spentObj
        }));
        setQStartTime(now);
    }, [activeQuestionId, qStartTime]);

    const activeSection = test?.MockTestSections?.find(s => s.id === activeSectionId);
    const questions = activeSection ? activeSection.MockTestQuestions : [];
    const activeQIndex = questions.findIndex(q => q.id === activeQuestionId);
    const activeQ = questions[activeQIndex];

    const changeQuestion = (qId) => {
        recordTime();
        setActiveQuestionId(qId);
        setAnswers(prev => {
            const currentStatus = prev[qId]?.status;
            if (currentStatus === 'notVisited') {
                return { ...prev, [qId]: { ...prev[qId], status: 'notAnswered' } };
            }
            return prev;
        });
    };

    const changeSection = (secId) => {
        const sec = test.MockTestSections.find(s => s.id === secId);
        if (sec && sec.MockTestQuestions?.length > 0) {
            setActiveSectionId(secId);
            changeQuestion(sec.MockTestQuestions[0].id);
        }
    };

    const handleOptionSelect = (opt) => {
        setAnswers(prev => ({
            ...prev,
            [activeQuestionId]: { ...prev[activeQuestionId], ans: opt }
        }));
    };

    const handleSaveAndNext = () => {
        setAnswers(prev => {
            const current = prev[activeQuestionId];
            return {
                ...prev,
                [activeQuestionId]: { 
                    ...current, 
                    status: current.ans ? 'answered' : 'notAnswered' 
                }
            };
        });
        moveToNext();
    };

    const handleMarkReview = () => {
        setAnswers(prev => {
            const current = prev[activeQuestionId];
            return {
                ...prev,
                [activeQuestionId]: { 
                    ...current, 
                    status: 'markedReview' 
                }
            };
        });
        moveToNext();
    };

    const handleClearResponse = () => {
        setAnswers(prev => ({
            ...prev,
            [activeQuestionId]: { ans: null, status: 'notAnswered' }
        }));
    };

    const moveToNext = () => {
        if (activeQIndex < questions.length - 1) {
            changeQuestion(questions[activeQIndex + 1].id);
        } else {
            // Find next section
            const sortedSecs = [...test.MockTestSections].sort((a,b)=>a.order_index-b.order_index);
            const sIdx = sortedSecs.findIndex(s => s.id === activeSectionId);
            if (sIdx < sortedSecs.length - 1) {
                changeSection(sortedSecs[sIdx + 1].id);
            } else {
                Swal.fire({
                    title: 'End of Test reached',
                    text: 'You have reached the end of the test. You can review your answers or submit.',
                    icon: 'info',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });
            }
        }
    };

    const handlePause = async () => {
        const result = await Swal.fire({
            title: 'Pause Exam?',
            text: "Your progress will be saved. You can resume later from 'Ongoing Tests'.",
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Yes, Pause',
            customClass: {
                confirmButton: 'btn-primary-gradient',
                popup: 'rounded-3xl'
            }
        });
        if (!result.isConfirmed) return;

        recordTime();
        try {
            await api.post(`/student/mock-tests/${test.id}/pause`, {
                answers,
                timeLeft,
                currentQ: activeQuestionId
            });
            await Swal.fire({icon:'success', title:'Paused', text:'Mock Test progress saved.', timer: 1500, showConfirmButton: false});
            navigate('/student/ongoing-tests');
        } catch (err) {
            Swal.fire('Error', 'Failed to pause test.', 'error');
        }
    };

    const handleSubmit = async (autoSubmit = false) => {
        recordTime();
        
        if (!autoSubmit) {
            const result = await Swal.fire({
                title: 'Submit Test?',
                text: "Are you sure you want to submit the test?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#10b981',
                cancelButtonColor: '#64748b',
                confirmButtonText: 'Yes, Submit'
            });
            if (!result.isConfirmed) return;
        }

        try {
            Swal.fire({ title: 'Submitting test...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
            
            const payload = {
                answers,
                timeSpentPerQuestion: timeSpent,
                totalTime: (test.duration_minutes * 60) - timeLeft
            };
            
            const res = await api.post(`/student/mock-tests/${test.id}/submit`, payload);
            Swal.close();
            navigate(`/student/mock-test-result/${res.data.attempt_id}`, { state: { xpResult: res.data.xpResult }, replace: true });
        } catch (err) {
            Swal.fire('Error', 'Failed to submit test', 'error');
        }
    };

    // Format Time
    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
    );

    if (!activeQ) return <div className="p-8 text-center bg-white border border-slate-200 rounded-xl m-8">No questions available in this test.</div>;

    const currentAns = answers[activeQuestionId]?.ans;

    // Get count for legends
    let cAnswered = 0, cNotAnswered = 0, cNotVisited = 0, cMarked = 0, cMarkedAns = 0;
    Object.values(answers).forEach(st => {
        if (st.status === 'answered') cAnswered++;
        else if (st.status === 'notAnswered') cNotAnswered++;
        else if (st.status === 'notVisited') cNotVisited++;
        else if (st.status === 'markedReview') {
            if (st.ans) cMarkedAns++;
            else cMarked++;
        }
    });

    return (
        <div className="min-h-screen flex flex-col bg-slate-100 font-sans select-none">
            {/* Top Bar */}
            <div className="h-14 bg-slate-800 text-white flex items-center justify-between px-6 shadow-md z-10 sticky top-0">
                <div className="font-bold text-lg tracking-wide">{test.title}</div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 bg-slate-900 px-4 py-1.5 rounded-full border border-slate-700">
                        <span className="material-symbols-rounded text-[20px] text-amber-400">timer</span>
                        <span className="font-mono text-lg font-bold tracking-wider text-amber-400">
                            {formatTime(timeLeft)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Side (Questions) - 75% */}
                <div className="flex-1 flex flex-col min-w-0 bg-white shadow-[10px_0_15px_-3px_rgba(0,0,0,0.05)] z-0 relative">
                    {/* Section Tabs */}
                    <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50 custom-scrollbar">
                        {test.MockTestSections?.sort((a,b)=>a.order_index-b.order_index).map((sec) => (
                            <button
                                key={sec.id}
                                onClick={() => changeSection(sec.id)}
                                className={`whitespace-nowrap px-6 py-3 font-semibold text-sm transition-colors border-b-2
                                    ${activeSectionId === sec.id 
                                        ? 'border-primary-600 text-primary-700 bg-white shadow-[0_-2px_0_inset_#4f46e5]' 
                                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
                            >
                                {sec.name}
                            </button>
                        ))}
                    </div>

                    {/* Question Header */}
                    <div className="px-8 py-3 flex justify-between items-center border-b border-slate-100 bg-white">
                        <div className="font-bold text-slate-800 text-lg">Question No. {activeQIndex + 1}</div>
                        <div className="flex gap-4">
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded">+{test.positive_marks || 2} Marks</span>
                            <span className="text-xs font-bold text-rose-500 bg-rose-50 px-3 py-1 rounded">-{test.negative_marks || 0.5} Marks</span>
                        </div>
                    </div>

                    {/* Question Content */}
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        <div className="text-lg text-slate-800 mb-6 font-medium whitespace-pre-wrap leading-relaxed">{activeQ.text}</div>
                        {activeQ.image_url && (
                            <img src={activeQ.image_url} alt="Question" className="max-w-full rounded-xl border border-slate-200 mb-8 max-h-64 object-contain" />
                        )}

                        <div className="space-y-4 max-w-3xl">
                            {['A', 'B', 'C', 'D'].map(opt => {
                                const optText = activeQ[`option_${opt.toLowerCase()}`];
                                const optImg = activeQ[`option_${opt.toLowerCase()}_image`];
                                const isSelected = currentAns === opt;
                                
                                return (
                                    <label 
                                        key={opt}
                                        className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer group
                                            ${isSelected ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50'}
                                        `}
                                    >
                                        <div className="pt-1">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                                                ${isSelected ? 'border-primary-600' : 'border-slate-400 group-hover:border-primary-400'}
                                            `}>
                                                {isSelected && <div className="w-2.5 h-2.5 bg-primary-600 rounded-full" />}
                                            </div>
                                            <input 
                                                type="radio" 
                                                name="option" 
                                                className="hidden" 
                                                checked={isSelected}
                                                onChange={() => handleOptionSelect(opt)} 
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <span className={`text-base ${isSelected ? 'text-primary-900 font-medium' : 'text-slate-700'}`}>
                                                {optText}
                                            </span>
                                            {optImg && (
                                                <img src={optImg} alt={`Option ${opt}`} className="max-h-40 rounded-lg border border-slate-200 mt-3" />
                                            )}
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Action Footer */}
                    <div className="h-16 border-t border-slate-200 bg-slate-50 flex items-center justify-between px-8">
                        <div className="flex gap-4">
                            <button 
                                onClick={handleMarkReview}
                                className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-colors shadow-sm"
                            >
                                Mark for Review & Next
                            </button>
                            <button 
                                onClick={handleClearResponse}
                                className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-colors shadow-sm"
                            >
                                Clear Response
                            </button>
                        </div>
                        <button 
                            onClick={handleSaveAndNext}
                            className="btn-primary-gradient px-8 py-2.5"
                        >
                            Save & Next
                        </button>
                    </div>
                </div>

                {/* Right Side (Palette) - 25% */}
                <div className="w-80 flex flex-col bg-slate-50 z-10 flex-shrink-0">
                    {/* User Info */}
                    <div className="p-4 border-b border-slate-200 bg-white flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex justify-center items-center text-lg font-bold">
                            <span className="material-symbols-rounded">person</span>
                        </div>
                        <div className="text-sm font-bold text-slate-700">Candidate</div>
                    </div>

                    {/* Legend Grid */}
                    <div className="p-4 bg-white border-b border-slate-200 text-xs font-semibold text-slate-600 grid grid-cols-2 gap-y-3 gap-x-2">
                        <div className="flex items-center gap-2"><div className="w-6 h-6 flex items-center justify-center rounded-t-lg bg-emerald-500 text-white" style={{clipPath: "polygon(50% 0%, 100% 25%, 100% 100%, 0 100%, 0 25%)"}}>{cAnswered}</div> Answered</div>
                        <div className="flex items-center gap-2"><div className="w-6 h-6 flex items-center justify-center rounded-b-md bg-rose-500 text-white" style={{clipPath: "polygon(50% 100%, 100% 75%, 100% 0, 0 0, 0 75%)"}}>{cNotAnswered}</div> Not Answered</div>
                        <div className="flex items-center gap-2"><div className="w-6 h-6 flex items-center justify-center rounded bg-white border border-slate-300">{cNotVisited}</div> Not Visited</div>
                        <div className="flex items-center gap-2"><div className="w-6 h-6 flex items-center justify-center rounded-full bg-indigo-500 text-white">{cMarked}</div> Marked for Review</div>
                        <div className="flex items-center gap-2 col-span-2 mt-1"><div className="w-6 h-6 flex items-center justify-center rounded-full bg-indigo-500 text-white relative"><div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white"></div>{cMarkedAns}</div> Answered & Marked for Review</div>
                    </div>

                    <div className="p-3 bg-indigo-50 text-indigo-700 font-bold text-sm border-b border-indigo-100 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] text-center relative z-10">
                        {activeSection?.name}
                    </div>

                    {/* Palette Buttons */}
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-50">
                        <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Choose a Question</h3>
                        <div className="grid grid-cols-4 gap-3">
                            {questions.map((q, idx) => {
                                const st = answers[q.id]?.status || 'notVisited';
                                const hasAns = answers[q.id]?.ans;
                                
                                let btnClass = "w-11 h-11 flex justify-center items-center text-sm font-bold shadow-sm transition-transform hover:scale-110 active:scale-95 mx-auto ";
                                
                                if (st === 'answered') {
                                    btnClass += "bg-emerald-500 text-white rounded-t-xl clip-answered";
                                } else if (st === 'notAnswered') {
                                    btnClass += "bg-rose-500 text-white rounded-b-xl clip-not-answered";
                                } else if (st === 'markedReview') {
                                    btnClass += "bg-indigo-500 text-white rounded-full relative";
                                } else {
                                    btnClass += "bg-white text-slate-700 border border-slate-300 rounded-md hover:border-slate-400";
                                }

                                const isActive = q.id === activeQuestionId;

                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => changeQuestion(q.id)}
                                        className={`relative mx-auto ${isActive ? 'ring-2 ring-primary-500 ring-offset-2 rounded-full' : ''}`}
                                    >
                                        <div 
                                            className={btnClass}
                                            style={
                                                st === 'answered' ? { clipPath: "polygon(50% 0%, 100% 25%, 100% 100%, 0 100%, 0 25%)" } :
                                                st === 'notAnswered' ? { clipPath: "polygon(50% 100%, 100% 75%, 100% 0, 0 0, 0 75%)" } : {}
                                            }
                                        >
                                            {idx + 1}
                                            {st === 'markedReview' && hasAns && (
                                                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-white p-4 border-t border-slate-200 space-y-3">
                        <button 
                            onClick={handlePause}
                            className="w-full py-3 bg-amber-500 hover:bg-amber-600 border border-amber-600 text-white font-bold rounded-xl shadow-lg shadow-amber-500/30 transition-all active:scale-[0.98]"
                        >
                            Pause Test
                        </button>
                        <button 
                            onClick={() => handleSubmit(false)}
                            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 border border-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all active:scale-[0.98]"
                        >
                            Submit Test
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TakeMockTest;
