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
                '<div class="flex flex-col gap-4 text-left p-2">' +
                '  <div><label class="text-xs font-bold text-slate-500 uppercase ml-1">Basic Info</label>' +
                '  <input id="swal-input-title" class="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none border-slate-200" placeholder="Test Title"></div>' +
                '  <div><input id="swal-input-desc" class="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none border-slate-200" placeholder="Description"></div>' +
                '  <div class="grid grid-cols-2 gap-3">' +
                '    <div><label class="text-xs font-bold text-slate-400 ml-1">Duration (min)</label><input id="swal-input-duration" type="number" class="w-full mt-1 px-4 py-2 border rounded-xl" value="60"></div>' +
                '    <div><label class="text-xs font-bold text-slate-400 ml-1">Max Attempts</label><input id="swal-input-attempts" type="number" class="w-full mt-1 px-4 py-2 border rounded-xl" value="1"></div>' +
               '  </div>' +
                '  <div class="mt-2"><label class="text-xs font-bold text-slate-500 uppercase ml-1">Scheduling</label>' +
                '  <select id="swal-input-mode" class="w-full mt-1 px-4 py-2 border rounded-xl bg-white">' +
                '    <option value="NORMAL">Normal Mode (Anytime)</option>' +
                '    <option value="SCHEDULED">Scheduled Mode (Time Restricted)</option>' +
                '  </select></div>' +
                '  <div id="schedule-fields" style="display:none" class="space-y-4 mt-2">' +
                '    <div class="grid grid-cols-2 gap-3">' +
                '      <div><label class="text-xs font-bold text-slate-400 ml-1">Start Time</label><input id="swal-input-start" type="datetime-local" class="w-full mt-1 px-4 py-2 border rounded-xl"></div>' +
                '      <div><label class="text-xs font-bold text-slate-400 ml-1">End Time</label><input id="swal-input-end" type="datetime-local" class="w-full mt-1 px-4 py-2 border rounded-xl"></div>' +
                '    </div>' +
                '    <div><label class="text-xs font-bold text-slate-400 ml-1">Schedule Type</label>' +
                '    <select id="swal-input-stype" class="w-full mt-1 px-4 py-2 border rounded-xl bg-white">' +
                '      <option value="FLEXIBLE">Flexible (Start anytime in window)</option>' +
                '      <option value="STRICT">Strict (Fixed end time for all)</option>' +
                '    </select></div>' +
                '  </div>' +
                '</div>',
            didOpen: () => {
                const modeSelect = document.getElementById('swal-input-mode');
                const scheduleFields = document.getElementById('schedule-fields');
                modeSelect.addEventListener('change', (e) => {
                    scheduleFields.style.display = e.target.value === 'SCHEDULED' ? 'block' : 'none';
                });
            },
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Create Test',
            customClass: {
                confirmButton: 'btn-primary-gradient',
                popup: 'rounded-3xl p-8'
            },
            preConfirm: () => {
                const title = document.getElementById('swal-input-title').value;
                const duration = document.getElementById('swal-input-duration').value;
                const description = document.getElementById('swal-input-desc').value;
                const test_mode = document.getElementById('swal-input-mode').value;
                const start_time = document.getElementById('swal-input-start').value;
                const end_time = document.getElementById('swal-input-end').value;
                const schedule_type = document.getElementById('swal-input-stype').value;
                const max_attempt = document.getElementById('swal-input-attempts').value;

                if (!title) {
                    Swal.showValidationMessage('Title is required');
                    return false;
                }
                if (test_mode === 'SCHEDULED') {
                    if (!start_time || !end_time) {
                        Swal.showValidationMessage('Start and End times are required for Scheduled mode');
                        return false;
                    }
                    if (new Date(start_time) >= new Date(end_time)) {
                        Swal.showValidationMessage('Start time must be before End time');
                        return false;
                    }
                }
                return { 
                    title, 
                    duration_minutes: parseInt(duration), 
                    description, 
                    test_mode, 
                    start_time: test_mode === 'SCHEDULED' ? start_time : null,
                    end_time: test_mode === 'SCHEDULED' ? end_time : null,
                    schedule_type: test_mode === 'SCHEDULED' ? schedule_type : null,
                    max_attempt: parseInt(max_attempt)
                };
            }
        });

        if (formValues) {
            try {
                await api.post('/tests', formValues);
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
            header: 'Mode', key: 'test_mode', render: (row) => (
                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${row.test_mode === 'SCHEDULED' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                    {row.test_mode || 'NORMAL'}
                </span>
            )
        },
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
