import { User, UserProfile } from '../types/user';

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  display_name?: string;
}

export interface LoginResponse {
  user: User;
  profile: UserProfile;
}

export interface UpdateProfileData {
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  theme_preference?: 'light' | 'dark';
}

// Helper function for API requests
async function apiRequest<T>(
  endpoint: string,
  method: string = 'GET',
  data?: any
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include' // Include cookies
  };
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'API request failed');
  }
  
  return await response.json();
}

// Auth API
export const authApi = {
  // Register a new user
  register: (data: RegisterData) => 
    apiRequest<{ user: User }>('/auth/register', 'POST', data),
  
  // Login user
  login: (credentials: LoginCredentials) => 
    apiRequest<LoginResponse>('/auth/login', 'POST', credentials),
  
  // Get current user
  getCurrentUser: () => 
    apiRequest<LoginResponse>('/auth/me'),
  
  // Update user profile
  updateProfile: (data: UpdateProfileData) => 
    apiRequest<{ profile: UserProfile }>('/auth/profile', 'PUT', data),
  
  // Logout user
  logout: () => 
    apiRequest<{ message: string }>('/auth/logout', 'POST')
};

// Skills API
export const skillsApi = {
  // Get all skills with user progress
  getSkills: () => 
    apiRequest<{ skills: any[] }>('/skills'),
  
  // Get skill progress
  getSkillProgress: (skillId: string) => 
    apiRequest<{ progress: any }>(`/skills/${skillId}/progress`),
  
  // Update skill progress
  updateSkillProgress: (skillId: string, data: { sets?: number, reps?: number }) => 
    apiRequest<{ progress: any }>(`/skills/${skillId}/progress`, 'PUT', data),
  
  // Get user total XP
  getTotalXP: () => 
    apiRequest<{ totalXP: number }>('/skills/xp'),
  
  // Get user level
  getLevel: () => 
    apiRequest<{ level: number }>('/skills/level')
};

export default {
  auth: authApi,
  skills: skillsApi
}; 