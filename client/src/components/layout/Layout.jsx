import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children, user, onLogout }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Close sidebar on route change on mobile
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [window.location.pathname]);

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                role={user?.role}
                onLogout={onLogout}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    user={user}
                />

                <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
