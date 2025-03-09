import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeConfig, ThemeMode } from '../../types';

const initialTheme: ThemeConfig = {
  mode: 'dark',
  primaryColor: '#6200EA',
  secondaryColor: '#00E676',
  backgroundColor: '#121212',
  textColor: '#FFFFFF',
  cardBackgroundColor: '#1E1E1E',
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