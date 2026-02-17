import React, { useEffect, useState } from 'react';
import api from '../../api';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const MistakeAnalytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [students, setStudents] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [studentMistakes, setStudentMistakes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [studentLoading, setStudentLoading] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [analyticsRes, studentsRes] = await Promise.all([
                api.get('/admin/mistakes/analytics'),
                api.get('/admin/students')
            ]);
            setAnalytics(analyticsRes.data);
            setStudents(studentsRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStudentMistakes = async (studentId) => {
        if (!studentId) return;
        setStudentLoading(true);
        try {
            const res = await api.get(`/admin/mistakes/student/${studentId}`);
            setStudentMistakes(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setStudentLoading(false);
        }
    };

    const handleStudentChange = (e) => {
        const id = e.target.value;
        setSelectedStudentId(id);
        if (id) {
            fetchStudentMistakes(id);
        } else {
            setStudentMistakes([]);
        }
    };

    const columns = [
        {
            header: 'Question', key: 'Question', render: (row) => (
                <div className="flex flex-col max-w-md">
                    <span className="font-bold text-slate-800 line-clamp-1">{row.Question.text}</span>
                    <span className="text-xs text-slate-400">Test: {row.Test.title}</span>
                </div>
            )
        },
        {
            header: 'Status', key: 'status', render: (row) => (
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${row.status === 'active' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                    {row.status}
                </span>
            )
        },
        {
            header: 'Reason', key: 'id', render: (row) => (
                <div className="flex gap-1">
                    {row.is_incorrect && <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[9px] font-bold text-slate-500 uppercase">Incorrect</span>}
                    {row.is_slow && <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[9px] font-bold text-slate-500 uppercase">Slow</span>}
                </div>
            )
        },
        {
            header: 'Retries', key: 'retry_count', render: (row) => (
                <span className="font-bold text-slate-700">{row.retry_count}</span>
            )
        }
    ];

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link to="/admin/dashboard" className="p-2 rounded-xl text-slate-400 hover:bg-white hover:text-slate-600 border border-transparent hover:border-slate-200 transition-all">
                        <span className="material-symbols-rounded">arrow_back</span>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Mistake Analytics</h1>
                        <p className="text-slate-500 font-medium">Global view of student pain points and common errors.</p>
                    </div>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Batch Distribution */}
                <div className="card-premium p-6">
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <span className="material-symbols-rounded text-primary-500">groups</span>
                        Batch Weakness Area
                    </h3>
                    <div className="space-y-6">
                        {analytics?.batchWeakness.length === 0 ? (
                            <p className="p-12 text-center text-slate-400">No data found</p>
                        ) : (
                            analytics?.batchWeakness.map((batch, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-bold text-slate-700">{batch.User?.Batch?.name || 'Unassigned'}</span>
                                        <span className="text-xs font-bold text-slate-400">{batch.mistake_count} Active Mistakes</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(batch.mistake_count * 10, 100)}%` }}
                                            className="h-full bg-rose-500"
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Most Common Mistakes */}
                <div className="card-premium p-6">
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <span className="material-symbols-rounded text-rose-500">warning</span>
                        Common Failures
                    </h3>
                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                        {analytics?.commonQuestions.map((item, idx) => (
                            <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4 group hover:border-rose-200 transition-colors">
                                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-rose-500 font-bold shrink-0">
                                    {item.count}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-800 line-clamp-1">{item.Question.text}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{item.Question.topic}</p>
                                </div>
                                <span className="material-symbols-rounded text-slate-300">chevron_right</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Student Explorer */}
            <div className="space-y-6 pt-6">
                <div className="card-premium p-6 bg-primary-600 text-white border-none shadow-primary-500/30">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="max-w-md">
                            <h2 className="text-xl font-bold mb-1">Student Explorer</h2>
                            <p className="text-primary-100 text-sm">Select a specific student to see their individual mistake profile and learning progress.</p>
                        </div>
                        <div className="w-full sm:w-80">
                            <select
                                className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white outline-none focus:ring-4 focus:ring-white/10 transition-all font-bold cursor-pointer"
                                value={selectedStudentId}
                                onChange={handleStudentChange}
                            >
                                <option className="text-slate-800" value="">Choose a Student...</option>
                                {students.map(s => (
                                    <option className="text-slate-800" key={s.id} value={s.id}>
                                        {s.name} ({s.email.split('@')[0]})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {selectedStudentId && (
                        <motion.div
                            key={selectedStudentId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <DataTable
                                columns={columns}
                                data={studentMistakes}
                                loading={studentLoading}
                                pageSize={5}
                                emptyMessage="This student has no recorded mistakes. Perfect score!"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default MistakeAnalytics;
