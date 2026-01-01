
import React, { useState } from 'react';
import { authService } from '../services/authService';

interface AuthFormProps {
  type: 'login' | 'register';
  onSuccess: (user: any) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      if (type === 'login') {
        const res = await authService.login(email, password);
        if (res.success && res.data) {
          onSuccess(res.data.user);
        } else {
          setError(res.error || 'Login failed');
        }
      } else {
        const res = await authService.register(email, password, username);
        if (res.success) {
          setSuccessMsg('Registration successful! You can now login.');
          setEmail('');
          setUsername('');
          setPassword('');
        } else {
          setError(res.error || 'Registration failed');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 p-4 mb-4 rounded-r-lg">
          <p className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}
      {successMsg && (
        <div className="bg-green-50 dark:bg-green-950/30 border-l-4 border-green-500 p-4 mb-4 rounded-r-lg">
          <p className="text-sm font-medium text-green-700 dark:text-green-400">{successMsg}</p>
        </div>
      )}

      {type === 'register' && (
        <div className="space-y-1">
          <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Choose Username</label>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white dark:bg-slate-800 dark:text-white"
            placeholder="johndoe123"
            required
          />
        </div>
      )}
      
      <div className="space-y-1">
        <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white dark:bg-slate-800 dark:text-white"
          placeholder="user@example.com"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Password</label>
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white dark:bg-slate-800 dark:text-white"
          placeholder="••••••••"
          required
        />
      </div>

      <button 
        type="submit"
        disabled={isLoading}
        className="w-full bg-indigo-600 text-white font-black uppercase tracking-[0.2em] py-3.5 px-4 rounded-xl hover:bg-indigo-700 active:scale-[0.98] focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-900/50 transition-all disabled:opacity-50 flex items-center justify-center shadow-lg shadow-indigo-100 dark:shadow-none"
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          type === 'login' ? 'Continue to Dashboard' : 'Create My Account'
        )}
      </button>
    </form>
  );
};

export default AuthForm;
