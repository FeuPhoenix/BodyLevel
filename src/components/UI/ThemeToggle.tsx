import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { toggleThemeMode } from '../../features/theme/themeSlice';

export const ThemeToggle: React.FC = () => {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(state => state.theme.theme.mode);
  
  const handleToggleTheme = () => {
    dispatch(toggleThemeMode());
  };
  
  return (
    <Tooltip title={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}>
      <IconButton onClick={handleToggleTheme} color="inherit">
        {themeMode === 'light' ? <Brightness4 /> : <Brightness7 />}
      </IconButton>
    </Tooltip>
  );
}; 