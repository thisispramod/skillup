import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import DataTable from '../../components/common/DataTable';
import Swal from 'sweetalert2';

const ManageTests = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/tests');
            setTests(res.data);
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'Failed to load tests.', 'error');
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
                '<div><label class="text-sm font-semibold text-slate-600 ml-1">Description</label>' +
                '<input id="swal-input3" class="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none border-slate-200" placeholder="e.g.Any Description"></div>' +
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
                const description = document.getElementById('swal-input3').value;
                if (!title) {
                    Swal.showValidationMessage('Title is required');
                    return false;
                }
                return { title, duration, description };
            }
        });

        if (formValues) {
            try {
                await api.post('/tests', {
                    title: formValues.title,
                    duration_minutes: parseInt(formValues.duration),
                    description: formValues.description
                });
                Swal.fire({
                    icon: 'success',
                    title: 'Test Created!',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });
                fetchTests();
            } catch (err) {
                Swal.fire('Error', 'Failed to create test', 'error');
            }
        }
    };

    const handleDeleteTest = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/tests/${id}`); // Assuming delete endpoint exists
                setTests(prev => prev.filter(t => t.id !== id));
                Swal.fire(
                    'Deleted!',
                    'Test has been deleted.',
                    'success'
                );
            } catch (err) {
                Swal.fire('Error', 'Failed to delete test.', 'error');
            }
        }
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
            header: 'Status', key: 'published', render: (row) => (
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${row.published ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                    {row.published ? 'Published' : 'Draft'}
                </span>
            )
        },
        {
            header: 'Actions', key: 'actions', render: (row) => (
                <div className="flex items-center gap-2">
                    <Link to={`/admin/test/${row.id}`} className="p-2 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors" title="Edit Questions">
                        <span className="material-symbols-rounded">edit</span>
                    </Link>
                    <Link to={`/admin/test/${row.id}/analytics`} className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors" title="Analytics">
                        <span className="material-symbols-rounded">analytics</span>
                    </Link>
                    <button onClick={() => handleDeleteTest(row.id)} className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors" title="Delete">
                        <span className="material-symbols-rounded">delete</span>
                    </button>
                </div>
            )
        }
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
                        <h1 className="text-2xl font-bold text-slate-800">Manage Tests</h1>
                        <p className="text-slate-500 font-medium">Create, edit, and organize your examinations.</p>
                    </div>
                </div>
                <button
                    onClick={handleCreateTest}
                    className="btn-primary-gradient"
                >
                    <span className="material-symbols-rounded mr-2">add</span>
                    Create New Test
                </button>
            </div>

            {/* Tests Table */}
            <DataTable
                columns={columns}
                data={tests}
                loading={loading}
                pageSize={10}
                emptyMessage="No tests found. Create your first test!"
            />
        </div>
    );
};

export default ManageTests;
