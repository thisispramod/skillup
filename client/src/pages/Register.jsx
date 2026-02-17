import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [classId, setClassId] = useState('');
    const [batchId, setBatchId] = useState('');
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const res = await api.get('/public/classes'); // Assuming this endpoint exists/will be created
            setClasses(res.data);
        } catch (err) {
            console.log("Could not fetch classes", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/register', {
                name,
                email,
                password,
                class_id: classId ? parseInt(classId) : null,
                batch_id: batchId ? parseInt(batchId) : null
            });

            await Swal.fire({
                icon: 'success',
                title: 'Account Created!',
                text: 'Your registration was successful. You can now login.',
                confirmButtonText: 'Proceed to Login',
                customClass: {
                    confirmButton: 'btn-primary-gradient',
                    popup: 'rounded-3xl'
                }
            });
            navigate('/login');
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: err.response?.data?.error || 'Something went wrong. Please try again.',
                customClass: { popup: 'rounded-3xl' }
            });
        } finally {
            setLoading(false);
        }
    };

    const selectedClass = classes.find(c => c.id === parseInt(classId));

    return (
        <div className="min-h-screen bg-white flex flex-col lg:flex-row font-inter overflow-hidden">
            {/* Left Side: Illustration & Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative items-center justify-center p-20 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px]"></div>
                </div>

                <div className="relative z-10 text-center space-y-8 max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-20 h-20 bg-primary-600 rounded-[2rem] mx-auto flex items-center justify-center shadow-2xl shadow-primary-500/40"
                    >
                        <span className="material-symbols-rounded text-white text-4xl">school</span>
                    </motion.div>
                    <div className="space-y-4">
                        <h1 className="text-5xl font-black text-white tracking-tight">Join our learning platform.</h1>
                        <p className="text-slate-400 text-lg font-medium leading-relaxed">
                            Create an account to start taking exams, track your progress, and improve your skills.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-left">
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <span className="material-symbols-rounded text-primary-500 mb-3">trending_up</span>
                            <h3 className="text-white font-bold text-sm">Performance Tracking</h3>
                            <p className="text-slate-500 text-xs mt-1">Get detailed insights into your strengths and weaknesses.</p>
                        </div>
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <span className="material-symbols-rounded text-emerald-500 mb-3">verified</span>
                            <h3 className="text-white font-bold text-sm">Verified Reports</h3>
                            <p className="text-slate-500 text-xs mt-1">Share your achievements with validated exam results.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Register Form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-20 bg-slate-50">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md space-y-8"
                >
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h2>
                        <p className="text-slate-500 font-medium mt-2">Enter your details to register as a student.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                            <div className="relative group">
                                <span className="material-symbols-rounded absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors">person</span>
                                <input
                                    type="text"
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                            <div className="relative group">
                                <span className="material-symbols-rounded absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors">alternate_email</span>
                                <input
                                    type="email"
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                            <div className="relative group">
                                <span className="material-symbols-rounded absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors">lock</span>
                                <input
                                    type="password"
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700 ml-1">Class</label>
                                <select
                                    className="w-full px-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-bold text-slate-800 cursor-pointer appearance-none"
                                    value={classId}
                                    onChange={e => { setClassId(e.target.value); setBatchId(''); }}
                                >
                                    <option value="">Select Class</option>
                                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700 ml-1">Batch</label>
                                <select
                                    className="w-full px-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-bold text-slate-800 cursor-pointer appearance-none disabled:opacity-50"
                                    value={batchId}
                                    onChange={e => setBatchId(e.target.value)}
                                    disabled={!classId}
                                >
                                    <option value="">Select Batch</option>
                                    {selectedClass?.Batches?.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary-gradient py-4 text-lg shadow-xl shadow-primary-500/20 disabled:opacity-50 mt-4 group"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Creating Account...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    Register Now
                                    <span className="material-symbols-rounded transition-transform group-hover:translate-x-1">arrow_forward</span>
                                </span>
                            )}
                        </button>

                        <div className="text-center">
                            <p className="text-slate-500 font-medium">
                                Already have an account? {' '}
                                <Link to="/login" className="text-primary-600 font-bold hover:underline">
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
