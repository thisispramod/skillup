import React, { useEffect, useState } from 'react';
import api from '../../api';
import DataTable from '../../components/common/DataTable';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const ManageStudents = () => {
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [studentRes, classRes] = await Promise.all([
                api.get('/admin/students'),
                api.get('/classes')
            ]);
            setStudents(studentRes.data);
            setClasses(classRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleClassChange = async (studentId, classId) => {
        try {
            await api.put(`/admin/students/${studentId}/class`, {
                class_id: classId === '' ? null : parseInt(classId),
                batch_id: null
            });
            setStudents(prev => prev.map(s => s.id === studentId ? {
                ...s,
                class_id: classId === '' ? null : parseInt(classId),
                batch_id: null
            } : s));
            Swal.fire({
                icon: 'success',
                title: 'Class Updated',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000
            });
        } catch (err) {
            Swal.fire('Error', 'Failed to update student class.', 'error');
        }
    };

    const handleBatchChange = async (studentId, batchId) => {
        const student = students.find(s => s.id === studentId);
        if (!student) return;

        try {
            await api.put(`/admin/students/${studentId}/class`, {
                class_id: student.class_id,
                batch_id: batchId === '' ? null : parseInt(batchId)
            });
            setStudents(prev => prev.map(s => s.id === studentId ? { ...s, batch_id: batchId === '' ? null : parseInt(batchId) } : s));
            Swal.fire({
                icon: 'success',
                title: 'Batch Updated',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000
            });
        } catch (err) {
            Swal.fire('Error', 'Failed to update student batch.', 'error');
        }
    };

    const columns = [
        {
            header: 'Student Details', key: 'name', render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold border border-slate-200">
                        <span className="material-symbols-rounded">person</span>
                    </div>
                    <div>
                        <p className="font-bold text-slate-800 leading-none">{row.name}</p>
                        <p className="text-xs text-slate-500 mt-1">{row.email}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Assigned Class', key: 'class_id', render: (row) => (
                <select
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all text-sm font-medium"
                    value={row.class_id || ''}
                    onChange={(e) => handleClassChange(row.id, e.target.value)}
                >
                    <option value="">Unassigned</option>
                    {classes.map(cls => (
                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                </select>
            )
        },
        {
            header: 'Assigned Batch', key: 'batch_id', render: (row) => (
                <select
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all text-sm font-medium disabled:opacity-50"
                    value={row.batch_id || ''}
                    onChange={(e) => handleBatchChange(row.id, e.target.value)}
                    disabled={!row.class_id}
                >
                    <option value="">No Batch</option>
                    {classes.find(c => c.id === row.class_id)?.Batches?.map(batch => (
                        <option key={batch.id} value={batch.id}>{batch.name}</option>
                    ))}
                </select>
            )
        },
        {
            header: 'Status', key: 'id', render: (row) => (
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${row.class_id ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    {row.class_id ? 'Active' : 'Pending'}
                </span>
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
                        <h1 className="text-2xl font-bold text-slate-800">Student Management</h1>
                        <p className="text-slate-500 font-medium">Assign students to classes and monitor enrollment.</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <DataTable
                columns={columns}
                data={students}
                loading={loading}
                pageSize={10}
            />
        </div>
    );
};

export default ManageStudents;
