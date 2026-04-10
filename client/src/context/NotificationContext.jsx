import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const showNotification = useCallback((message, type = 'success') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 3000);
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            
            {/* Notification Portal */}
            <div className="fixed top-24 right-6 z-[9999] flex flex-col gap-3 pointer-events-none w-full max-w-xs">
                <AnimatePresence>
                    {notifications.map(n => (
                        <motion.div
                            key={n.id}
                            initial={{ opacity: 0, x: 100, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 100, transition: { duration: 0.2 } }}
                            className="pointer-events-auto"
                        >
                            <div className={`
                                flex items-center justify-between gap-4 p-4 rounded-2xl shadow-2xl backdrop-blur-xl border
                                ${n.type === 'success' ? 'bg-slate-900/95 text-white border-slate-800' : 'bg-rose-600 text-white border-rose-500'}
                            `}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${n.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/20 text-white'}`}>
                                        <span className="material-symbols-rounded text-lg">
                                            {n.type === 'success' ? 'check_circle' : 'error'}
                                        </span>
                                    </div>
                                    <p className="text-sm font-bold tracking-tight">{n.message}</p>
                                </div>
                                <button 
                                    onClick={() => removeNotification(n.id)}
                                    className="text-white/50 hover:text-white transition-colors"
                                >
                                    <span className="material-symbols-rounded text-lg">close</span>
                                </button>
                                
                                {/* Progress Bar */}
                                <div className="absolute bottom-0 left-0 h-1 bg-white/20 rounded-full overflow-hidden w-full">
                                    <motion.div 
                                        initial={{ width: '100%' }}
                                        animate={{ width: 0 }}
                                        transition={{ duration: 3, ease: 'linear' }}
                                        className="h-full bg-white/40"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
