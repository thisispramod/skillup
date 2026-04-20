import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

const GenerateTest = () => {
    const [topics, setTopics] = useState([]);
    const [loadingTopics, setLoadingTopics] = useState(true);
    const [error, setError] = useState('');
    const [generating, setGenerating] = useState(false);

    const [formData, setFormData] = useState({
        topic: '',
        difficulty: 'medium',
        numQs: 10,
        timeQs: 10
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchTopics();
    }, []);

    const fetchTopics = async () => {
        try {
            const res = await api.get('/student/topics');
            if (Array.isArray(res.data)) {
                setTopics(res.data);
                if (res.data.length > 0) {
                    setFormData(prev => ({ ...prev, topic: res.data[0] }));
                }
            } else {
                setTopics([]);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch topics');
        } finally {
            setLoadingTopics(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setGenerating(true);

        try {
            const res = await api.post('/student/generate-test', formData);
            const { test_id } = res.data;
            if (test_id) {
                // Navigate to the test taking page
                navigate(`/student/test/${test_id}`);
            }
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.error || 'Failed to generate test. Please try again.');
        } finally {
            setGenerating(false);
        }
    };

    if (loadingTopics) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                <div className="mb-8 text-center">
                    <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-rounded text-3xl">auto_awesome</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Auto Test Generator</h1>
                    <p className="text-slate-500">Generate a custom practice test tailored to your needs. Questions are dynamically selected to match the difficulty you choose.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl flex items-center gap-2">
                        <span className="material-symbols-rounded">error</span>
                        <p>{error}</p>
                    </div>
                )}

                {topics.length === 0 ? (
                    <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-200 text-slate-500">
                        <span className="material-symbols-rounded text-4xl mb-2 text-slate-400">inventory_2</span>
                        <p>No topics available to generate a test right now.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Topic Selection */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Select Topic</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-rounded text-slate-400">category</span>
                                <select
                                    name="topic"
                                    value={formData.topic}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all cursor-pointer appearance-none"
                                    required
                                >
                                    {topics.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Difficulty Selection */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-3">Difficulty Level</label>
                            <div className="grid grid-cols-3 gap-4">
                                {['easy', 'medium', 'hard'].map((level) => (
                                    <label key={level} className="relative cursor-pointer">
                                        <input
                                            type="radio"
                                            name="difficulty"
                                            value={level}
                                            checked={formData.difficulty === level}
                                            onChange={handleChange}
                                            className="sr-only peer"
                                        />
                                        <div className={`
                                            flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all
                                            peer-checked:border-primary-600 peer-checked:bg-primary-50 peer-checked:text-primary-700
                                            border-slate-200 hover:border-slate-300 text-slate-600 bg-white
                                        `}>
                                            <span className="material-symbols-rounded mb-1">
                                                {level === 'easy' ? 'sentiment_satisfied' : level === 'medium' ? 'sentiment_neutral' : 'sentiment_dissatisfied'}
                                            </span>
                                            <span className="font-medium capitalize text-sm">{level}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            <p className="mt-2 text-xs text-slate-500 text-center">
                                Difficulty is magically calculated based on how long other students take and their accuracy!
                            </p>
                        </div>

                        {/* Number of Questions */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center justify-between">
                                <span>Number of Questions</span>
                                <span className="text-primary-600 font-bold bg-primary-50 px-3 py-1 rounded-full text-xs">
                                    {formData.numQs} Questions
                                </span>
                            </label>
                            <input
                                type="range"
                                name="numQs"
                                min="5"
                                max="30"
                                step="5"
                                value={formData.numQs}
                                onChange={handleChange}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                            />
                            <div className="flex justify-between mt-2 text-xs text-slate-400 font-medium px-1">
                                <span>5</span>
                                <span>10</span>
                                <span>15</span>
                                <span>20</span>
                                <span>25</span>
                                <span>30</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center justify-between">
                                <span>Times Minutes </span>
                                <span className="text-primary-600 font-bold bg-primary-50 px-3 py-1 rounded-full text-xs">
                                    {formData.timeQs} Minutes
                                </span>
                            </label>
                            <input
                                type="range"
                                name="timeQs"
                                min="5"
                                max="60"
                                step="2"
                                value={formData.timeQs}
                                onChange={handleChange}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                            />
                            <div className="flex justify-between mt-2 text-xs text-slate-400 font-medium px-1">
                                <span>5m</span>
                                <span>15m</span>
                                <span>30m</span>
                                <span>45m</span>
                                <span>60m</span>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 border-t border-slate-100">
                            <button
                                type="submit"
                                disabled={generating}
                                className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {generating ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Generating Magic...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Generate & Start Test</span>
                                        <span className="material-symbols-rounded text-lg">arrow_forward</span>
                                    </>
                                )}
                            </button>
                        </div>

                    </form>
                )}
            </div>
        </div>
    );
};

export default GenerateTest;
