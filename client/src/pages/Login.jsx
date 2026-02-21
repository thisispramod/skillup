import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await login(email, password);
        setLoading(false);

        if (res.success) {
            Swal.fire({
                icon: 'success',
                title: 'Welcome Back!',
                text: 'Redirecting to your dashboard...',
                timer: 1500,
                showConfirmButton: false,
                toast: true,
                position: 'top-end'
            });
            navigate('/dashboard');
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: res.message,
                confirmButtonColor: '#8b5cf6'
            });
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-50">
            {/* Left Side: Illustration & Branding */}
            <div className="hidden lg:flex w-1/2 bg-primary-600 items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800 opacity-90"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-400/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>

                <div className="relative z-10 text-white max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-6 border border-white/30">
                            <span className="material-symbols-rounded text-4xl">school</span>
                        </div>
                        <h1 className="text-5xl font-bold mb-4 tracking-tight">Master your exams with confidence.</h1>
                        <p className="text-primary-100 text-lg">Online examination system designed for the modern learning environment. Track, improve, and succeed.</p>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-6 mt-12">
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                            <span className="material-symbols-rounded text-3xl mb-2">analytics</span>
                            <p className="font-bold text-white">Smart Analytics</p>
                            <p className="text-xs text-primary-100/70">Track your progress over time</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                            <span className="material-symbols-rounded text-3xl mb-2">menu_book</span>
                            <p className="font-bold text-white">Mistake Book</p>
                            <p className="text-xs text-primary-100/70">Learn from your mistakes</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="mb-10 lg:hidden text-center">
                        <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center text-white mx-auto mb-4">
                            <span className="material-symbols-rounded">school</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">SkillUp</h2>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h2>
                        <p className="text-slate-500 font-medium">Please enter your details to sign in.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                            <div className="relative">
                                <span className="material-symbols-rounded absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">mail</span>
                                <input
                                    type="email"
                                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                            <div className="relative">
                                <span className="material-symbols-rounded absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">lock</span>
                                <input
                                    type="password"
                                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-2">
                                <input id="remember" type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                                <label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer">Remember me</label>
                            </div>
                            <Link to="/forgot-password" disabled className="text-sm font-bold text-primary-600 hover:text-primary-700">Forgot Password?</Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-primary-600 text-white font-bold rounded-2xl shadow-lg shadow-primary-500/30 hover:bg-primary-700 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Sign In
                                    <span className="material-symbols-rounded text-xl">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-slate-600">
                            Don't have an account? {' '}
                            <Link to="/register" className="font-bold text-primary-600 hover:text-primary-700 underline decoration-2 underline-offset-4">
                                Create a Free Account
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8 p-4 bg-slate-100 rounded-2xl border border-slate-200">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">Demo Credentials</p>
                        <div className="flex justify-between text-xs text-slate-600 px-2">
                            <span>Admin: admin@test.com / admin123</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
