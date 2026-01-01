
import { User, UserRole, Task, ApiResponse, MentalEffort } from '../types';

/**
 * MOCK DATABASE INITIALIZATION
 */
const INITIAL_USERS: User[] = [
  { id: '1', email: 'admin@system.com', username: 'admin_sys', password: 'password123', role: UserRole.ADMIN, createdAt: new Date().toISOString() },
  { id: '2', email: 'user@system.com', username: 'demo_user', password: 'password123', role: UserRole.USER, createdAt: new Date().toISOString() }
];

const getDB = (key: string) => JSON.parse(localStorage.getItem(`db_${key}`) || '[]');
const setDB = (key: string, data: any) => localStorage.setItem(`db_${key}`, JSON.stringify(data));

if (!localStorage.getItem('db_users')) setDB('users', INITIAL_USERS);
if (!localStorage.getItem('db_tasks')) setDB('tasks', []);

/**
 * SIMULATED REST API CONTROLLER
 */
export const mockBackend = {
  delay: (ms = 500) => new Promise(resolve => setTimeout(resolve, ms)),

  auth: {
    register: async (email: string, pass: string, username: string): Promise<ApiResponse<any>> => {
      await mockBackend.delay();
      const users = getDB('users');
      if (users.find((u: User) => u.email === email)) return { success: false, error: 'Email already exists' };
      if (users.find((u: User) => u.username === username)) return { success: false, error: 'Username already taken' };
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        username,
        password: pass,
        role: UserRole.USER,
        createdAt: new Date().toISOString()
      };
      setDB('users', [...users, newUser]);
      return { success: true, message: 'User registered successfully' };
    },

    login: async (email: string, pass: string): Promise<ApiResponse<{ token: string, user: User }>> => {
      await mockBackend.delay();
      const users = getDB('users');
      const user = users.find((u: User) => u.email === email && u.password === pass);
      if (!user) return { success: false, error: 'Invalid credentials' };
      const token = btoa(JSON.stringify({ id: user.id, role: user.role, exp: Date.now() + 3600000 }));
      const { password, ...safeUser } = user;
      return { success: true, data: { token, user: safeUser as User } };
    }
  },

  tasks: {
    getAll: async (userId: string): Promise<ApiResponse<Task[]>> => {
      await mockBackend.delay();
      const tasks = getDB('tasks');
      return { success: true, data: tasks.filter((t: Task) => t.userId === userId) };
    },

    create: async (userId: string, title: string, description: string, effort?: MentalEffort, minutes?: number): Promise<ApiResponse<Task>> => {
      await mockBackend.delay();
      const tasks = getDB('tasks');
      const newTask: Task = {
        id: Math.random().toString(36).substr(2, 9),
        userId,
        title,
        description,
        completed: false,
        mentalEffort: effort || MentalEffort.MEDIUM,
        estimatedMinutes: minutes || 30,
        createdAt: new Date().toISOString()
      };
      setDB('tasks', [newTask, ...tasks]);
      return { success: true, data: newTask };
    },

    update: async (taskId: string, updates: Partial<Task>): Promise<ApiResponse<Task>> => {
      await mockBackend.delay();
      const tasks = getDB('tasks');
      const index = tasks.findIndex((t: Task) => t.id === taskId);
      if (index === -1) return { success: false, error: 'Task not found' };
      tasks[index] = { ...tasks[index], ...updates };
      setDB('tasks', tasks);
      return { success: true, data: tasks[index] };
    },

    delete: async (taskId: string): Promise<ApiResponse<null>> => {
      await mockBackend.delay();
      const tasks = getDB('tasks');
      setDB('tasks', tasks.filter((t: Task) => t.id !== taskId));
      return { success: true };
    }
  },

  admin: {
    getAllUsers: async (adminId: string): Promise<ApiResponse<User[]>> => {
      await mockBackend.delay();
      const users = getDB('users');
      const admin = users.find((u: User) => u.id === adminId && u.role === UserRole.ADMIN);
      if (!admin) return { success: false, error: 'Forbidden' };
      return { success: true, data: users.map(({ password, ...u }: any) => u) };
    },
    
    getGlobalStats: async (): Promise<ApiResponse<any>> => {
      const users = getDB('users');
      const tasks = getDB('tasks');
      return { 
        success: true, 
        data: {
          totalUsers: users.length,
          totalTasks: tasks.length,
          completedTasks: tasks.filter((t: any) => t.completed).length
        } 
      };
    }
  }
};
