import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import DataTable from '../../components/common/DataTable';
import Swal from 'sweetalert2';

const AdminReports = () => {
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/reports');
            setAttempts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const exportCSV = () => {
        if (attempts.length === 0) return;

        const headers = "Student Name,Email,Test Title,Score,Correct,Wrong,Total Questions,Date\n";
        const rows = attempts.map(a =>
            `"${a.User?.name}","${a.User?.email}","${a.Test?.title}",${a.score},${a.correct_answers},${a.wrong_answers},${a.total_questions},"${new Date(a.createdAt).toLocaleString()}"`
        ).join("\n");

        const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "performance_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        Swal.fire({
            icon: 'success',
            title: 'Report Individualized',
            text: 'Your CSV export is ready.',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });
    };

    const columns = [
        {
            header: 'Student', key: 'User', render: (row) => (
                <div className="flex flex-col">
                    <span className="font-bold text-slate-800">{row.User?.name}</span>
                    <span className="text-xs text-slate-400">{row.User?.email}</span>
                </div>
            )
        },
        {
            header: 'Test Title', key: 'Test', render: (row) => (
                <span className="font-semibold text-slate-600">{row.Test?.title}</span>
            )
        },
        {
            header: 'Score Details', key: 'score', render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-12 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary-500"
                            style={{ width: `${(row.score / row.total_questions) * 100}%` }}
                        />
                    </div>
                    <span className="font-bold text-slate-800">{row.score}/{row.total_questions}</span>
                </div>
            )
        },
        {
            header: 'Metrics', key: 'id', render: (row) => (
                <div className="flex gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] font-bold">{row.correct_answers} Correct</span>
                    <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-600 text-[10px] font-bold">{row.wrong_answers} Wrong</span>
                </div>
            )
        },
        { header: 'Date', key: 'createdAt', render: (row) => new Date(row.createdAt).toLocaleDateString() }
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link to="/admin/dashboard" className="p-2 rounded-xl text-slate-400 hover:bg-white hover:text-slate-600 border border-transparent hover:border-slate-200 transition-all">
                        <span className="material-symbols-rounded">arrow_back</span>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Performance Reports</h1>
                        <p className="text-slate-500 font-medium">Deep dive into student results and analytics.</p>
                    </div>
                </div>
                <button onClick={exportCSV} className="btn-premium bg-slate-100 text-slate-600 hover:bg-slate-200">
                    <span className="material-symbols-rounded mr-2">download</span>
                    Export CSV
                </button>
            </div>

            {/* Content */}
            <DataTable
                columns={columns}
                data={attempts}
                loading={loading}
                pageSize={10}
                emptyMessage="No performance data available yet."
            />
        </div>
    );
};

export default AdminReports;
