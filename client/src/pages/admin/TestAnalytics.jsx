import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const TestAnalytics = () => {
    const { id } = useParams();
    const [analytics, setAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [testTitle, setTestTitle] = useState('');

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const testRes = await api.get(`/tests/${id}`);
                setTestTitle(testRes.data.title);

                const res = await api.get(`/admin/analytics/questions/${id}`);
                setAnalytics(res.data);
            } catch (err) {
                console.error(err);
                Swal.fire('Error', 'Failed to fetch analytics', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [id]);

    const exportToCSV = () => {
        const headers = ['Question', 'Avg Time Spent (s)', 'Accuracy (%)', 'Total Attempts'];
        const rows = analytics.map(q => [
            `"${q.text.replace(/"/g, '""')}"`,
            q.avgTimeSpent,
            q.accuracy,
            q.totalAttempts
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `analytics_test_${id}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        Swal.fire({
            icon: 'success',
            title: 'Report Downloaded',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000
        });
    };

    const columns = [
        {
            header: 'Question Content', key: 'text', render: (row) => (
                <div className="max-w-md">
                    <p className="font-bold text-slate-800 line-clamp-1">{row.text}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{row.topic || 'General'}</p>
                </div>
            )
        },
        {
            header: 'Avg Time', key: 'avgTimeSpent', render: (row) => (
                <div className="flex items-center gap-2 font-mono font-bold text-slate-600">
                    <span className="material-symbols-rounded text-slate-300 text-sm">schedule</span>
                    {row.avgTimeSpent}s
                </div>
            )
        },
        {
            header: 'Accuracy', key: 'accuracy', render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${row.accuracy > 70 ? 'bg-emerald-500' : row.accuracy > 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                            style={{ width: `${row.accuracy}%` }}
                        />
                    </div>
                    <span className="text-xs font-bold text-slate-700">{row.accuracy}%</span>
                </div>
            )
        },
        {
            header: 'Insights', key: 'id', render: (row) => {
                const isDifficult = row.accuracy < 50;
                const isSlow = row.avgTimeSpent > 60;
                return (
                    <div className="flex gap-1">
                        {isDifficult && <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 text-[9px] font-black uppercase tracking-tight">Hard</span>}
                        {isSlow && <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 text-[9px] font-black uppercase tracking-tight">Slow</span>}
                        {!isDifficult && !isSlow && <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-tight">Optimal</span>}
                    </div>
                );
            }
        }
    ];

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
    );

    const overallAccuracy = (analytics.reduce((acc, curr) => acc + curr.accuracy, 0) / (analytics.length || 1)).toFixed(1);
    const overallTime = (analytics.reduce((acc, curr) => acc + curr.avgTimeSpent, 0) / (analytics.length || 1)).toFixed(1);
    const difficultCount = analytics.filter(q => q.accuracy < 50 || q.avgTimeSpent > 60).length;

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link to={`/admin/test/${id}`} className="p-2 rounded-xl text-slate-400 hover:bg-white hover:text-slate-600 border border-transparent hover:border-slate-200 transition-all">
                        <span className="material-symbols-rounded">arrow_back</span>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">{testTitle} - Analytics</h1>
                        <p className="text-slate-500 font-medium">Detailed question-level breakdown of student performance.</p>
                    </div>
                </div>
                <button onClick={exportToCSV} className="btn-premium bg-slate-100 text-slate-600 hover:bg-slate-200">
                    <span className="material-symbols-rounded mr-2">download</span>
                    Export CSV
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatCard title="Overall Accuracy" value={`${overallAccuracy}%`} icon="target" color="success" />
                <StatCard title="Avg. Time Per Q" value={`${overallTime}s`} icon="timer" color="primary" />
                <StatCard title="Difficult Detected" value={difficultCount} icon="warning" color="danger" />
            </div>

            {/* Topic Area Performance */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <span className="material-symbols-rounded text-primary-500">grid_view</span>
                    Focus Areas by Topic
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(analytics.reduce((acc, q) => {
                        const topic = q.topic || 'General';
                        if (!acc[topic]) acc[topic] = { count: 0, totalAccuracy: 0 };
                        acc[topic].count++;
                        acc[topic].totalAccuracy += q.accuracy;
                        return acc;
                    }, {})).map(([topic, stats]) => (
                        <div key={topic} className="card-premium p-5 flex flex-col justify-between hover:border-primary-200 transition-colors group">
                            <h4 className="font-bold text-slate-700 truncate mb-4">{topic}</h4>
                            <div className="space-y-1">
                                <div className="flex justify-between items-end text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    <span>Accuracy</span>
                                    <span className="text-slate-800">{(stats.totalAccuracy / stats.count).toFixed(0)}%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${stats.totalAccuracy / stats.count}%` }}
                                        className="h-full bg-primary-500"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Questions Table */}
            <DataTable
                columns={columns}
                data={analytics}
                loading={loading}
                pageSize={10}
                emptyMessage="No performance data available for this test yet."
            />
        </div>
    );
};

export default TestAnalytics;
