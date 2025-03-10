import React from 'react';
import { IconButton, Tooltip, Box } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { toggleThemeMode } from '../../features/theme/themeSlice';
import { motion } from 'framer-motion';

export const ThemeToggle: React.FC = () => {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(state => state.theme.theme.mode);
  const isDarkMode = themeMode === 'dark';
  
  const handleToggleTheme = () => {
    dispatch(toggleThemeMode());
  };
  
  return (
    <Tooltip title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}>
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Box
          sx={{
            bgcolor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.8)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
        >
          <IconButton 
            onClick={handleToggleTheme} 
            sx={{ 
              color: isDarkMode ? 'white' : 'white',
              p: 0.75
            }}
          >
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>
      </motion.div>
    </Tooltip>
  );
}; 