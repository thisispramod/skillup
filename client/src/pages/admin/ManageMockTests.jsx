import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import DataTable from '../../components/common/DataTable';
import Swal from 'sweetalert2';

const ManageMockTests = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);

    const [editingTestId, setEditingTestId] = useState(null);

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/mock-tests');
            setTests(res.data);
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'Failed to load mock tests.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenTestModal = async (test = null) => {
        setEditingTestId(test?.id || null);
        const { value: formValues } = await Swal.fire({
            title: test ? 'Edit Mock Test' : 'Create New Mock Test',
            html: `
                <div class="flex flex-col gap-4 text-left">
                    <div>
                        <label class="text-sm font-semibold text-slate-600 ml-1">Test Title</label>
                        <input id="swal-mock-title" class="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none border-slate-200" placeholder="e.g. SSC CGL Tier 1 Mock 1" value="${test?.title || ''}">
                    </div>
                    <div>
                        <label class="text-sm font-semibold text-slate-600 ml-1">Description</label>
                        <input id="swal-mock-desc" class="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none border-slate-200" placeholder="exam instructions..." value="${test?.description || ''}">
                    </div>
                    <div>
                        <label class="text-sm font-semibold text-slate-600 ml-1">Exam Type</label>
                        <input id="swal-mock-exam-type" class="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none border-slate-200" placeholder="e.g. SSC CGL, UP Police" value="${test?.exam_type || 'SSC CGL'}">
                    </div>
                    <div>
                        <label class="text-sm font-semibold text-slate-600 ml-1">Duration (minutes)</label>
                        <input id="swal-mock-duration" type="number" class="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none border-slate-200" value="${test?.duration_minutes || 60}">
                    </div>
                    <div class="flex gap-4">
                        <div class="flex-1">
                            <label class="text-sm font-semibold text-slate-600 ml-1">+ve Marks/Q</label>
                            <input id="swal-mock-pos" type="number" step="0.5" class="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none border-slate-200" value="${test?.positive_marks || 2}">
                        </div>
                        <div class="flex-1">
                            <label class="text-sm font-semibold text-slate-600 ml-1">-ve Marks/Q</label>
                            <input id="swal-mock-neg" type="number" step="0.25" class="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none border-slate-200" value="${test?.negative_marks || 0.5}">
                        </div>
                    </div>
                </div>`,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: test ? 'Update Test' : 'Create Test',
            customClass: {
                confirmButton: 'btn-primary-gradient',
                popup: 'rounded-3xl p-8'
            },
            preConfirm: () => {
                const title = document.getElementById('swal-mock-title').value;
                const duration = document.getElementById('swal-mock-duration').value;
                if (!title) {
                    Swal.showValidationMessage('Title is required');
                    return false;
                }
                return {
                    title,
                    description: document.getElementById('swal-mock-desc').value,
                    exam_type: document.getElementById('swal-mock-exam-type').value || 'SSC CGL',
                    duration_minutes: parseInt(duration),
                    positive_marks: parseFloat(document.getElementById('swal-mock-pos').value),
                    negative_marks: parseFloat(document.getElementById('swal-mock-neg').value),
                };
            }
        });

        if (formValues) {
            try {
                if (test) {
                    await api.put(`/admin/mock-tests/${test.id}`, formValues);
                    Swal.fire({ icon: 'success', title: 'Mock Test Updated!', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
                } else {
                    await api.post('/admin/mock-tests', formValues);
                    Swal.fire({ icon: 'success', title: 'Mock Test Created!', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
                }
                fetchTests();
            } catch (err) {
                Swal.fire('Error', `Failed to ${test ? 'update' : 'create'} mock test`, 'error');
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
                await api.delete(`/admin/mock-tests/${id}`);
                setTests(prev => prev.filter(t => t.id !== id));
                Swal.fire('Deleted!', 'Mock Test has been deleted.', 'success');
            } catch (err) {
                Swal.fire('Error', 'Failed to delete mock test.', 'error');
            }
        }
    };

    const columns = [
        {
            header: 'Test Title', key: 'title', render: (row) => (
                <div className="flex flex-col items-start gap-1">
                    <span className="font-bold text-slate-800 flex items-center gap-2">
                        {row.title}
                        <span className="px-2 py-0.5 bg-primary-50 text-primary-700 border border-primary-100/50 rounded-md text-[10px] font-black uppercase tracking-wider">{row.exam_type || 'SSC CGL'}</span>
                    </span>
                    <span className="text-xs text-slate-400 capitalize truncate max-w-[200px]">{row.description || 'No description'}</span>
                </div>
            )
        },
        {
            header: 'Marking', key: 'marking', render: (row) => (
                <div className="flex flex-col text-sm">
                    <span className="text-emerald-600 font-bold">+{row.positive_marks || 0}</span>
                    <span className="text-rose-500 font-bold">-{row.negative_marks || 0}</span>
                </div>
            )
        },
        {
            header: 'Info', key: 'info', render: (row) => (
                <div className="flex flex-col text-sm text-slate-600">
                    <span className="flex items-center gap-1"><span className="material-symbols-rounded text-sm">timer</span>{row.duration_minutes} mins</span>
                    <span className="text-xs mt-1 text-slate-400">{row.MockTestSections?.length || 0} sections</span>
                </div>
            )
        },
        { header: 'Created At', key: 'createdAt', render: (row) => new Date(row.createdAt).toLocaleDateString() },
        {
            header: 'Actions', key: 'actions', render: (row) => (
                <div className="flex items-center gap-2">
                    <button onClick={() => handleOpenTestModal(row)} className="p-2 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors" title="Edit Test">
                        <span className="material-symbols-rounded text-[20px]">edit</span>
                    </button>
                    <Link to={`/admin/mock-test/${row.id}/sections`} className="p-2 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors" title="Manage Sections">
                        <span className="material-symbols-rounded text-[20px]">view_list</span>
                    </Link>
                    <button onClick={() => handleDeleteTest(row.id)} className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors" title="Delete">
                        <span className="material-symbols-rounded text-[20px]">delete</span>
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link to="/admin/dashboard" className="p-2 rounded-xl text-slate-400 hover:bg-white hover:text-slate-600 border border-transparent hover:border-slate-200 transition-all">
                        <span className="material-symbols-rounded">arrow_back</span>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Manage Mock Tests</h1>
                        <p className="text-slate-500 font-medium">Create and organize structured mock examinations.</p>
                    </div>
                </div>
                <button onClick={() => handleOpenTestModal()} className="btn-primary-gradient">
                    <span className="material-symbols-rounded mr-2">add</span> Create Mock Test
                </button>
            </div>

            <DataTable columns={columns} data={tests} loading={loading} pageSize={10} emptyMessage="No mock tests found." />
        </div>
    );
};

export default ManageMockTests;
