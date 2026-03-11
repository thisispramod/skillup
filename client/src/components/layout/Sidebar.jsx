import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isOpen, toggleSidebar, role, onLogout }) => {
    const location = useLocation();
    const [isMobile, setIsMobile] = React.useState(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);

    React.useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const menuItems = role === 'admin' ? [
        { name: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard' },
        { name: 'Manage Tests', path: '/admin/manage-tests', icon: 'quiz' },
        { name: 'Mock Tests', path: '/admin/manage-mock-tests', icon: 'assignment' },
        { name: 'Manage Students', path: '/admin/students', icon: 'group' },
        { name: 'Manage Classes', path: '/admin/classes', icon: 'school' },
        { name: 'Reports', path: '/admin/reports', icon: 'analytics' },
        { name: 'Mistake Analytics', path: '/admin/mistake-analytics', icon: 'error' },
    ] : [
        { name: 'Dashboard', path: '/student/dashboard', icon: 'dashboard' },
        { name: 'Mock Tests', path: '/student/mock-tests', icon: 'assignment' },
        { name: 'Mock Test Reports', path: '/student/mock-test-reports', icon: 'history' },
        { name: 'Mistake Book', path: '/student/mistake-book', icon: 'menu_book' },
        { name: 'Reports', path: '/student/reports', icon: 'assessment' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleSidebar}
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    x: isOpen || !isMobile ? 0 : -280,
                    width: 280
                }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 h-full bg-white border-r border-slate-200 z-50 lg:static lg:translate-x-0"
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
                            <span className="material-symbols-rounded">school</span>
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                            SkillUp
                        </span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) => `
                                        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                                        ${isActive
                                            ? 'bg-primary-50 text-primary-600 font-bold'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                                    `}
                                >
                                    <span className={`material-symbols-rounded transition-colors ${isActive ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                                        {item.icon}
                                    </span>
                                    <span className="text-sm">{item.name}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-pill"
                                            className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-600"
                                        />
                                    )}
                                </NavLink>
                            );
                        })}
                    </nav>

                    {/* Bottom Profile / Logout */}
                    <div className="p-4 border-t border-slate-100">
                        <button
                            onClick={onLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors group"
                        >
                            <span className="material-symbols-rounded text-rose-400 group-hover:text-rose-600">logout</span>
                            <span className="font-bold text-sm">Logout</span>
                        </button>
                    </div>
                </div>
            </motion.aside>
        </>
    );
};

export default Sidebar;
