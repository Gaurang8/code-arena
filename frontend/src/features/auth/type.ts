import { z } from 'zod';

export type UserRole = "ADMIN" | "LEARNER";
export interface AuthLoading {
    login: boolean;
    register: boolean;
    logout: boolean;
    me: boolean;
}

export interface AuthError {
    login: string | null;
    register: string | null;
    logout: string | null;
    me: string | null;
}

export interface AuthState {
    user: User | null;
    loading: AuthLoading;
    error: AuthError;
    isAuthenticated: boolean;
}

export interface User {
    id: number;
    username: string;
    email: string;
    role: UserRole;
}


// Login types
export interface LoginUserPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: User;
    tokens: {
        access: string;
        refresh: string;
    };
}

export const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

export type LoginFormData = z.infer<typeof loginSchema>;


// Register types
export interface RegisterUserPayload {
    username: string;
    email: string;
    password: string;
}

export const registerSchema = z.object({
    username: z.string().min(3, { message: 'Username must be at least 3 characters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;