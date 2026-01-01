
import { User, AuthResponse } from '../types';
import { mockBackend } from './mockBackend';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const authService = {
  login: async (email: string, pass: string) => {
    const res = await mockBackend.auth.login(email, pass);
    if (res.success && res.data) {
      localStorage.setItem(TOKEN_KEY, res.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
    }
    return res;
  },

  register: async (email: string, pass: string, username: string) => {
    return await mockBackend.auth.register(email, pass, username);
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getCurrentSession: (): { user: User, token: string } | null => {
    const token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);
    if (!token || !userStr) return null;
    return { token, user: JSON.parse(userStr) };
  }
};
