import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('token');

            if (storedUser && token) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                
                // Fetch fresh data from server to sync XP/Streak
                try {
                    const res = await api.get('/me');
                    setUser(res.data);
                    localStorage.setItem('user', JSON.stringify(res.data));
                } catch (err) {
                    console.error("Failed to refresh user session", err);
                    if (err.response?.status === 401) logout();
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await api.post('/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setUser(res.data.user);
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Login failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const updateXP = (newTotal) => {
        setUser(prev => {
            if (!prev) return null;
            const updated = { ...prev, total_xp: newTotal };
            localStorage.setItem('user', JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, updateXP }}>
            {children}
        </AuthContext.Provider>
    );
};
