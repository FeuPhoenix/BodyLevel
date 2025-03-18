import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define theme types
export type ThemeMode = 'light' | 'dark';

export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  cardBackgroundColor: string;
  lockedColor: string;
  unlockedColor: string;
  inProgressColor: string;
  completedColor: string;
}

// Load theme from localStorage if available
const getSavedTheme = (): ThemeMode => {
  try {
    const savedTheme = localStorage.getItem('themeMode');
    return savedTheme === 'light' ? 'light' : 'dark';
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return 'dark'; // Default to dark if localStorage is not available
  }
};

const initialTheme: ThemeConfig = {
  mode: getSavedTheme(),
  primaryColor: '#6200EA',
  secondaryColor: '#00E676',
  backgroundColor: getSavedTheme() === 'light' ? '#F5F5F5' : '#121212',
  textColor: getSavedTheme() === 'light' ? '#212121' : '#FFFFFF',
  cardBackgroundColor: getSavedTheme() === 'light' ? '#FFFFFF' : '#1E1E1E',
  lockedColor: '#757575',
  unlockedColor: '#00E676',
  inProgressColor: '#FFAB00',
  completedColor: '#00B0FF',
};

const initialState = {
  theme: initialTheme,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleThemeMode: (state) => {
      const newMode: ThemeMode = state.theme.mode === 'light' ? 'dark' : 'light';
      
      // Save to localStorage
      try {
        localStorage.setItem('themeMode', newMode);
      } catch (error) {
        console.error('Error saving theme to localStorage:', error);
      }
      
      if (newMode === 'dark') {
        state.theme = {
          ...state.theme,
          mode: 'dark',
          backgroundColor: '#121212',
          textColor: '#FFFFFF',
          cardBackgroundColor: '#1E1E1E',
        };
      } else {
        state.theme = {
          ...state.theme,
          mode: 'light',
          backgroundColor: '#F5F5F5',
          textColor: '#212121',
          cardBackgroundColor: '#FFFFFF',
        };
      }
      
      console.log('Theme updated to:', newMode);
    },
    updateThemeColors: (state, action: PayloadAction<Partial<ThemeConfig>>) => {
      state.theme = {
        ...state.theme,
        ...action.payload,
      };
    },
  },
});

export const { toggleThemeMode, updateThemeColors } = themeSlice.actions;
export default themeSlice.reducer; 