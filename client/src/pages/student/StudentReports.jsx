import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';

const StudentReports = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPerformance();
    }, []);

    const fetchPerformance = async () => {
        try {
            setLoading(true);
            const res = await api.get('/student/performance');
            setData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            header: 'Test Name', key: 'Test', render: (row) => (
                <div className="flex flex-col">
                    <span className="font-bold text-slate-800">{row.Test?.title}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{row.Test?.category || 'Standard Test'}</span>
                </div>
            )
        },
        {
            header: 'Date', key: 'createdAt', render: (row) => (
                <span className="text-sm font-medium text-slate-500">{new Date(row.createdAt).toLocaleDateString()}</span>
            )
        },
        {
            header: 'Score', key: 'score', render: (row) => (
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary-600">{row.score}</span>
                    <span className="text-xs text-slate-400 font-bold">/ {row.total_questions}</span>
                </div>
            )
        },
        {
            header: 'Accuracy', key: 'accuracy', render: (row) => {
                const acc = ((row.correct_answers / row.total_questions) * 100).toFixed(0);
                return (
                    <div className="flex items-center gap-3">
                        <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${acc}%` }} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600">{acc}%</span>
                    </div>
                );
            }
        },
        {
            header: 'Action', key: 'id', render: (row) => (
                <Link
                    to={`/student/result/${row.id}`}
                    className="btn-premium px-4 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 text-[11px]"
                >
                    View Review
                </Link>
            )
        }
    ];

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
    );

    if (!data || data.attempts.length === 0) return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-4">
                <Link to="/student/dashboard" className="p-2 rounded-xl text-slate-400 hover:bg-white hover:text-slate-600 border border-transparent hover:border-slate-200 transition-all">
                    <span className="material-symbols-rounded">arrow_back</span>
                </Link>
                <h1 className="text-2xl font-bold text-slate-800">Performance Report</h1>
            </div>
            <div className="card-premium p-20 text-center text-slate-400">
                <span className="material-symbols-rounded text-6xl mb-4">assessment</span>
                <p className="text-lg font-bold text-slate-800">No data found</p>
                <p className="max-w-xs mx-auto">Take some tests to see your performance analytics here.</p>
                <Link to="/student/dashboard" className="mt-6 inline-block btn-primary-gradient px-8 py-2.5">Start a Test</Link>
            </div>
        </div>
    );

    const { attempts, stats } = data;

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link to="/student/dashboard" className="p-2 rounded-xl text-slate-400 hover:bg-white hover:text-slate-600 border border-transparent hover:border-slate-200 transition-all">
                        <span className="material-symbols-rounded">arrow_back</span>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">My Performance Report</h1>
                        <p className="text-slate-500 font-medium">Detailed tracking of your learning journey.</p>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatCard title="Tests Taken" value={stats.totalTests} icon="history" color="primary" />
                <StatCard title="Average Score" value={stats.avgScore} icon="trending_up" color="success" />
                <StatCard title="Total Marks" value={stats.totalScore} icon="military_tech" color="info" />
            </div>

            {/* Detailed Table */}
            <DataTable
                columns={columns}
                data={attempts}
                loading={loading}
                pageSize={10}
                emptyMessage="No historical data found."
            />
        </div>
    );
};

export default StudentReports;
