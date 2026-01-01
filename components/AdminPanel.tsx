
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { mockBackend } from '../services/mockBackend';
import { authService } from '../services/authService';

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const session = authService.getCurrentSession();
      if (!session) return;

      const [usersRes, statsRes] = await Promise.all([
        mockBackend.admin.getAllUsers(session.user.id),
        mockBackend.admin.getGlobalStats()
      ]);

      if (usersRes.success && usersRes.data) setUsers(usersRes.data);
      if (statsRes.success && statsRes.data) setStats(statsRes.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="text-center py-20 flex flex-col items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
      <p className="text-slate-500 dark:text-slate-400 font-medium">Authorizing secure administrative session...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Total Network Users</p>
          <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{stats?.totalUsers || 0}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Global Task Count</p>
          <p className="text-3xl font-black text-violet-600 dark:text-violet-400">{stats?.totalTasks || 0}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Efficiency Metric</p>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {stats?.totalTasks ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-800 dark:text-slate-200 tracking-tight">User Directory</h2>
          <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
            {users.length} Records
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/50 text-slate-400 dark:text-slate-500 text-[10px] uppercase font-black tracking-widest">
                <th className="px-6 py-4">Internal ID</th>
                <th className="px-6 py-4">Account Email</th>
                <th className="px-6 py-4">Access Level</th>
                <th className="px-6 py-4">Registration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4 font-mono text-xs text-slate-400 dark:text-slate-600 group-hover:text-indigo-500 transition-colors">{user.id}</td>
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-300">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      user.role === UserRole.ADMIN ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-500'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-medium">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
