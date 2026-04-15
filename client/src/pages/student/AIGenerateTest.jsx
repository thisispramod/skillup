import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { motion, AnimatePresence } from 'framer-motion';

const AIGenerateTest = () => {
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('Analysing your recent performance...');
    const navigate = useNavigate();

    const generateAITest = async () => {
        setGenerating(true);
        setError('');
        
        try {
            // Step 1: Analysing
            setStatus('Analysing your recent performance...');
            await new Promise(r => setTimeout(r, 1500));
            
            // Step 2: Identifying weak topics
            setStatus('Identifying your weak topics...');
            await new Promise(r => setTimeout(r, 1500));
            
            // Step 3: Communicating with AI
            setStatus('Generating custom MCQ questions via AI...');
            const res = await api.get('/start-ai-test');
            
            if (res.data.questions) {
                setStatus('Ready! Launching your personalized test...');
                await new Promise(r => setTimeout(r, 1000));
                
                // Redirect to standard test page with the new DB test_id
                navigate(`/student/test/${res.data.test_id}`);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to generate AI test. The AI might be busy or you've reached your daily limit.");
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
            <AnimatePresence mode="wait">
                {!generating && !error && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="text-center space-y-8 max-w-xl"
                    >
                        <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-indigo-500/40">
                            <span className="material-symbols-rounded text-white text-5xl">auto_awesome</span>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold text-slate-900">Personalized AI Test</h1>
                            <p className="text-slate-500 text-lg">
                                We're ready to create a unique test just for you. It will focus on areas where you can improve the most.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                            <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-start gap-3">
                                <span className="material-symbols-rounded text-indigo-500 mt-1">target</span>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm">Targeted Topics</h3>
                                    <p className="text-xs text-slate-500">Focuses on your weak points</p>
                                </div>
                            </div>
                            <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-start gap-3">
                                <span className="material-symbols-rounded text-purple-500 mt-1">trending_up</span>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm">Scaling Difficulty</h3>
                                    <p className="text-xs text-slate-500">Adapts to your skill level</p>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={generateAITest}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 group"
                        >
                            <span>Launch AI Test Generation</span>
                            <span className="material-symbols-rounded group-hover:translate-x-1 transition-transform">rocket_launch</span>
                        </button>
                        <p className="text-sm text-slate-400">Limit: 3 Personal AI Tests per day</p>
                    </motion.div>
                )}

                {generating && (
                    <motion.div 
                        key="generating"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center space-y-8"
                    >
                        <div className="relative w-32 h-32 mx-auto">
                            <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent"
                            ></motion.div>
                            <div className="absolute inset-4 rounded-full bg-indigo-50 flex items-center justify-center">
                                <span className="material-symbols-rounded text-indigo-600 text-4xl animate-pulse">psychology</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-bold text-slate-800">{status}</h2>
                            <p className="text-slate-400 animate-pulse">This usually takes about 5-10 seconds...</p>
                        </div>
                    </motion.div>
                )}

                {error && (
                    <motion.div 
                        key="error"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-6 max-w-md"
                    >
                        <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                            <span className="material-symbols-rounded text-4xl">error</span>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-bold text-slate-900">Oops! Something went wrong</h2>
                            <p className="text-slate-500">{error}</p>
                        </div>
                        <button 
                            onClick={() => setError('')}
                            className="btn-premium px-8 py-3 bg-slate-100 text-slate-600"
                        >
                            Try again
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AIGenerateTest;
