import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, trend, subValue, color = 'primary' }) => {
    const colors = {
        primary: 'bg-primary-50 text-primary-600',
        success: 'bg-emerald-50 text-emerald-600',
        warning: 'bg-amber-50 text-amber-600',
        danger: 'bg-rose-50 text-rose-600',
        info: 'bg-blue-50 text-blue-600',
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="card-premium p-6 flex items-center gap-5"
        >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${colors[color]}`}>
                <span className="material-symbols-rounded text-3xl">{icon}</span>
            </div>

            <div className="min-w-0">
                <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
                    {trend && (
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded-lg ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                            }`}>
                            {trend > 0 ? '+' : ''}{trend}%
                        </span>
                    )}
                </div>
                {subValue && (
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{subValue}</p>
                )}
            </div>
        </motion.div>
    );
};

export default StatCard;
