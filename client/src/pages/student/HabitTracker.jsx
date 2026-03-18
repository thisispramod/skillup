import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const HabitTracker = () => {
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [deletingHabitId, setDeletingHabitId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [notification, setNotification] = useState(null);

    const [newHabit, setNewHabit] = useState({
        habit_name: '',
        category: 'Study',
        start_date: new Date().toISOString().split('T')[0],
        goal: '',
        weekly_target: 7
    });

    const categories = ['Study', 'Health', 'Personal Development'];

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const padZero = (num) => num.toString().padStart(2, '0');

    useEffect(() => {
        fetchHabits();
    }, []);

    // Daily Reminder System
    useEffect(() => {
        if (habits.length === 0) return;

        const checkReminders = () => {
            const now = new Date();
            const hour = now.getHours();
            
            // Trigger evening reminder between 18:00 and 22:00
            if (hour >= 18 && hour <= 22) {
                const todayStr = `${now.getFullYear()}-${padZero(now.getMonth() + 1)}-${padZero(now.getDate())}`;
                const incompleteHabits = habits.filter(h => {
                    const log = h.HabitLogs?.find(l => l.date === todayStr);
                    return !log || !log.status;
                });

                if (incompleteHabits.length > 0) {
                    const randomHabit = incompleteHabits[Math.floor(Math.random() * incompleteHabits.length)];
                    const stats = calculateStats(randomHabit);
                    
                    let message = `Don't break your ${stats.currentStreak} day streak for ${randomHabit.habit_name}! 🔥`;
                    if (stats.daysRemaining === 1) {
                        message = `You're just 1 day away from your weekly goal for ${randomHabit.habit_name}! 🚀`;
                    }

                    // Only show if not already shown in this session
                    setNotification({
                        id: Date.now(),
                        message,
                        type: 'reminder'
                    });
                }
            }
        };

        const timer = setTimeout(checkReminders, 5000); // Check 5 seconds after mount
        return () => clearTimeout(timer);
    }, [habits.length]); // Re-run when habits are loaded

    const fetchHabits = async () => {
        try {
            setLoading(true);
            const res = await api.get('/student/habits');
            setHabits(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddHabit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/student/habits', newHabit);
            setHabits([...habits, { ...res.data, HabitLogs: [] }]);
            setShowModal(false);
            setNewHabit({ habit_name: '', category: 'Study', start_date: new Date().toISOString().split('T')[0], goal: '' });
        } catch (err) {
            console.error('Error adding habit', err);
        }
    };

    const handleDeleteHabit = async (id) => {
        setIsDeleting(true);
        try {
            await api.delete(`/student/habits/${id}`);
            setHabits(habits.filter(h => h.id !== id));
            setDeletingHabitId(null);
        } catch (err) {
            console.error('Error deleting habit', err);
        } finally {
            setIsDeleting(false);
        }
    };

    const toggleHabitLog = async (habitId, day) => {
        const dateStr = `${currentYear}-${padZero(currentMonth + 1)}-${padZero(day)}`;
        const habitIndex = habits.findIndex(h => h.id === habitId);
        const habit = habits[habitIndex];

        let existingLog = habit.HabitLogs?.find(log => log.date === dateStr);
        let newStatus = true;

        if (existingLog) {
            newStatus = !existingLog.status;
        }

        try {
            const res = await api.post(`/student/habits/${habitId}/log`, {
                date: dateStr,
                status: newStatus
            });

            const updatedHabits = [...habits];
            let logs = updatedHabits[habitIndex].HabitLogs || [];

            if (existingLog) {
                logs = logs.map(l => l.date === dateStr ? { ...l, status: newStatus } : l);
            } else {
                logs.push({ date: dateStr, status: newStatus });
            }

            updatedHabits[habitIndex].HabitLogs = logs;
            updatedHabits[habitIndex].points = res.data.points;

            setHabits(updatedHabits);
        } catch (err) {
            console.error('Error toggling habit log', err);
        }
    };

    const calculateStats = (habit) => {
        const logs = habit.HabitLogs || [];
        let currentStreak = 0;
        let longestStreak = 0;
        let monthCompletions = 0;
        let missedDays = 0;
        let eligibleDays = 0;

        const startDay = new Date(habit.start_date).getMonth() === currentMonth ? new Date(habit.start_date).getDate() : 1;

        for (let d = 1; d <= daysInMonth; d++) {
            const dDate = new Date(currentYear, currentMonth, d);
            if (dDate < new Date(habit.start_date)) continue;

            if (dDate <= currentDate) {
                eligibleDays++;
                const dStr = `${currentYear}-${padZero(currentMonth + 1)}-${padZero(d)}`;
                const log = logs.find(l => l.date === dStr);

                if (log && log.status) {
                    currentStreak++;
                    monthCompletions++;
                    if (currentStreak > longestStreak) longestStreak = currentStreak;
                } else {
                    currentStreak = 0;
                    missedDays++;
                }
            }
        }

        // Weekly Stats calculation
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
        startOfWeek.setHours(0, 0, 0, 0);

        let weeklyCompletions = 0;
        for (let i = 0; i < 7; i++) {
            const d = new Date(startOfWeek);
            d.setDate(startOfWeek.getDate() + i);
            const dStr = `${d.getFullYear()}-${padZero(d.getMonth() + 1)}-${padZero(d.getDate())}`;
            const log = logs.find(l => l.date === dStr);
            if (log && log.status) weeklyCompletions++;
        }

        const weeklyTarget = habit.weekly_target || 7;
        const weeklyProgress = Math.min(Math.round((weeklyCompletions / weeklyTarget) * 100), 100);
        const daysRemaining = Math.max(weeklyTarget - weeklyCompletions, 0);

        return {
            longestStreak,
            currentStreak,
            monthCompletions,
            eligibleDays,
            completionRate: eligibleDays > 0 ? Math.round((monthCompletions / eligibleDays) * 100) : 0,
            missedDays,
            weeklyCompletions,
            weeklyTarget,
            weeklyProgress,
            daysRemaining
        };
    };

    const overallStats = useMemo(() => {
        if (habits.length === 0) return { totalCompletions: 0, avgRate: 0, bestStreak: 0, points: 0 };

        const individualStats = habits.map(h => calculateStats(h));
        const totalCompletions = individualStats.reduce((acc, s) => acc + s.monthCompletions, 0);
        const avgRate = Math.round(individualStats.reduce((acc, s) => acc + s.completionRate, 0) / habits.length);
        const bestStreak = Math.max(...individualStats.map(s => s.longestStreak));
        const points = habits.reduce((acc, h) => acc + (h.points || 0), 0);
        const totalMissed = individualStats.reduce((acc, s) => acc + s.missedDays, 0);

        return { totalCompletions, avgRate, bestStreak, points, totalMissed };
    }, [habits]);

    const chartData = useMemo(() => {
        // Daily completion trend
        const dailyCounts = daysArray.map(day => {
            const dStr = `${currentYear}-${padZero(currentMonth + 1)}-${padZero(day)}`;
            return habits.reduce((acc, habit) => {
                const log = habit.HabitLogs?.find(l => l.date === dStr);
                return acc + (log && log.status ? 1 : 0);
            }, 0);
        });

        // Weekly progress (last 7 days)
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            last7Days.push(d.getDate());
        }

        return {
            lineData: {
                labels: daysArray.filter(d => d <= currentDate.getDate()),
                datasets: [{
                    label: 'Habits Completed',
                    data: dailyCounts.slice(0, currentDate.getDate()),
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#6366f1'
                }]
            },
            barData: {
                labels: habits.map(h => h.habit_name.substring(0, 10) + (h.habit_name.length > 10 ? '..' : '')),
                datasets: [{
                    label: 'Completion %',
                    data: habits.map(h => calculateStats(h).completionRate),
                    backgroundColor: habits.map((_, i) => `hsla(${140 + (i * 40)}, 70%, 50%, 0.8)`),
                    borderRadius: 8
                }]
            }
        };
    }, [habits]);

    const getBadge = () => {
        const pts = overallStats.points;
        if (pts >= 150) return { name: 'Master 🏆', color: 'bg-amber-100 text-amber-700' };
        if (pts >= 75) return { name: 'Consistent ⭐', color: 'bg-blue-100 text-blue-700' };
        if (pts >= 25) return { name: 'Beginner 🌟', color: 'bg-emerald-100 text-emerald-700' };
        return { name: 'Novice 🌱', color: 'bg-slate-100 text-slate-700' };
    };

    const getMotivation = () => {
        const rate = overallStats.avgRate;
        if (rate >= 80) return "Great job! You're crushing it! 🚀";
        if (rate >= 50) return "Consistency is key 🔥 Keep going!";
        if (rate > 0) return "Every step counts. You can do this! 💪";
        return "Time to build some good habits! Start today! 🎯";
    };

    const badge = getBadge();
    const currentDay = currentDate.getDate();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in pb-10 print:p-0 relative">
            {/* In-app Notification System */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -20, x: '-50%' }}
                        className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] w-full max-w-md px-4"
                    >
                        <div className="bg-slate-900 border border-slate-800 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 backdrop-blur-xl bg-opacity-95">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                    <span className="material-symbols-rounded text-indigo-400">notifications_active</span>
                                </div>
                                <p className="text-sm font-bold leading-tight">{notification.message}</p>
                            </div>
                            <button 
                                onClick={() => setNotification(null)}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <span className="material-symbols-rounded">close</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Habit Tracker</h1>
                    <p className="text-slate-500 font-medium">{getMotivation()}</p>
                </div>
                <div className="flex gap-3 items-center">
                    <button
                        onClick={() => setShowReport(true)}
                        className="btn-premium bg-white text-indigo-600 border border-indigo-100 px-4 py-2 flex items-center gap-2"
                    >
                        <span className="material-symbols-rounded text-sm">analytics</span>
                        Monthly Report
                    </button>
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn-primary-gradient px-4 py-2 flex items-center gap-2"
                    >
                        <span className="material-symbols-rounded text-sm">add</span>
                        New Habit
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 no-print">
                <div className="card-premium p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <span className="material-symbols-rounded">checklist</span>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Habits</p>
                        <p className="text-xl font-bold text-slate-800">{habits.length}</p>
                    </div>
                </div>
                <div className="card-premium p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <span className="material-symbols-rounded">trending_up</span>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Avg. Completion</p>
                        <p className="text-xl font-bold text-slate-800">{overallStats.avgRate}%</p>
                    </div>
                </div>
                <div className="card-premium p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                        <span className="material-symbols-rounded">local_fire_department</span>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Best Streak</p>
                        <p className="text-xl font-bold text-slate-800">{overallStats.bestStreak} Days</p>
                    </div>
                </div>
                <div className="card-premium p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                        <span className="material-symbols-rounded">workspace_premium</span>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Level & Points</p>
                        <p className="text-sm font-bold text-slate-800">{badge.name} ({overallStats.points} pts)</p>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Visual Analytics */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6 no-print">
                    <div className="card-premium p-6">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <span className="material-symbols-rounded text-indigo-500">show_chart</span>
                            Daily Activity Trend
                        </h3>
                        <div className="h-[250px]">
                            <Line
                                data={chartData.lineData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
                                }}
                            />
                        </div>
                    </div>
                    <div className="card-premium p-6">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <span className="material-symbols-rounded text-emerald-500">bar_chart</span>
                            Habit Comparison
                        </h3>
                        <div className="h-[250px]">
                            <Bar
                                data={chartData.barData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    scales: { y: { max: 100 } }
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Tracker Grid */}
                <div className="lg:col-span-12 card-premium overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center no-print">
                        <h2 className="font-bold text-slate-800 flex items-center gap-2">
                            <span className="material-symbols-rounded text-primary-500">calendar_view_day</span>
                            Activity Calendar - {currentDate.toLocaleString('default', { month: 'long' })}
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead className="text-xs text-slate-400 uppercase bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 min-w-[200px] sticky left-0 bg-slate-50 z-20 font-bold border-r border-slate-100">Habit Name</th>
                                    {daysArray.map(day => (
                                        <th
                                            key={day}
                                            className={`px-1 py-4 text-center min-w-[38px] ${day === currentDay ? 'bg-indigo-50 text-indigo-600 font-black' : ''}`}
                                        >
                                            {day}
                                        </th>
                                    ))}
                                    <th className="px-6 py-4 text-center min-w-[100px] font-bold">Progress</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {habits.length === 0 ? (
                                    <tr>
                                        <td colSpan={daysInMonth + 2} className="px-6 py-12 text-center text-slate-400 italic">
                                            No habits detected. Click "New Habit" to get started!
                                        </td>
                                    </tr>
                                ) : (
                                    habits.map((habit) => {
                                        const stats = calculateStats(habit);
                                        return (
                                            <tr key={habit.id} className="hover:bg-indigo-50/20 group transition-colors">
                                                <td className="px-6 py-4 sticky left-0 bg-white group-hover:bg-indigo-50/10 z-10 border-r border-slate-100 shadow-[2px_0_5px_rgba(0,0,0,0,05)] relative overflow-hidden transition-all duration-300">
                                                    {/* Background Delete Icon */}
                                                    <div
                                                        onClick={() => setDeletingHabitId(habit.id)}
                                                        className="absolute -right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-10 translate-x-4 group-hover:translate-x-0 transition-all duration-300 cursor-pointer no-print"
                                                    >
                                                        <span className="material-symbols-rounded text-3xl text-rose-600">delete</span>
                                                    </div>

                                                    <div className="flex flex-col relative z-20">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-black text-slate-900 tracking-tight">{habit.habit_name}</span>
                                                        </div>
                                                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{habit.category}</span>
                                                    </div>

                                                    {/* In-built Confirmation Overlay */}
                                                    <AnimatePresence>
                                                        {deletingHabitId === habit.id && (
                                                            <motion.div
                                                                initial={{ x: '-100%' }}
                                                                animate={{ x: 0 }}
                                                                exit={{ x: '-100%' }}
                                                                className="absolute inset-0 bg-rose-600 z-30 flex items-center justify-between px-4 no-print"
                                                            >
                                                                <span className="text-white text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Delete?</span>
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        onClick={() => setDeletingHabitId(null)}
                                                                        className="w-7 h-7 rounded-lg bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
                                                                    >
                                                                        <span className="material-symbols-rounded text-sm">close</span>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteHabit(habit.id)}
                                                                        disabled={isDeleting}
                                                                        className="w-7 h-7 rounded-lg bg-white text-rose-600 flex items-center justify-center hover:bg-rose-50 transition-colors shadow-lg"
                                                                    >
                                                                        {isDeleting ? (
                                                                            <div className="w-3 h-3 border-2 border-rose-600/30 border-t-rose-600 rounded-full animate-spin"></div>
                                                                        ) : (
                                                                            <span className="material-symbols-rounded text-sm">check</span>
                                                                        )}
                                                                    </button>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </td>

                                                {daysArray.map(day => {
                                                    const dDate = new Date(currentYear, currentMonth, day);
                                                    const dStr = `${currentYear}-${padZero(currentMonth + 1)}-${padZero(day)}`;
                                                    const log = habit.HabitLogs?.find(l => l.date === dStr);
                                                    const isDone = log?.status;
                                                    const isFuture = dDate > currentDate;
                                                    const isBeforeStart = dDate < new Date(habit.start_date);

                                                    let statusIcon = null;
                                                    let bgColor = 'bg-slate-50';

                                                    if (isBeforeStart) {
                                                        bgColor = 'bg-slate-50/50 cursor-not-allowed';
                                                    } else if (!isFuture) {
                                                        bgColor = 'bg-rose-100 group-hover:bg-rose-200';
                                                    }

                                                    return (
                                                        <td
                                                            key={day}
                                                            className={`px-1 py-1.5 text-center transition-all ${day === currentDay ? 'bg-indigo-50/40 relative' : ''}`}
                                                        >
                                                            {day === currentDay && (
                                                                <div className="absolute inset-0 border-2 border-indigo-200/50 pointer-events-none rounded-lg mx-0.5 my-1"></div>
                                                            )}
                                                            <button
                                                                disabled={isFuture || isBeforeStart}
                                                                onClick={() => toggleHabitLog(habit.id, day)}
                                                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200
                                                                    ${isDone
                                                                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100 scale-105'
                                                                        : isFuture || isBeforeStart
                                                                            ? 'bg-slate-100/50 opacity-20'
                                                                            : 'bg-slate-100 hover:bg-indigo-100 text-slate-300 hover:text-indigo-400'}
                                                                    ${day === currentDay && !isDone ? 'ring-2 ring-indigo-400 ring-offset-2' : ''}
                                                                    ${!isFuture && !isBeforeStart ? 'hover:scale-110 active:scale-95' : 'cursor-not-allowed'}
                                                                `}
                                                            >
                                                                {isDone ? (
                                                                    <span className="material-symbols-rounded text-[18px]">check_circle</span>
                                                                ) : day === currentDay ? (
                                                                    <div className="w-3 h-3 rounded-full border-2 border-indigo-400 animate-pulse"></div>
                                                                ) : !isFuture && !isBeforeStart ? (
                                                                    <span className="material-symbols-rounded text-[14px] opacity-0 group-hover:opacity-100">add</span>
                                                                ) : null}
                                                            </button>
                                                        </td>
                                                    );
                                                })}

                                                <td className="px-6 py-4 bg-slate-50/30">
                                                    <div className="flex flex-col gap-2 min-w-[120px]">
                                                        <div className="flex justify-between items-end">
                                                            <div className="flex items-center gap-1">
                                                                <span className="material-symbols-rounded text-orange-500 text-[16px]">local_fire_department</span>
                                                                <span className="font-black text-slate-700 text-sm">{stats.currentStreak}</span>
                                                            </div>
                                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${stats.weeklyProgress >= 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>
                                                                {stats.weeklyCompletions}/{stats.weeklyTarget} Wk
                                                            </span>
                                                        </div>
                                                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${stats.weeklyProgress}%` }}
                                                                className={`h-full rounded-full transition-all duration-500 ${stats.weeklyProgress >= ( (currentDate.getDay() + 1) / 7 * 100) ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                                            ></motion.div>
                                                        </div>
                                                        {stats.daysRemaining > 0 && stats.daysRemaining <= 2 && (
                                                            <p className="text-[9px] font-bold text-slate-400 animate-pulse">
                                                                {stats.daysRemaining} day{stats.daysRemaining > 1 ? 's' : ''} away from goal!
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Monthly Report Modal */}
            <AnimatePresence>
                {showReport && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            <div id="printable-report" className="p-8 space-y-8 overflow-y-auto">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-3xl font-black text-slate-800">Monthly Performance</h2>
                                        <p className="text-slate-500 font-bold">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })} Report</p>
                                    </div>
                                    <div className="text-right no-print">
                                        <button
                                            onClick={() => window.print()}
                                            className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                                        >
                                            <span className="material-symbols-rounded text-sm">print</span>
                                            Export to PDF
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="bg-indigo-50/50 p-6 rounded-3xl text-center">
                                        <p className="text-4xl font-black text-indigo-600 mb-1">{overallStats.avgRate}%</p>
                                        <p className="text-[10px] font-black uppercase text-indigo-400">Total Completion</p>
                                    </div>
                                    <div className="bg-emerald-50/50 p-6 rounded-3xl text-center">
                                        <p className="text-4xl font-black text-emerald-600 mb-1">{overallStats.totalCompletions}</p>
                                        <p className="text-[10px] font-black uppercase text-emerald-400">Days Active</p>
                                    </div>
                                    <div className="bg-orange-50/50 p-6 rounded-3xl text-center">
                                        <p className="text-4xl font-black text-orange-600 mb-1">{overallStats.bestStreak}</p>
                                        <p className="text-[10px] font-black uppercase text-orange-400">Longest Streak</p>
                                    </div>
                                    <div className="bg-rose-50/50 p-6 rounded-3xl text-center">
                                        <p className="text-4xl font-black text-rose-600 mb-1">{overallStats.totalMissed}</p>
                                        <p className="text-[10px] font-black uppercase text-rose-400">Missed Focus</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-xl font-black text-slate-800 border-b pb-2">Habit Breakdown & Growth</h3>
                                    {habits.map(h => {
                                        const s = calculateStats(h);
                                        // Preparation for individual sparkline
                                        const habitLogs = h.HabitLogs || [];
                                        const dailyStatus = daysArray.filter(d => d <= currentDate.getDate()).map(day => {
                                            const dStr = `${currentYear}-${padZero(currentMonth + 1)}-${padZero(day)}`;
                                            const log = habitLogs.find(l => l.date === dStr);
                                            return log && log.status ? 1 : 0;
                                        });

                                        const sparklineData = {
                                            labels: daysArray.filter(d => d <= currentDate.getDate()),
                                            datasets: [{
                                                data: dailyStatus,
                                                borderColor: s.completionRate > 70 ? '#10b981' : '#6366f1',
                                                borderWidth: 2,
                                                pointRadius: 0,
                                                tension: 0.4,
                                                fill: false
                                            }]
                                        };

                                        return (
                                            <div key={h.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-slate-50 rounded-3xl gap-4">
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center font-black text-indigo-600 border border-slate-100 text-sm">
                                                        {s.completionRate}%
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-800 text-lg">{h.habit_name}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{h.category}</p>
                                                    </div>
                                                </div>
                                                
                                                {/* Individual Growth Sparkline */}
                                                <div className="w-full md:w-32 h-12 no-print">
                                                    <Line 
                                                        data={sparklineData}
                                                        options={{
                                                            responsive: true,
                                                            maintainAspectRatio: false,
                                                            plugins: { legend: { display: false }, tooltip: { enabled: false } },
                                                            scales: { x: { display: false }, y: { display: false, min: 0, max: 1.2 } }
                                                        }}
                                                    />
                                                </div>

                                                <div className="text-right flex flex-col items-end">
                                                    <p className="font-black text-indigo-600 text-sm">🔥 {s.longestStreak} Day Streak</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Goal: {h.goal || 'Continuous'}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="bg-slate-900 text-white p-8 rounded-3xl">
                                    <h4 className="text-indigo-400 font-black uppercase tracking-widest text-xs mb-2">Mentor Insight</h4>
                                    <p className="text-lg font-medium leading-relaxed italic">
                                        "{overallStats.avgRate > 70
                                            ? "Your discipline is becoming your superpower. Maintain this momentum and you'll reach Mastery in no time."
                                            : "Small, consistent steps are better than big, inconsistent leaps. Focus on closing just one more circle tomorrow."}"
                                    </p>
                                </div>
                            </div>
                            <div className="p-6 bg-slate-50 border-t flex justify-center no-print">
                                <button
                                    onClick={() => setShowReport(false)}
                                    className="bg-slate-800 text-white px-8 py-3 rounded-2xl font-black hover:bg-slate-700 transition-all shadow-lg shadow-slate-200"
                                >
                                    Done Reviewing
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add Habit Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <h2 className="text-xl font-black text-slate-800">Start New Habit</h2>
                                <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-all">
                                    <span className="material-symbols-rounded">close</span>
                                </button>
                            </div>
                            <form onSubmit={handleAddHabit} className="p-6 space-y-5">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">What's the habit?</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Study 2 hours"
                                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 text-slate-700 font-bold outline-none"
                                        value={newHabit.habit_name}
                                        onChange={(e) => setNewHabit({ ...newHabit, habit_name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Category</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {categories.map(c => (
                                            <button
                                                key={c}
                                                type="button"
                                                onClick={() => setNewHabit({ ...newHabit, category: c })}
                                                className={`px-3 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${newHabit.category === c ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                            >
                                                {c.split(' ')[0]}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Start Date</label>
                                        <input
                                            type="date"
                                            required
                                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-slate-700 font-bold outline-none"
                                            value={newHabit.start_date}
                                            onChange={(e) => setNewHabit({ ...newHabit, start_date: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Weekly Target (Days)</label>
                                        <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl">
                                            <input
                                                type="range"
                                                min="1"
                                                max="7"
                                                className="flex-1 accent-indigo-600"
                                                value={newHabit.weekly_target}
                                                onChange={(e) => setNewHabit({ ...newHabit, weekly_target: parseInt(e.target.value) })}
                                            />
                                            <span className="font-black text-indigo-600 text-lg w-6">{newHabit.weekly_target}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Goal / Streak</label>
                                        <input
                                            type="text"
                                            placeholder="30 Days"
                                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-slate-700 font-bold outline-none"
                                            value={newHabit.goal}
                                            onChange={(e) => setNewHabit({ ...newHabit, goal: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="submit"
                                        className="btn-primary-gradient w-full py-4 rounded-2xl font-black text-lg shadow-lg shadow-indigo-200"
                                    >
                                        Activate Habit
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                    body { background: white !important; }
                    .card-premium { border: none !important; box-shadow: none !important; }
                    #printable-report { padding: 0 !important; width: 100% !important; height: auto !important; max-height: none !important; }
                }
            `}} />
        </div>
    );
};

export default HabitTracker;
