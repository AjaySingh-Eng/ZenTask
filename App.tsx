
import React, { useState, useEffect } from 'react';
import { User, UserRole } from './types';
import { authService } from './services/authService';
import Layout from './components/Layout';
import AuthForm from './components/AuthForm';
import TaskList from './components/TaskList';
import AdminPanel from './components/AdminPanel';
import DocViewer from './components/DocViewer';
import ZenFlow from './components/ZenFlow';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'auth' | 'dashboard' | 'admin' | 'docs' | 'zenflow'>('auth');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = authService.getCurrentSession();
    if (session) {
      setUser(session.user);
      setView('dashboard');
    }
    setIsLoading(false);
  }, []);

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    setView('dashboard');
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setView('auth');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Layout 
      user={user} 
      currentView={view} 
      onViewChange={setView} 
      onLogout={handleLogout}
    >
      {view === 'auth' && !user && (
        <div className="max-w-md mx-auto mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white dark:border-slate-800 transition-colors duration-300 glass-card">
            <div className="flex justify-center mb-6">
               <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-100 dark:shadow-none">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
               </div>
            </div>
            <h2 className="text-3xl font-black text-center mb-2 tracking-tight text-slate-900 dark:text-white">
              {isLogin ? 'ZenTask Login' : 'Join ZenTask'}
            </h2>
            <p className="text-center text-slate-400 dark:text-slate-500 text-sm font-medium mb-8">
              {isLogin ? 'Enter your credentials to continue' : 'Securely manage your productivity today'}
            </p>
            <AuthForm 
              type={isLogin ? 'login' : 'register'} 
              onSuccess={handleAuthSuccess} 
            />
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="w-full mt-6 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors uppercase tracking-widest"
            >
              {isLogin ? "New user? Create Account" : "Existing user? Login"}
            </button>
          </div>
        </div>
      )}

      {view === 'dashboard' && user && (
        <div className="max-w-4xl mx-auto py-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Active Tasks</h1>
              <p className="text-indigo-500 dark:text-indigo-400 font-bold mt-1 text-lg">
                Personal Workspace for <span className="underline decoration-indigo-200 dark:decoration-indigo-900 underline-offset-4 decoration-4">@{user.username}</span>
              </p>
            </div>
            <button 
              onClick={() => setView('zenflow')}
              className="group flex items-center bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-100 dark:shadow-none transition-all hover:bg-indigo-700 active:scale-95"
            >
              <span className="mr-3 animate-pulse">✨</span>
              Enter Zen Flow
            </button>
          </div>
          <TaskList userId={user.id} />
        </div>
      )}

      {view === 'zenflow' && user && (
        <ZenFlow userId={user.id} onExit={() => setView('dashboard')} />
      )}

      {view === 'admin' && user?.role === UserRole.ADMIN && (
        <div className="max-w-6xl mx-auto py-8">
          <div className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Admin Console</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Enterprise Management Hub</p>
          </div>
          <AdminPanel />
        </div>
      )}

      {view === 'docs' && (
        <div className="max-w-5xl mx-auto py-8">
          <DocViewer />
        </div>
      )}

      {view === 'admin' && user?.role !== UserRole.ADMIN && (
        <div className="text-center py-24 bg-white/50 dark:bg-slate-900/50 backdrop-blur rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-950/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Restricted Access</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium">Administrative privileges are required for this module.</p>
          <button 
            onClick={() => setView('dashboard')}
            className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-none"
          >
            Return to Dashboard
          </button>
        </div>
      )}
    </Layout>
  );
};

export default App;
