import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Types
export interface User {
  id: string;
  email: string;
  username: string;
  role: 'user' | 'admin';
}

export interface UserProfile {
  user_id: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  theme_preference: 'light' | 'dark';
}

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Helper functions for localStorage
const loadAuthState = (): Partial<AuthState> => {
  try {
    const serializedState = localStorage.getItem('authState');
    if (serializedState === null) {
      return {};
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading auth state from localStorage:', err);
    return {};
  }
};

const saveAuthState = (state: AuthState) => {
  try {
    const serializedState = JSON.stringify({
      user: state.user,
      profile: state.profile,
      isAuthenticated: state.isAuthenticated
    });
    localStorage.setItem('authState', serializedState);
  } catch (err) {
    console.error('Error saving auth state to localStorage:', err);
  }
};

// Load saved state from localStorage
const savedState = loadAuthState();

// Initial state with localStorage values if available
const initialState: AuthState = {
  user: savedState.user || null,
  profile: savedState.profile || null,
  isAuthenticated: savedState.isAuthenticated || false,
  isLoading: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (
    { email, password, username, role }: 
    { email: string; password: string; username?: string; role?: 'user' | 'admin' },
    { rejectWithValue }
  ) => {
    try {
      // For development: Check if running in development environment
      if (import.meta.env.DEV) {
        console.log('Using mock authentication in development mode');
        
        // Generate a random user ID if not existing
        const userId = `user_${Math.random().toString(36).substring(2, 10)}`;
        
        // Create a user object with all provided data
        const userData = {
          id: userId,
          email,
          username: username || email.split('@')[0],
          role: role || 'user'
        };
        
        // Create a mock response
        const result = {
          user: userData,
          profile: {
            user_id: userData.id,
            display_name: userData.username,
            theme_preference: 'light'
          }
        };
        
        console.log('Mock login successful, returning user data:', result);
        
        // Save to localStorage immediately to ensure it's available
        const updatedState = {
          user: result.user,
          profile: result.profile,
          isAuthenticated: true
        };
        localStorage.setItem('authState', JSON.stringify(updatedState));
        
        return result;
      }
      
      // Production: Use actual API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      try {
        const data = await response.json();
        
        if (!response.ok) {
          return rejectWithValue(data.error || 'Login failed');
        }

        return data;
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        return rejectWithValue('Error processing server response');
      }
    } catch (error) {
      console.error('Login error:', error);
      return rejectWithValue('Network error. Please check if the server is running.');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (
    {
      email,
      username,
      password,
      display_name,
    }: { email: string; username: string; password: string; display_name?: string },
    { rejectWithValue }
  ) => {
    try {
      // For development: Check if running in development environment
      if (import.meta.env.DEV) {
        console.log('Using mock registration in development mode');
        
        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
        
        if (users.some((u: any) => u.email === email)) {
          return rejectWithValue('Email already in use');
        }
        
        // Create a new user
        const newUser = {
          id: `user_${Date.now()}`,
          email,
          username,
          password, // In a real app, we would hash this
          role: users.length === 0 ? 'admin' : 'user' // First user is admin
        };
        
        // Save to localStorage
        localStorage.setItem('mockUsers', JSON.stringify([...users, newUser]));
        
        // Don't return the password in the response
        const { password: _, ...userData } = newUser;
        
        const result = {
          user: userData,
          profile: {
            user_id: userData.id,
            display_name: display_name || username,
            theme_preference: 'light'
          }
        };
        
        console.log('Mock registration successful, returning:', result);
        return result;
      }
      
      // Production: Use actual API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password, display_name }),
        credentials: 'include',
      });

      try {
        const data = await response.json();
        
        if (!response.ok) {
          return rejectWithValue(data.error || 'Registration failed');
        }

        return data;
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        return rejectWithValue('Error processing server response');
      }
    } catch (error) {
      console.error('Registration error:', error);
      return rejectWithValue('Network error. Please check if the server is running.');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    // For development: Check if running in development environment
    if (import.meta.env.DEV) {
      console.log('Using mock logout in development mode');
      return { success: true };
    }
    
    // Production: Use actual API
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    try {
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.error || 'Logout failed');
      }

      return data;
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      return rejectWithValue('Error processing server response');
    }
  } catch (error) {
    console.error('Logout error:', error);
    return rejectWithValue('Network error. Please check if the server is running.');
  }
});

export const getCurrentUser = createAsyncThunk('auth/getCurrentUser', async (_, { rejectWithValue, getState }) => {
  try {
    // Instead of using localStorage, we'll use a simple in-memory approach
    // to avoid excessive API calls
    const state = getState() as RootState;
    
    // If we're already authenticated, don't check again
    if (state.auth.isAuthenticated && state.auth.user) {
      return { user: state.auth.user, profile: state.auth.profile };
    }
    
    // For development: Check if running in development environment
    if (import.meta.env.DEV) {
      console.log('Using mock getCurrentUser in development mode');
      
      // Get authentication state from localStorage
      const authState = loadAuthState();
      console.log('Current auth state from localStorage:', authState);
      
      if (authState.user && authState.isAuthenticated) {
        console.log('User is authenticated:', authState.user);
        return { 
          user: authState.user, 
          profile: authState.profile || {
            user_id: authState.user.id,
            display_name: authState.user.username,
            theme_preference: 'light'
          } 
        };
      }
      
      console.log('User is not authenticated');
      return null;
    }
    
    // Use a custom fetch that doesn't log 401 errors to console
    const silentFetch = async (url: string, options: RequestInit = {}) => {
      try {
        const response = await fetch(url, options);
        if (response.status === 401) {
          // Return a fake response for 401 errors to avoid console errors
          return {
            ok: false,
            status: 401,
            json: async () => ({ authenticated: false })
          } as Response;
        }
        return response;
      } catch (error) {
        console.error('Fetch error:', error);
        throw error;
      }
    };
    
    const response = await silentFetch('/api/auth/me', {
      credentials: 'include',
    });

    if (response.status === 401) {
      // Not authenticated, but not an error - don't log to console
      return null;
    }

    try {
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to get user');
      }

      return data;
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      return rejectWithValue('Error processing server response');
    }
  } catch (error) {
    console.error('Get current user error:', error);
    return rejectWithValue('Network error. Please check if the server is running.');
  }
});

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Add a manual login action for development
    setAuthenticated: (state, action: PayloadAction<{ user: User; profile: UserProfile }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.profile = action.payload.profile;
      saveAuthState(state);
    },
    // Add a manual logout action
    clearAuthentication: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.profile = null;
      localStorage.removeItem('authState');
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ user: User; profile: UserProfile }>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.profile = action.payload.profile;
        state.error = null;
        
        // Ensure auth state is saved properly
        console.log('Login successful, saving auth state:', action.payload);
        saveAuthState(state);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        console.log('Login rejected:', action.payload);
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // In development mode, automatically log in after registration
        if (import.meta.env.DEV && action.payload) {
          console.log('Registration successful in dev mode, auto-logging in:', action.payload);
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.profile = action.payload.profile;
          saveAuthState(state);
        }
        
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        console.log('Registration rejected:', action.payload);
      });

    // Logout
    builder
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.profile = null;
        state.error = null;
        localStorage.removeItem('authState');
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get current user
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.profile = action.payload.profile;
          saveAuthState(state);
        } else {
          state.isAuthenticated = false;
          state.user = null;
          state.profile = null;
          localStorage.removeItem('authState');
        }
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.profile = null;
        state.error = action.payload as string;
        localStorage.removeItem('authState');
      });
  },
});

export const { clearError, setAuthenticated, clearAuthentication } = authSlice.actions;

// Selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer; 