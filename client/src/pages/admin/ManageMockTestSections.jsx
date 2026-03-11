import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api';
import Swal from 'sweetalert2';
import Modal from '../../components/common/Modal';
import { motion, AnimatePresence } from 'framer-motion';

const ManageMockTestSections = () => {
    const { id: testId } = useParams();
    const [test, setTest] = useState(null);
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef(null);
    const [uploadingSectionId, setUploadingSectionId] = useState(null);

    // Manual Question Entry State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSectionId, setSelectedSectionId] = useState(null);
    const [editingQuestionId, setEditingQuestionId] = useState(null);
    const [savingQ, setSavingQ] = useState(false);
    const [newQ, setNewQ] = useState({
        text: '', image_url: '',
        option_a: '', option_a_image: '',
        option_b: '', option_b_image: '',
        option_c: '', option_c_image: '',
        option_d: '', option_d_image: '',
        correct_option: 'A',
        explanation: '', explanation_image: ''
    });

    // View Questions State
    const [viewingSectionId, setViewingSectionId] = useState(null);

    useEffect(() => {
        fetchTestDetails();
    }, [testId]);

    const fetchTestDetails = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/admin/mock-tests/${testId}`);
            setTest(res.data);
        } catch (err) {
            Swal.fire('Error', 'Failed to fetch test details', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSection = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Create New Section',
            html: `
                <div class="flex flex-col gap-4 text-left">
                    <div>
                        <label class="text-sm font-semibold text-slate-600 ml-1">Section Name</label>
                        <input id="swal-sec-name" class="w-full mt-1 px-4 py-2 border rounded-xl" placeholder="e.g. General Intelligence">
                    </div>
                    <div>
                        <label class="text-sm font-semibold text-slate-600 ml-1">Order Index</label>
                        <p class="text-[10px] text-slate-400 ml-1 mb-1">Determines the sequence of sections (0, 1, 2...)</p>
                        <input id="swal-sec-order" type="number" class="w-full mt-1 px-4 py-2 border rounded-xl" value="0">
                    </div>
                </div>`,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Create Section',
            preConfirm: () => {
                const name = document.getElementById('swal-sec-name').value;
                if (!name) {
                    Swal.showValidationMessage('Name is required');
                    return false;
                }
                return {
                    name,
                    order_index: parseInt(document.getElementById('swal-sec-order').value) || 0,
                };
            }
        });

        if (formValues) {
            try {
                await api.post(`/admin/mock-tests/${testId}/sections`, formValues);
                Swal.fire({ icon: 'success', title: 'Section Created!', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
                fetchTestDetails();
            } catch (err) {
                Swal.fire('Error', 'Failed to create section', 'error');
            }
        }
    };

    const handleDeleteSection = async (sectionId) => {
        if (await Swal.fire({ title: 'Delete section?', icon: 'warning', showCancelButton: true }).then(r => r.isConfirmed)) {
            try {
                await api.delete(`/admin/mock-test-sections/${sectionId}`);
                Swal.fire('Deleted!', '', 'success');
                if (viewingSectionId === sectionId) setViewingSectionId(null);
                fetchTestDetails();
            } catch (err) {
                Swal.fire('Error', 'Failed to delete section', 'error');
            }
        }
    };

    const handleDeleteQuestion = async (questionId) => {
        if (await Swal.fire({ title: 'Delete question?', icon: 'warning', showCancelButton: true }).then(r => r.isConfirmed)) {
            try {
                await api.delete(`/admin/mock-test-questions/${questionId}`);
                Swal.fire('Deleted!', '', 'success');
                fetchTestDetails();
            } catch (err) {
                Swal.fire('Error', 'Failed to delete question', 'error');
            }
        }
    };

    const handleFileUpload = async (e, sectionId) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploadingSectionId(sectionId);
        try {
            const res = await api.post(`/admin/mock-test-sections/${sectionId}/import`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            Swal.fire('Success', `${res.data.count} questions imported successfully`, 'success');
            fetchTestDetails();
        } catch (err) {
            console.error(err);
            Swal.fire('Import Failed', err.response?.data?.message || 'Check the file format and try again.', 'error');
        } finally {
            setUploadingSectionId(null);
            e.target.value = '';
        }
    };

    const handleDownloadTemplate = async () => {
        try {
            const response = await api.get('/admin/mock-test-sample-sheet', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'mock_test_question_template.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            Swal.fire('Error', 'Failed to download template', 'error');
        }
    };

    const openAddQuestionModal = (sectionId) => {
        setNewQ({
            text: '', image_url: '',
            option_a: '', option_a_image: '',
            option_b: '', option_b_image: '',
            option_c: '', option_c_image: '',
            option_d: '', option_d_image: '',
            correct_option: 'A',
            explanation: '', explanation_image: ''
        });
        setSelectedSectionId(sectionId);
        setEditingQuestionId(null);
        setIsModalOpen(true);
    };

    const openEditQuestionModal = (q, sectionId) => {
        setNewQ({
            text: q.text || '', image_url: q.image_url || '',
            option_a: q.option_a || '', option_a_image: q.option_a_image || '',
            option_b: q.option_b || '', option_b_image: q.option_b_image || '',
            option_c: q.option_c || '', option_c_image: q.option_c_image || '',
            option_d: q.option_d || '', option_d_image: q.option_d_image || '',
            correct_option: q.correct_option || 'A',
            explanation: q.explanation || '', explanation_image: q.explanation_image || ''
        });
        setSelectedSectionId(sectionId);
        setEditingQuestionId(q.id);
        setIsModalOpen(true);
    };

    const closeQuestionModal = () => {
        setIsModalOpen(false);
        setSelectedSectionId(null);
        setEditingQuestionId(null);
    };

    const handleSaveQuestion = async (e) => {
        e.preventDefault();
        setSavingQ(true);
        try {
            if (editingQuestionId) {
                await api.put(`/admin/mock-test-questions/${editingQuestionId}`, newQ);
                Swal.fire({ icon: 'success', title: 'Question Updated', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
            } else {
                await api.post(`/admin/mock-test-sections/${selectedSectionId}/questions`, newQ);
                Swal.fire({ icon: 'success', title: 'Question Added', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
            }
            closeQuestionModal();
            fetchTestDetails();
        } catch (err) {
            Swal.fire('Error', `Failed to ${editingQuestionId ? 'update' : 'add'} question`, 'error');
        } finally {
            setSavingQ(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!test) return <div>Test not found</div>;

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link to="/admin/manage-mock-tests" className="p-2 rounded-xl text-slate-400 hover:bg-white hover:text-slate-600 border border-transparent hover:border-slate-200 transition-all">
                        <span className="material-symbols-rounded">arrow_back</span>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">{test.title} - Sections</h1>
                        <p className="text-slate-500 font-medium">Manage sections and import questions for this mock test.</p>
                    </div>
                </div>
                <button onClick={handleCreateSection} className="btn-primary-gradient">
                    <span className="material-symbols-rounded mr-2">add</span> Add Section
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {test.MockTestSections?.sort((a,b)=> a.order_index - b.order_index).map(section => (
                    <div key={section.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-bold text-slate-800">{section.name}</h3>
                            <button onClick={() => handleDeleteSection(section.id)} className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-colors">
                                <span className="material-symbols-rounded text-sm">delete</span>
                            </button>
                        </div>
                        <div className="space-y-2 mb-6 text-sm text-slate-600">
                            <div className="flex justify-between">
                                <span>Total Questions</span>
                                <span className="font-bold">{section.MockTestQuestions?.length || 0}</span>
                            </div>
                        </div>
                        
                        <div className="relative">
                            <input 
                                type="file" 
                                accept=".xlsx, .xls"
                                onChange={(e) => handleFileUpload(e, section.id)}
                                className="hidden"
                                id={`file-upload-${section.id}`}
                                disabled={uploadingSectionId === section.id}
                            />
                            <label 
                                htmlFor={`file-upload-${section.id}`}
                                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer
                                    ${uploadingSectionId === section.id 
                                        ? 'bg-slate-100 text-slate-400' 
                                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'}`}
                            >
                                {uploadingSectionId === section.id ? (
                                    <><span className="material-symbols-rounded animate-spin">sync</span> Importing...</>
                                ) : (
                                    <><span className="material-symbols-rounded">upload_file</span> Import Questions</>
                                )}
                            </label>
                            
                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                                <button 
                                    onClick={handleDownloadTemplate}
                                    className="text-xs text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-1"
                                >
                                    <span className="material-symbols-rounded text-sm">download</span> Sample Template
                                </button>
                                <button 
                                    onClick={() => openAddQuestionModal(section.id)}
                                    className="text-xs text-emerald-600 font-semibold hover:text-emerald-700 flex items-center gap-1"
                                >
                                    <span className="material-symbols-rounded text-sm">add_circle</span> Add Manually
                                </button>
                            </div>
                            
                            {section.MockTestQuestions?.length > 0 && (
                                <button
                                    onClick={() => setViewingSectionId(viewingSectionId === section.id ? null : section.id)}
                                    className="w-full mt-3 py-2 text-sm font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
                                >
                                    {viewingSectionId === section.id ? 'Hide Questions' : 'View Questions'}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Questions Viewer */}
            <AnimatePresence>
                {viewingSectionId && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
                        className="mt-8 border-t border-slate-200 pt-8"
                    >
                        {(() => {
                            const activeSection = test.MockTestSections.find(s => s.id === viewingSectionId);
                            if (!activeSection) return null;
                            
                            return (
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                            <span className="material-symbols-rounded text-primary-500">list_alt</span>
                                            Questions for {activeSection.name}
                                        </h2>
                                        <button onClick={() => setViewingSectionId(null)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100">
                                            <span className="material-symbols-rounded">close</span>
                                        </button>
                                    </div>

                                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                        {activeSection.MockTestQuestions?.length === 0 ? (
                                            <div className="text-center p-8 bg-slate-50 rounded-2xl border border-slate-200 text-slate-500">
                                                No questions added yet.
                                            </div>
                                        ) : (
                                            activeSection.MockTestQuestions?.map((q, idx) => (
                                                <div key={q.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group">
                                                    <div className="flex justify-between items-start gap-4 mb-4">
                                                        <div className="flex items-start gap-3">
                                                            <span className="shrink-0 flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm">
                                                                Q{idx + 1}
                                                            </span>
                                                            <div>
                                                                <p className="text-slate-800 font-medium whitespace-pre-wrap">{q.text}</p>
                                                                {q.image_url && (
                                                                    <img src={q.image_url} alt="Question" className="mt-3 max-h-40 rounded-lg border border-slate-200" />
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-row gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                                            <button 
                                                                onClick={() => openEditQuestionModal(q, activeSection.id)}
                                                                className="p-2 text-primary-400 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors border border-transparent hover:border-primary-100"
                                                                title="Edit Question"
                                                            >
                                                                <span className="material-symbols-rounded">edit</span>
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteQuestion(q.id)}
                                                                className="p-2 text-rose-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-colors border border-transparent hover:border-rose-100"
                                                                title="Delete Question"
                                                            >
                                                                <span className="material-symbols-rounded">delete</span>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-11">
                                                        {['a', 'b', 'c', 'd'].map(opt => (
                                                            <div key={opt} className={`p-3 rounded-xl border flex items-center gap-3 ${q.correct_option === opt.toUpperCase() ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100'}`}>
                                                                <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${q.correct_option === opt.toUpperCase() ? 'bg-emerald-500 text-white' : 'bg-white border border-slate-300 text-slate-500'}`}>
                                                                    {opt.toUpperCase()}
                                                                </span>
                                                                <div className="flex-1">
                                                                    <p className={`text-sm ${q.correct_option === opt.toUpperCase() ? 'text-emerald-900 font-medium' : 'text-slate-700'}`}>
                                                                        {q[`option_${opt}`]}
                                                                    </p>
                                                                    {q[`option_${opt}_image`] && (
                                                                        <img src={q[`option_${opt}_image`]} alt={`Option ${opt.toUpperCase()}`} className="mt-2 max-h-20 rounded border border-slate-200" />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    
                                                    {q.explanation && (
                                                        <div className="mt-4 pl-11">
                                                            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-sm">
                                                                <p className="font-bold text-amber-800 mb-1 flex items-center gap-1">
                                                                    <span className="material-symbols-rounded text-sm">lightbulb</span> Explanation
                                                                </p>
                                                                <p className="text-amber-900 whitespace-pre-wrap">{q.explanation}</p>
                                                                {q.explanation_image && (
                                                                    <img src={q.explanation_image} alt="Explanation" className="mt-2 max-h-32 rounded border border-amber-200" />
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            );
                        })()}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add/Edit Question Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeQuestionModal}
                title={editingQuestionId ? "Edit Mock Test Question" : "Add Mock Test Question"}
                size="xl"
                footer={
                    <div className="flex justify-end gap-3">
                        <button onClick={closeQuestionModal} className="btn-premium px-6 py-2.5 bg-slate-100 text-slate-600 hover:bg-slate-200">Cancel</button>
                        <button form="mock-question-form" type="submit" disabled={savingQ} className="btn-primary-gradient px-8 py-2.5">
                            {savingQ ? 'Saving...' : (editingQuestionId ? 'Update Question' : 'Save Question')}
                        </button>
                    </div>
                }
            >
                <form id="mock-question-form" onSubmit={handleSaveQuestion} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                    <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700 ml-1">Question Content <span className="text-rose-500">*</span></label>
                            <textarea
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all min-h-[80px]"
                                placeholder="Enter question text..."
                                value={newQ.text}
                                onChange={e => setNewQ({ ...newQ, text: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700 ml-1">Question Image URL (Optional)</label>
                            <input
                                type="url"
                                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                                placeholder="https://example.com/image.png"
                                value={newQ.image_url}
                                onChange={e => setNewQ({ ...newQ, image_url: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['a', 'b', 'c', 'd'].map(opt => (
                            <div key={opt} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Option {opt.toUpperCase()} <span className="text-rose-500">*</span></label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                                        placeholder={`Option ${opt.toUpperCase()} text`}
                                        value={newQ[`option_${opt}`]}
                                        onChange={e => setNewQ({ ...newQ, [`option_${opt}`]: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 ml-1">Option {opt.toUpperCase()} Image URL</label>
                                    <input
                                        type="url"
                                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                                        placeholder="Optional image URL"
                                        value={newQ[`option_${opt}_image`]}
                                        onChange={e => setNewQ({ ...newQ, [`option_${opt}_image`]: e.target.value })}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-primary-50 p-4 rounded-2xl border border-primary-100 space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-primary-900 ml-1">Correct Option <span className="text-rose-500">*</span></label>
                            <select
                                className="w-full px-4 py-3 bg-white border border-primary-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all cursor-pointer font-bold text-primary-700"
                                value={newQ.correct_option}
                                onChange={e => setNewQ({ ...newQ, correct_option: e.target.value })}
                            >
                                <option value="A">Option A</option>
                                <option value="B">Option B</option>
                                <option value="C">Option C</option>
                                <option value="D">Option D</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700 ml-1">Explanation (Optional)</label>
                            <textarea
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all min-h-[80px]"
                                placeholder="Why is this answer correct?"
                                value={newQ.explanation}
                                onChange={e => setNewQ({ ...newQ, explanation: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700 ml-1">Explanation Image URL (Optional)</label>
                            <input
                                type="url"
                                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                                placeholder="https://example.com/explanation.png"
                                value={newQ.explanation_image}
                                onChange={e => setNewQ({ ...newQ, explanation_image: e.target.value })}
                            />
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ManageMockTestSections;
