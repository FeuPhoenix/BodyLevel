import React from 'react';
import { useDispatch } from 'react-redux';
import { setAuthenticated } from '../../features/auth/authSlice';
import { Box, Button, Typography, Paper } from '@mui/material';

export const DevLogin = () => {
  const dispatch = useDispatch();

  const handleDevLogin = () => {
    // Create a mock user and profile for development
    const mockUser = {
      id: 'dev-user-id',
      email: 'dev@example.com',
      username: 'DevUser',
      role: 'admin' as const
    };

    const mockProfile = {
      user_id: 'dev-user-id',
      display_name: 'Development User',
      theme_preference: 'light' as const
    };

    // Dispatch the setAuthenticated action
    dispatch(setAuthenticated({ user: mockUser, profile: mockProfile }));
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '70vh' 
    }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h5" gutterBottom align="center">
          Development Login
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph align="center">
          This is a development-only login that bypasses the server authentication.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth 
          onClick={handleDevLogin}
          sx={{ mt: 2 }}
        >
          Login as Admin
        </Button>
      </Paper>
    </Box>
  );
}; 