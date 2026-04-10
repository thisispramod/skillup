import React from 'react';

const Navbar = ({ toggleSidebar, user }) => {
    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-4 lg:px-8">
            <div className="h-full max-w-7xl mx-auto flex items-center justify-between">
                {/* Left Side: Mobile Toggle & Page Title */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 -ml-2 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden"
                    >
                        <span className="material-symbols-rounded">menu</span>
                    </button>
                    <div className="hidden lg:block">
                        <h1 className="text-xl font-bold text-slate-800">Welcome Back, {user?.name || 'User'}</h1>
                        <p className="text-sm text-slate-500">Track your progress and keep learning.</p>
                    </div>
                </div>

                {/* Right Side: Actions */}
                <div className="flex items-center gap-2 lg:gap-4">
                    <button className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors relative">
                        <span className="material-symbols-rounded">notifications</span>
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary-500 rounded-full border-2 border-white"></span>
                    </button>

                    <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden sm:block"></div>

                    <div className="flex items-center gap-3 pl-2 cursor-pointer group">
                        <div className="hidden sm:block text-right">
                            <p className="text-sm font-bold text-slate-800 leading-tight group-hover:text-primary-600 transition-colors">
                                {user?.name || 'Profile'}
                            </p>
                            <p className="text-xs text-slate-500 capitalize">{user?.role || 'Member'}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-slate-400 group-hover:border-primary-200 transition-all">
                            {user?.avatar ? (
                                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span className="material-symbols-rounded">person</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
