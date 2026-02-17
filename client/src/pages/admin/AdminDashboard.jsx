import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import Swal from 'sweetalert2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const AdminDashboard = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalTests: 0,
        totalStudents: 0,
        averageScore: 0,
        activeClasses: 0
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [testsRes, studentsRes, classesRes] = await Promise.all([
                api.get('/admin/tests'),
                api.get('/admin/students'),
                api.get('/classes')
            ]);

            setTests(testsRes.data);
            setStats({
                totalTests: testsRes.data.length,
                totalStudents: studentsRes.data.length,
                activeClasses: classesRes.data.length,
                averageScore: 78 // Placeholder
            });
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Data Load Failed',
                text: 'Could not fetch dashboard data.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTest = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Create New Test',
            html:
                '<div class="flex flex-col gap-4 text-left">' +
                '<div><label class="text-sm font-semibold text-slate-600 ml-1">Test Title</label>' +
                '<input id="swal-input1" class="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none border-slate-200" placeholder="e.g. Mathematics Midterm"></div>' +
                '<div><label class="text-sm font-semibold text-slate-600 ml-1">Duration (minutes)</label>' +
                '<input id="swal-input2" type="number" class="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none border-slate-200" value="60"></div>' +
                '</div>',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Create Test',
            customClass: {
                confirmButton: 'btn-primary-gradient',
                popup: 'rounded-3xl p-8'
            },
            preConfirm: () => {
                const title = document.getElementById('swal-input1').value;
                const duration = document.getElementById('swal-input2').value;
                if (!title) {
                    Swal.showValidationMessage('Title is required');
                    return false;
                }
                return { title, duration };
            }
        });

        if (formValues) {
            try {
                await api.post('/tests', {
                    title: formValues.title,
                    duration_minutes: parseInt(formValues.duration),
                    description: 'New test created from dashboard'
                });
                Swal.fire({
                    icon: 'success',
                    title: 'Test Created!',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });
                fetchData();
            } catch (err) {
                Swal.fire('Error', 'Failed to create test', 'error');
            }
        }
    };

    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Test Completions',
            data: [12, 19, 15, 25, 22, 30],
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            fill: true,
            tension: 0.4
        }]
    };

    const columns = [
        {
            header: 'Test Title', key: 'title', render: (row) => (
                <div className="flex flex-col">
                    <span className="font-bold text-slate-800">{row.title}</span>
                    <span className="text-xs text-slate-400 capitalize">{row.description || 'No description'}</span>
                </div>
            )
        },
        {
            header: 'Duration', key: 'duration_minutes', render: (row) => (
                <div className="flex items-center gap-2">
                    <span className="material-symbols-rounded text-slate-400 text-lg">timer</span>
                    <span>{row.duration_minutes} mins</span>
                </div>
            )
        },
        { header: 'Created At', key: 'createdAt', render: (row) => new Date(row.createdAt).toLocaleDateString() },
        {
            header: 'Status', key: 'id', render: (row) => (
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${row.published ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                    {row.published ? 'Published' : 'Draft'}
                </span>
            )
        },
        {
            header: 'Actions', key: 'actions', render: (row) => (
                <div className="flex items-center gap-2">
                    <Link to={`/admin/test/${row.id}`} className="p-2 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors">
                        <span className="material-symbols-rounded">edit</span>
                    </Link>
                    <Link to={`/admin/test/${row.id}/analytics`} className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors">
                        <span className="material-symbols-rounded">analytics</span>
                    </Link>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
                    <p className="text-slate-500">Overview of your online examination system.</p>
                </div>
                <button
                    onClick={handleCreateTest}
                    className="btn-primary-gradient"
                >
                    <span className="material-symbols-rounded mr-2">add</span>
                    Create New Test
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Tests" value={stats.totalTests} icon="quiz" color="primary" trend={12} />
                <StatCard title="Total Students" value={stats.totalStudents} icon="group" color="success" trend={5} />
                <StatCard title="Active Classes" value={stats.activeClasses} icon="school" color="info" />
                <StatCard title="Avg. Score" value={`${stats.averageScore}%`} icon="auto_graph" color="warning" trend={-2} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Section */}
                <div className="lg:col-span-2 card-premium p-6">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-bold text-slate-800">Performance Trend</h3>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-primary-50 text-primary-600 rounded-lg text-xs font-bold">Monthly</span>
                        </div>
                    </div>
                    <div className="h-[300px]">
                        <Line
                            data={chartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: {
                                    y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
                                    x: { grid: { display: false } }
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Quick Actions / Recent Activity */}
                <div className="card-premium p-6">
                    <h3 className="font-bold text-slate-800 mb-6">Quick Tools</h3>
                    <div className="grid grid-cols-1 gap-3">
                        <Link to="/admin/classes" className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-primary-50 transition-colors group">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover:text-primary-600 shadow-sm transition-colors">
                                <span className="material-symbols-rounded">school</span>
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-slate-800">Manage Classes</p>
                                <p className="text-xs text-slate-500">Organize students into groups</p>
                            </div>
                        </Link>
                        <Link to="/admin/students" className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-primary-50 transition-colors group">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover:text-primary-600 shadow-sm transition-colors">
                                <span className="material-symbols-rounded">group</span>
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-slate-800">Manage Students</p>
                                <p className="text-xs text-slate-500">View and edit student profiles</p>
                            </div>
                        </Link>
                        <Link to="/admin/reports" className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-primary-50 transition-colors group">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover:text-primary-600 shadow-sm transition-colors">
                                <span className="material-symbols-rounded">description</span>
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-slate-800">Reports</p>
                                <p className="text-xs text-slate-500">Detailed performance analytics</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Recent Tests Table */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800">Recent Tests</h2>
                    <Link to="/admin/manage-tests" className="text-sm font-semibold text-primary-600 hover:text-primary-700">View All</Link>
                </div>
                <DataTable
                    columns={columns}
                    data={tests}
                    loading={loading}
                    pageSize={5}
                />
            </div>
        </div>
    );
};

export default AdminDashboard;
