
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface LayoutProps {
  user: User | null;
  currentView: string;
  onViewChange: (view: any) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, currentView, onViewChange, onLogout, children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-productivity transition-colors duration-300">
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-8">
              {/* Brand Home Navigation */}
              <div 
                className="flex items-center cursor-pointer group select-none" 
                onClick={() => onViewChange(user ? 'dashboard' : 'auth')}
                title="Return to Home Screen"
              >
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40 group-hover:scale-110 group-active:scale-95 transition-all">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600">
                  ZenTask
                </span>
              </div>
              
              {user && (
                <nav className="hidden md:flex space-x-1">
                  <button 
                    onClick={() => onViewChange('dashboard')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${currentView === 'dashboard' ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                  >
                    Dashboard
                  </button>
                  {user.role === UserRole.ADMIN && (
                    <button 
                      onClick={() => onViewChange('admin')}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${currentView === 'admin' ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                    >
                      Admin
                    </button>
                  )}
                  <button 
                    onClick={() => onViewChange('docs')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${currentView === 'docs' ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                  >
                    API Docs
                  </button>
                </nav>
              )}
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m12.728 0A9 9 0 115.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                )}
              </button>

              <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700" />

              {user ? (
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none mb-1">@{user.username}</p>
                    <p className="text-[10px] text-indigo-500 uppercase tracking-widest font-black opacity-80">{user.role}</p>
                  </div>
                  <button 
                    onClick={onLogout}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-95 bg-white dark:bg-slate-800 shadow-sm"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => onViewChange('docs')}
                  className="px-4 py-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all"
                >
                  Developer Docs
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>

      <footer className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-10 mt-auto transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">
              ZenTask Platform
            </span>
          </div>
          <div className="flex space-x-8 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Infrastructure</a>
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Developer Portal</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
