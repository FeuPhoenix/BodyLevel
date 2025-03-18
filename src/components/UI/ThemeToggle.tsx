import React from 'react';
import { IconButton, Tooltip, useTheme, Box } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { toggleThemeMode } from '../../features/theme/themeSlice';

export const ThemeToggle: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const themeMode = useAppSelector(state => state.theme.theme.mode);
  const isDarkMode = themeMode === 'dark';
  
  const handleToggleTheme = () => {
    console.log('Toggling theme from', themeMode);
    dispatch(toggleThemeMode());
  };
  
  return (
    <Tooltip title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}>
      <IconButton 
        onClick={handleToggleTheme} 
        size="small"
        sx={{ 
          color: isDarkMode ? 'white' : 'black',
          bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
          borderRadius: '50%',
          p: 1,
          '&:hover': {
            bgcolor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
          }
        }}
      >
        {isDarkMode ? <Brightness7 fontSize="small" /> : <Brightness4 fontSize="small" />}
      </IconButton>
    </Tooltip>
  );
}; 