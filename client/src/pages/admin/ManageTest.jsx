import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api';
import Modal from '../../components/common/Modal';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';


const ManageTest = () => {
    const { id } = useParams();
    const [test, setTest] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [allClasses, setAllClasses] = useState([]);
    const [assignedClassIds, setAssignedClassIds] = useState([]);
    const [assignedBatchIds, setAssignedBatchIds] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [editingQuestionId, setEditingQuestionId] = useState(null);
    const fileInputRef = React.useRef(null);

    // New Question Form State
    const [newQ, setNewQ] = useState({
        text: '',
        option_a: '', option_b: '', option_c: '', option_d: '',
        correct_option: 'A',
        marks: 1,
        topic: 'General',
        explanation: ''
    });

    useEffect(() => {
        fetchTest();
        fetchClasses();
    }, [id]);

    const fetchTest = async () => {
        try {
            const res = await api.get(`/tests/${id}`);
            setTest(res.data);
            if (res.data.Questions) setQuestions(res.data.Questions);
            if (res.data.Classes) setAssignedClassIds(res.data.Classes.map(c => c.id));
            if (res.data.Batches) setAssignedBatchIds(res.data.Batches.map(b => b.id));
        } catch (err) { console.error(err); }
    };

    const fetchClasses = async () => {
        try {
            const res = await api.get('/classes');
            setAllClasses(res.data);
        } catch (err) { console.error(err); }
    };

    const handleClassToggle = async (classId) => {
        const newIds = assignedClassIds.includes(classId)
            ? assignedClassIds.filter(cid => cid !== classId)
            : [...assignedClassIds, classId];
        setAssignedClassIds(newIds);
        updateTestAssignment(newIds, assignedBatchIds);
    };

    const handleBatchToggle = async (batchId) => {
        const newIds = assignedBatchIds.includes(batchId)
            ? assignedBatchIds.filter(bid => bid !== batchId)
            : [...assignedBatchIds, batchId];
        setAssignedBatchIds(newIds);
        updateTestAssignment(assignedClassIds, newIds);
    };

    const updateTestAssignment = async (classIds, batchIds) => {
        try {
            await api.put(`/tests/${id}`, { classIds, batchIds });
            Swal.fire({
                icon: 'success', title: 'Assignments Updated',
                toast: true, position: 'top-end', showConfirmButton: false, timer: 2000
            });
        } catch (err) { console.error('Failed to update assignment', err); }
    };



    const deleteQuestion = async (qId) => {
        const result = await Swal.fire({
            title: 'Delete Question?',
            text: "This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'Cancel',
            customClass: {
                confirmButton: '!bg-rose-600 rounded-xl px-6 py-2.5',
                cancelButton: '!bg-slate-100 !text-slate-600 rounded-xl px-6 py-2.5',
                popup: 'rounded-3xl'
            }
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/questions/${qId}`);
                fetchTest();
                Swal.fire('Deleted!', 'Question has been removed.', 'success');
            } catch (err) { console.error(err); }
        }
    };



    const handleSaveQuestion = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingQuestionId) {
                // Update existing question
                await api.put(`/questions/${editingQuestionId}`, { ...newQ });
                Swal.fire({ icon: 'success', title: 'Question Updated', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
            } else {
                // Create new question
                await api.post('/questions', { ...newQ, test_id: id });
                Swal.fire({ icon: 'success', title: 'Question Added', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
            }
            closeModal();
            fetchTest();
        } catch (err) {
            Swal.fire('Error', `Failed to ${editingQuestionId ? 'update' : 'add'} question`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const openEditModal = (q) => {
        setNewQ({
            text: q.text,
            option_a: q.option_a,
            option_b: q.option_b,
            option_c: q.option_c,
            option_d: q.option_d,
            correct_option: q.correct_option,
            marks: q.marks,
            topic: q.topic || 'General',
            explanation: q.explanation || ''
        });
        setEditingQuestionId(q.id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setNewQ({ text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'A', marks: 1, topic: 'General', explanation: '' });
        setEditingQuestionId(null);
        setIsModalOpen(false);
    };

    const handleImportClick = () => {
        fileInputRef.current.click();
    };

    const handleDownloadTemplate = async () => {
        try {
            const response = await api.get('/admin/sample-question-sheet', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'question_import_template.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            Swal.fire('Error', 'Failed to download template', 'error');
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setIsImporting(true);
        try {
            const res = await api.post(`/tests/${id}/import-questions`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            Swal.fire({
                icon: 'success',
                title: 'Import Successful',
                text: res.data.message
            });
            fetchTest();
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || 'Import failed';
            const details = err.response?.data?.details;
            let htmlMsg = msg;
            if (details && Array.isArray(details)) {
                htmlMsg += '<br/><div style="text-align:left; max-height: 200px; overflow-y:auto; margin-top:10px; font-size: 0.9em; color: #dc2626;">' + details.join('<br/>') + '</div>';
            }

            Swal.fire({
                icon: 'error',
                title: 'Import Failed',
                html: htmlMsg
            });
        } finally {
            setIsImporting(false);
            e.target.value = null; // reset input
        }
    };
    
    const handleEditTestDetails = async () => {
        // Format dates for datetime-local input (YYYY-MM-DDTHH:mm)
        const formatDate = (d) => {
            if (!d) return '';
            const date = new Date(d);
            const pad = (n) => n.toString().padStart(2, '0');
            return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
        };

        const { value: formValues } = await Swal.fire({
            title: 'Edit Test Details',
            html:
                '<div class="flex flex-col gap-4 text-left p-2">' +
                '  <div><label class="text-xs font-bold text-slate-500 uppercase ml-1">Basic Info</label>' +
                '  <input id="swal-edit-title" class="w-full mt-1 px-4 py-2 border rounded-xl" placeholder="Test Title" value="' + test.title + '"></div>' +
                '  <div class="grid grid-cols-2 gap-3">' +
                '    <div><label class="text-xs font-bold text-slate-400 ml-1">Duration (min)</label><input id="swal-edit-duration" type="number" class="w-full mt-1 px-4 py-2 border rounded-xl" value="' + test.duration_minutes + '"></div>' +
                '    <div><label class="text-xs font-bold text-slate-400 ml-1">Max Attempts</label><input id="swal-edit-attempts" type="number" class="w-full mt-1 px-4 py-2 border rounded-xl" value="' + (test.max_attempt || 1) + '"></div>' +
                '  </div>' +
                '  <div class="mt-2"><label class="text-xs font-bold text-slate-500 uppercase ml-1">Scheduling</label>' +
                '  <select id="swal-edit-mode" class="w-full mt-1 px-4 py-2 border rounded-xl bg-white">' +
                '    <option value="NORMAL" ' + (test.test_mode === 'NORMAL' ? 'selected' : '') + '>Normal Mode (Anytime)</option>' +
                '    <option value="SCHEDULED" ' + (test.test_mode === 'SCHEDULED' ? 'selected' : '') + '>Scheduled Mode (Time Restricted)</option>' +
                '  </select></div>' +
                '  <div id="edit-schedule-fields" style="display:' + (test.test_mode === 'SCHEDULED' ? 'block' : 'none') + '" class="space-y-4 mt-2">' +
                '    <div class="grid grid-cols-2 gap-3">' +
                '      <div><label class="text-xs font-bold text-slate-400 ml-1">Start Time</label><input id="swal-edit-start" type="datetime-local" class="w-full mt-1 px-4 py-2 border rounded-xl" value="' + formatDate(test.start_time) + '"></div>' +
                '      <div><label class="text-xs font-bold text-slate-400 ml-1">End Time</label><input id="swal-edit-end" type="datetime-local" class="w-full mt-1 px-4 py-2 border rounded-xl" value="' + formatDate(test.end_time) + '"></div>' +
                '    </div>' +
                '    <div><label class="text-xs font-bold text-slate-400 ml-1">Schedule Type</label>' +
                '    <select id="swal-edit-stype" class="w-full mt-1 px-4 py-2 border rounded-xl bg-white">' +
                '      <option value="FLEXIBLE" ' + (test.schedule_type === 'FLEXIBLE' ? 'selected' : '') + '>Flexible (Start anytime in window)</option>' +
                '      <option value="STRICT" ' + (test.schedule_type === 'STRICT' ? 'selected' : '') + '>Strict (Fixed end time for all)</option>' +
                '    </select></div>' +
                '  </div>' +
                '</div>',
            didOpen: () => {
                const modeSelect = document.getElementById('swal-edit-mode');
                const scheduleFields = document.getElementById('edit-schedule-fields');
                modeSelect.addEventListener('change', (e) => {
                    scheduleFields.style.display = e.target.value === 'SCHEDULED' ? 'block' : 'none';
                });
            },
            showCancelButton: true,
            confirmButtonText: 'Save Changes',
            preConfirm: () => {
                const title = document.getElementById('swal-edit-title').value;
                const duration = document.getElementById('swal-edit-duration').value;
                const test_mode = document.getElementById('swal-edit-mode').value;
                const start_time = document.getElementById('swal-edit-start').value;
                const end_time = document.getElementById('swal-edit-end').value;
                const schedule_type = document.getElementById('swal-edit-stype').value;
                const max_attempt = document.getElementById('swal-edit-attempts').value;

                if (!title) return Swal.showValidationMessage('Title is required');
                if (test_mode === 'SCHEDULED') {
                    if (!start_time || !end_time) return Swal.showValidationMessage('Times are required');
                    if (new Date(start_time) >= new Date(end_time)) return Swal.showValidationMessage('Start must be before End');
                }

                return {
                    title,
                    duration_minutes: parseInt(duration),
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
                await api.put(`/tests/${id}`, formValues);
                setTest({ ...test, ...formValues });
                Swal.fire({ icon: 'success', title: 'Test Updated', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
            } catch (err) {
                Swal.fire('Error', 'Failed to update test details', 'error');
            }
        }
    };



    if (!test) return (
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
                        <h1 className="text-2xl font-bold text-slate-800">{test.title}</h1>
                        <p className="text-slate-500 font-medium">Manage questions and assignments.</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".xlsx, .xls"
                        className="hidden"
                    />

                    <button onClick={handleDownloadTemplate} className="btn-premium bg-white border border-slate-200 text-slate-600 hover:bg-slate-50" title="Download Sample Sheet">
                        <span className="material-symbols-rounded mr-2 text-emerald-600">download</span>
                        Sample
                    </button>

                    <button onClick={handleImportClick} disabled={isImporting} className="btn-premium bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">
                        {isImporting ? (
                            <span className="w-4 h-4 border-2 border-slate-400 border-t-emerald-600 rounded-full animate-spin mr-2"></span>
                        ) : (
                            <span className="material-symbols-rounded mr-2 text-primary-500">upload_file</span>
                        )}
                        Import Questions
                    </button>

                    <Link to={`/admin/test/${id}/analytics`} className="btn-premium bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">
                        <span className="material-symbols-rounded mr-2 text-primary-500">analytics</span>
                        Analytics
                    </Link>
                    <button onClick={() => setIsModalOpen(true)} className="btn-primary-gradient">
                        <span className="material-symbols-rounded mr-2">add</span>
                        Add Question
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left: Test Details & Assignments */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="card-premium p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <span className="material-symbols-rounded text-primary-500">info</span>
                                Test Summary
                            </h3>
                            <button 
                                onClick={() => handleEditTestDetails()}
                                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-primary-600 transition-all"
                                title="Edit Summary"
                            >
                                <span className="material-symbols-rounded text-sm">edit</span>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Mode</span>
                                <span className={`font-bold transition-colors ${test.test_mode === 'SCHEDULED' ? 'text-amber-600' : 'text-emerald-600'}`}>
                                    {test.test_mode || 'NORMAL'}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Duration</span>
                                <span className="font-bold text-slate-800">{test.duration_minutes} Mins</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Attempts</span>
                                <span className="font-bold text-slate-800">{test.max_attempt || 1} allowed</span>
                            </div>
                            {test.test_mode === 'SCHEDULED' && (
                                <div className="space-y-2 mt-2 pt-2 border-t border-slate-50">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] uppercase font-bold text-slate-400">Schedule ({test.schedule_type})</span>
                                        <div className="flex justify-between text-[11px] font-bold">
                                            <span className="text-slate-500">Start:</span>
                                            <span className="text-slate-700">{test.start_time ? new Date(test.start_time).toLocaleString() : '--'}</span>
                                        </div>
                                        <div className="flex justify-between text-[11px] font-bold">
                                            <span className="text-slate-500">End:</span>
                                            <span className="text-slate-700">{test.end_time ? new Date(test.end_time).toLocaleString() : '--'}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-between text-sm pt-2 border-t border-slate-50">
                                <span className="text-slate-500">Status</span>
                                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${test.published ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                    {test.published ? 'Published' : 'Draft'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="card-premium p-6">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <span className="material-symbols-rounded text-primary-500">school</span>
                            Assign Classes
                        </h3>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {allClasses.map(cls => (
                                <div key={cls.id} className="space-y-2">
                                    <label className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                            checked={assignedClassIds.includes(cls.id)}
                                            onChange={() => handleClassToggle(cls.id)}
                                        />
                                        <span className="text-sm font-bold text-slate-700">{cls.name}</span>
                                    </label>
                                    {/* Batches toggle omitted for brevity or can be added similarly */}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Questions List */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <span className="material-symbols-rounded text-primary-500">list_alt</span>
                            Question bank
                        </h2>
                        <span className="text-sm font-medium text-slate-500">{questions.length} questions listed</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <AnimatePresence>
                            {questions.length === 0 ? (
                                <div className="card-premium p-20 text-center text-slate-400">
                                    <span className="material-symbols-rounded text-6xl mb-4">help_outline</span>
                                    <p className="text-lg">No questions added yet.</p>
                                    <button onClick={() => setIsModalOpen(true)} className="text-primary-600 font-bold hover:underline mt-2">Add your first question</button>
                                </div>
                            ) : questions.map((q, idx) => (
                                <motion.div
                                    key={q.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="card-premium p-6 group"
                                >
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-slate-500 text-xs font-bold">
                                                    Q{idx + 1}
                                                </span>
                                                <span className="px-2 py-0.5 rounded-lg bg-primary-50 text-primary-600 text-[10px] font-bold uppercase">
                                                    {q.topic || 'General'}
                                                </span>
                                                <span className="text-xs font-medium text-slate-400">• {q.marks} Marks</span>
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-800 mb-6">{q.text}</h3>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                                                {['a', 'b', 'c', 'd'].map(opt => (
                                                    <div key={opt} className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-colors ${q.correct_option === opt.toUpperCase()
                                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                                                        : 'bg-white border-slate-100 text-slate-600'
                                                        }`}>
                                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${q.correct_option === opt.toUpperCase()
                                                            ? 'bg-emerald-500 text-white'
                                                            : 'bg-slate-100 text-slate-500'
                                                            }`}>
                                                            {opt.toUpperCase()}
                                                        </span>
                                                        <span className="text-sm font-medium">{q[`option_${opt}`]}</span>
                                                        {q.correct_option === opt.toUpperCase() && (
                                                            <span className="material-symbols-rounded text-sm ml-auto">check_circle</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            {q.explanation && (
                                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                                                    <span className="material-symbols-rounded text-amber-500 text-xl shrink-0">lightbulb</span>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-800 uppercase mb-1">Explanation</p>
                                                        <p className="text-sm text-slate-600 leading-relaxed">{q.explanation}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openEditModal(q)}
                                                className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-primary-600 hover:bg-primary-50 hover:border-primary-100 transition-all"
                                            >
                                                <span className="material-symbols-rounded">edit</span>
                                            </button>
                                            <button
                                                onClick={() => deleteQuestion(q.id)}
                                                className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all"
                                            >
                                                <span className="material-symbols-rounded">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Add/Edit Question Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={editingQuestionId ? "Edit Question" : "Add New Question"}
                size="lg"
                footer={
                    <div className="flex gap-3">
                        <button onClick={closeModal} className="btn-premium px-6 py-2.5 bg-slate-100 text-slate-600 hover:bg-slate-200">Cancel</button>
                        <button form="question-form" type="submit" disabled={loading} className="btn-primary-gradient px-8 py-2.5">
                            {loading ? (editingQuestionId ? 'Updating...' : 'Adding...') : (editingQuestionId ? 'Update Question' : 'Save Question')}
                        </button>
                    </div>
                }
            >
                <form id="question-form" onSubmit={handleSaveQuestion} className="space-y-6">
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-slate-700 ml-1">Question Content</label>
                        <textarea
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all min-h-[100px]"
                            placeholder="What is the capital of France?"
                            value={newQ.text}
                            onChange={e => setNewQ({ ...newQ, text: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {['a', 'b', 'c', 'd'].map(opt => (
                            <div key={opt} className="space-y-1">
                                <label className="text-sm font-bold text-slate-700 ml-1">Option {opt.toUpperCase()}</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                                    placeholder={`Answer choice ${opt.toUpperCase()}`}
                                    value={newQ[`option_${opt}`]}
                                    onChange={e => setNewQ({ ...newQ, [`option_${opt}`]: e.target.value })}
                                    required
                                />
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700 ml-1">Correct Option</label>
                            <select
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all appearance-none cursor-pointer"
                                value={newQ.correct_option}
                                onChange={e => setNewQ({ ...newQ, correct_option: e.target.value })}
                            >
                                <option value="A">Option A</option>
                                <option value="B">Option B</option>
                                <option value="C">Option C</option>
                                <option value="D">Option D</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700 ml-1">Award Marks</label>
                            <input
                                type="number"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                                value={newQ.marks}
                                onChange={e => setNewQ({ ...newQ, marks: parseInt(e.target.value) })}
                                min="1"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700 ml-1">Topic/Category</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                                value={newQ.topic}
                                onChange={e => setNewQ({ ...newQ, topic: e.target.value })}
                                placeholder="e.g. History"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-bold text-slate-700 ml-1">Detailed Explanation</label>
                        <textarea
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all min-h-[80px]"
                            placeholder="Why is this answer correct?"
                            value={newQ.explanation}
                            onChange={e => setNewQ({ ...newQ, explanation: e.target.value })}
                        />
                    </div>
                </form>
            </Modal>
        </div >
    );
};

export default ManageTest;
