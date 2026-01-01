
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export enum MentalEffort {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  password?: string; // Only used in mock DB
  createdAt: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  mentalEffort: MentalEffort;
  estimatedMinutes: number;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
