import React, { useState, useEffect } from 'react';
import api from '../../api';
import { motion, AnimatePresence } from 'framer-motion';

const Leaderboard = () => {
    const [leaderboardType, setLeaderboardType] = useState('global');
    const [rankings, setRankings] = useState([]);
    const [xpHistory, setXpHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [myStats, setMyStats] = useState({ total_xp: 0, current_streak: 0 });

    useEffect(() => {
        fetchLeaderboard();
        fetchXPHistory();
    }, [leaderboardType]);

    const fetchLeaderboard = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/leaderboard?type=${leaderboardType}`);
            setRankings(res.data);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchXPHistory = async () => {
        try {
            const res = await api.get('/user/xp-history');
            setXpHistory(res.data.logs || []);
            setMyStats({
                total_xp: res.data.total_xp,
                current_streak: res.data.current_streak
            });
        } catch (error) {
            console.error('Error fetching XP history:', error);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">XP Leaderboard</h1>
                    <p className="text-slate-500 font-medium">Climb the ranks by actively participating and scoring high.</p>
                </div>
                
                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
                    {['global', 'monthly', 'weekly'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setLeaderboardType(type)}
                            className={`px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                                leaderboardType === type 
                                ? 'bg-primary-600 text-white shadow-md' 
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* My Stats Banner */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card-premium p-6 border-l-4 border-l-amber-400 bg-gradient-to-br from-white to-amber-50/30 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center border-4 border-white shadow-md shrink-0">
                        <span className="material-symbols-rounded text-3xl text-amber-500">stars</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">My Total XP</h3>
                        <p className="text-3xl font-black text-slate-800 tracking-tight">{myStats.total_xp} <span className="text-amber-500 text-lg">XP</span></p>
                    </div>
                </div>

                <div className="card-premium p-6 border-l-4 border-l-orange-500 bg-gradient-to-br from-white to-orange-50/30 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center border-4 border-white shadow-md shrink-0">
                        <span className="material-symbols-rounded text-3xl text-orange-500">local_fire_department</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Active Streak</h3>
                        <p className="text-3xl font-black text-slate-800 tracking-tight">{myStats.current_streak} <span className="text-orange-500 text-lg">Days</span></p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Leaderboard Table */}
                <div className="lg:col-span-2 card-premium overflow-hidden border-2 border-primary-50">
                    <div className="p-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white flex items-center justify-between">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <span className="material-symbols-rounded text-amber-300">trophy</span>
                            Top Students ({leaderboardType})
                        </h3>
                    </div>
                    
                    <div className="p-0 overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/50 text-xs text-slate-400 font-bold uppercase tracking-widest border-b border-slate-100">
                                <tr>
                                    <th className="py-4 px-6 font-semibold">Rank</th>
                                    <th className="py-4 px-6 font-semibold">Student Name</th>
                                    <th className="py-4 px-6 text-right font-semibold">XP Earned</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && (
                                    <tr>
                                        <td colSpan="3" className="p-8 text-center">
                                            <div className="w-8 h-8 border-4 border-slate-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
                                        </td>
                                    </tr>
                                )}
                                {!loading && rankings.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="p-8 text-center text-slate-400 font-medium">
                                            No data available yet.
                                        </td>
                                    </tr>
                                )}
                                {!loading && rankings.map((user, idx) => (
                                    <tr 
                                        key={idx} 
                                        className={`group border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors
                                            ${user.is_me ? 'bg-primary-50/30' : ''}
                                        `}
                                    >
                                        <td className="py-4 px-6">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm
                                                ${user.rank === 1 ? 'bg-amber-100 text-amber-600 shadow-sm ring-1 ring-amber-200' : 
                                                  user.rank === 2 ? 'bg-slate-200 text-slate-600 shadow-sm ring-1 ring-slate-300' : 
                                                  user.rank === 3 ? 'bg-orange-100 text-orange-700 shadow-sm ring-1 ring-orange-200' : 
                                                  'text-slate-400'}`
                                            }>
                                                {user.rank}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 font-bold text-slate-700 flex items-center gap-3">
                                            {user.name}
                                            {user.is_me && (
                                                <span className="text-[10px] bg-primary-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">You</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full font-bold shadow-sm border border-amber-100">
                                                <span>{user.total_xp}</span>
                                                <span className="material-symbols-rounded text-sm">stars</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* XP History Panel */}
                <div className="card-premium p-6">
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <span className="material-symbols-rounded text-primary-500">history</span>
                        Recent XP Logs
                    </h3>
                    
                    <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                        {loading && xpHistory.length === 0 && (
                             <div className="text-center py-4 text-slate-400">Loading...</div>
                        )}
                        {!loading && xpHistory.length === 0 && (
                            <div className="text-center py-4 text-slate-400 font-medium">No XP earned yet.</div>
                        )}
                        {!loading && xpHistory.map((log) => (
                            <div key={log.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary-200 transition-colors flex justify-between items-center group">
                                <div className="space-y-1 pr-4">
                                    <p className="text-sm font-bold text-slate-700 leading-tight">{log.reason}</p>
                                    <p className="text-xs font-medium text-slate-400">{new Date(log.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</p>
                                </div>
                                <div className="shrink-0 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 font-black text-sm border border-emerald-100 shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                    +{log.amount}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
