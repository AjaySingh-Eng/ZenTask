
import React from 'react';

const DocViewer: React.FC = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Assignment Submission Quick-Links */}
      <section className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-3xl p-8 text-white shadow-2xl">
        <h2 className="text-2xl font-black mb-6 tracking-tight flex items-center">
          <span className="bg-white text-indigo-900 w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-sm">✓</span>
          Assignment Submission Overview
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Database Schema (JSON/B)</h3>
            <div className="space-y-3">
              <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                <p className="text-xs font-bold text-indigo-200 mb-1">Users Collection</p>
                <code className="text-[10px] block opacity-80">id, email, username, password_hash, role, createdAt</code>
              </div>
              <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                <p className="text-xs font-bold text-indigo-200 mb-1">Tasks Collection</p>
                <code className="text-[10px] block opacity-80">id, userId, title, description, mentalEffort, estimatedMinutes, completed, createdAt</code>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Scalability Architecture</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2"></span>
                <span><strong>Vertical:</strong> Node.js Cluster module for multi-core utilization.</span>
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2"></span>
                <span><strong>Horizontal:</strong> Stateless JWT allowing NGINX Load Balancing.</span>
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2"></span>
                <span><strong>Performance:</strong> Redis caching for frequently accessed Task lists.</span>
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2"></span>
                <span><strong>Decoupling:</strong> Message queue (RabbitMQ) for email/notifications.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center space-x-3 mb-8">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">API Ecosystem</h2>
            <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-1 rounded tracking-[0.2em] uppercase shadow-lg shadow-indigo-200 dark:shadow-none">v1.2.0</span>
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
          <div className="p-8 space-y-10">
            {/* Auth Endpoints */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center">
                    <span className="text-lg">🔐</span>
                </div>
                <h3 className="text-xl font-black text-slate-800 dark:text-slate-200 tracking-tight">Identity Management</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-slate-100 dark:border-slate-800 rounded-2xl p-6 bg-slate-50/30 dark:bg-slate-950/20 hover:border-indigo-200 transition-all">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="bg-emerald-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest">POST</span>
                    <code className="text-sm font-bold text-slate-700 dark:text-slate-300">/auth/register</code>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-medium leading-relaxed">Initialize new user accounts with automated password hashing and role assignment.</p>
                  <pre className="bg-white dark:bg-slate-800 p-4 rounded-xl text-[10px] text-indigo-600 dark:text-indigo-400 font-mono shadow-inner border border-slate-100 dark:border-slate-700 overflow-x-auto">{"{ \n  \"username\": \"string\", \n  \"email\": \"string\", \n  \"password\": \"string\" \n}"}</pre>
                </div>

                <div className="border border-slate-100 dark:border-slate-800 rounded-2xl p-6 bg-slate-50/30 dark:bg-slate-950/20 hover:border-indigo-200 transition-all">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="bg-emerald-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest">POST</span>
                    <code className="text-sm font-bold text-slate-700 dark:text-slate-300">/auth/login</code>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-medium leading-relaxed">Verify credentials and issue a time-bound JWT for session authorization.</p>
                  <pre className="bg-white dark:bg-slate-800 p-4 rounded-xl text-[10px] text-indigo-600 dark:text-indigo-400 font-mono shadow-inner border border-slate-100 dark:border-slate-700 overflow-x-auto">{"{ \n  \"token\": \"JWT_STRING\", \n  \"user\": { \"id\": \"...\", \"role\": \"...\" } \n}"}</pre>
                </div>
              </div>
            </div>

            {/* Task Endpoints */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/40 rounded-xl flex items-center justify-center">
                    <span className="text-lg">📋</span>
                </div>
                <h3 className="text-xl font-black text-slate-800 dark:text-slate-200 tracking-tight">Resource Management</h3>
              </div>
              
              <div className="space-y-4">
                <div className="border border-slate-100 dark:border-slate-800 rounded-2xl p-5 bg-slate-50/30 dark:bg-slate-950/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <span className="bg-blue-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest">GET</span>
                    <code className="text-sm font-bold text-slate-700 dark:text-slate-300">/api/v1/tasks</code>
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.2em] md:text-right">Authorization Required: Bearer Token</p>
                </div>
                
                <div className="border border-slate-100 dark:border-slate-800 rounded-2xl p-6 bg-slate-50/30 dark:bg-slate-950/20">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="bg-emerald-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest">POST</span>
                    <code className="text-sm font-bold text-slate-700 dark:text-slate-300">/api/v1/tasks</code>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6 items-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Persist new task entities in the cloud workspace. Metadata (Effort, Time) is required for Zen Flow compatibility.</p>
                    <pre className="bg-white dark:bg-slate-800 p-4 rounded-xl text-[10px] text-indigo-600 dark:text-indigo-400 font-mono shadow-inner border border-slate-100 dark:border-slate-700">{"{ \n  \"title\": \"str\", \n  \"mentalEffort\": \"LOW|MED|HIGH\", \n  \"estimatedMinutes\": 30 \n}"}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DocViewer;
