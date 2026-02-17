import React, { useEffect, useState } from 'react';
import api from '../../api';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const ManageClasses = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isClassModalOpen, setIsClassModalOpen] = useState(false);
    const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [newClassName, setNewClassName] = useState('');
    const [newBatchName, setNewBatchName] = useState('');

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const res = await api.get('/classes');
            setClasses(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddClass = async (e) => {
        e.preventDefault();
        try {
            await api.post('/classes', { name: newClassName });
            setNewClassName('');
            setIsClassModalOpen(false);
            fetchClasses();
            Swal.fire({ icon: 'success', title: 'Class Created', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
        } catch (err) {
            Swal.fire('Error', 'Class name might already exist.', 'error');
        }
    };

    const handleDeleteClass = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Class?',
            text: "Students will be unassigned from this class.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/classes/${id}`);
                fetchClasses();
                Swal.fire('Deleted!', 'Class has been removed.', 'success');
            } catch (err) { Swal.fire('Error', 'Failed to delete class', 'error'); }
        }
    };

    const handleAddBatch = async (e) => {
        e.preventDefault();
        try {
            await api.post('/batches', { name: newBatchName, class_id: selectedClass.id });
            setNewBatchName('');
            fetchClasses(); // To update the batch list in UI
            Swal.fire({ icon: 'success', title: 'Batch Added', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
        } catch (err) { Swal.fire('Error', 'Failed to add batch', 'error'); }
    };

    const handleDeleteBatch = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Batch?',
            icon: 'warning',
            showCancelButton: true
        });
        if (result.isConfirmed) {
            try {
                await api.delete(`/batches/${id}`);
                fetchClasses();
                Swal.fire('Deleted!', 'Batch removed.', 'success');
            } catch (err) { Swal.fire('Error', 'Failed to delete batch', 'error'); }
        }
    };

    const columns = [
        {
            header: 'Class Name', key: 'name', render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold">
                        {row.name.charAt(0)}
                    </div>
                    <span className="font-bold text-slate-800">{row.name}</span>
                </div>
            )
        },
        {
            header: 'Batches', key: 'Batches', render: (row) => (
                <div className="flex flex-wrap gap-1.5">
                    {row.Batches?.slice(0, 3).map(b => (
                        <span key={b.id} className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                            {b.name}
                        </span>
                    ))}
                    {(row.Batches?.length > 3) && (
                        <span className="text-[10px] font-bold text-slate-400">+{row.Batches.length - 3} more</span>
                    )}
                    {(!row.Batches || row.Batches.length === 0) && <span className="text-xs text-slate-400 italic">No batches</span>}
                </div>
            )
        },
        {
            header: 'Actions', key: 'id', render: (row) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => { setSelectedClass(row); setIsBatchModalOpen(true); }}
                        className="p-2 rounded-xl text-primary-600 hover:bg-primary-50 transition-colors"
                        title="Manage Batches"
                    >
                        <span className="material-symbols-rounded">settings_suggest</span>
                    </button>
                    <button
                        onClick={() => handleDeleteClass(row.id)}
                        className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                    >
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
                        <h1 className="text-2xl font-bold text-slate-800">Manage Classes</h1>
                        <p className="text-slate-500 font-medium">Create classes and batches for your institution.</p>
                    </div>
                </div>
                <button onClick={() => setIsClassModalOpen(true)} className="btn-primary-gradient">
                    <span className="material-symbols-rounded mr-2">add</span>
                    Create New Class
                </button>
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                data={classes}
                loading={loading}
                pageSize={10}
            />

            {/* Create Class Modal */}
            <Modal
                isOpen={isClassModalOpen}
                onClose={() => setIsClassModalOpen(false)}
                title="Create New Class"
                footer={
                    <div className="flex gap-3">
                        <button onClick={() => setIsClassModalOpen(false)} className="btn-premium px-6 bg-slate-100 text-slate-600">Cancel</button>
                        <button form="class-form" type="submit" className="btn-primary-gradient px-8">Save Class</button>
                    </div>
                }
            >
                <form id="class-form" onSubmit={handleAddClass} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-slate-700 ml-1">Class Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                            placeholder="e.g. Science Grade 10"
                            value={newClassName}
                            onChange={(e) => setNewClassName(e.target.value)}
                            required
                        />
                    </div>
                </form>
            </Modal>

            {/* Manage Batches Modal */}
            <Modal
                isOpen={isBatchModalOpen}
                onClose={() => setIsBatchModalOpen(false)}
                title={`Manage Batches: ${selectedClass?.name}`}
                size="md"
            >
                <div className="space-y-8">
                    {/* Add Batch Form */}
                    <form onSubmit={handleAddBatch} className="p-5 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Add New Batch</p>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                                placeholder="Batch A, Afternoon, etc."
                                value={newBatchName}
                                onChange={(e) => setNewBatchName(e.target.value)}
                                required
                            />
                            <button type="submit" className="btn-primary-gradient px-6 py-2">Add</button>
                        </div>
                    </form>

                    {/* Batches List */}
                    <div className="space-y-3">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Existing Batches</p>
                        <div className="grid grid-cols-1 gap-2">
                            {selectedClass?.Batches && classes.find(c => c.id === selectedClass.id)?.Batches.map(batch => (
                                <div key={batch.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 group hover:border-slate-200 transition-colors">
                                    <div className="flex items-center gap-3 font-bold text-slate-700">
                                        <span className="material-symbols-rounded text-slate-400">group</span>
                                        {batch.name}
                                    </div>
                                    <button
                                        onClick={() => handleDeleteBatch(batch.id)}
                                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <span className="material-symbols-rounded">delete</span>
                                    </button>
                                </div>
                            ))}
                            {(!selectedClass?.Batches || classes.find(c => c.id === selectedClass.id)?.Batches.length === 0) && (
                                <div className="text-center py-8 text-slate-400 italic text-sm">No batches created for this class yet.</div>
                            )}
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ManageClasses;
