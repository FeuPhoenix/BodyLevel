import { useState } from 'react';
import { Container, Box, Typography, Paper, Alert } from '@mui/material';
import { Login } from './Login';
import { Register } from './Register';
import { useAuth } from '../../hooks/useAuth';

export const AuthPage = () => {
  const [showLogin, setShowLogin] = useState(true);
  const { isAuthenticated, error } = useAuth();

  const handleSwitchToRegister = () => {
    setShowLogin(false);
  };

  const handleSwitchToLogin = () => {
    setShowLogin(true);
  };

  const handleRegisterSuccess = () => {
    // Switch to login after successful registration
    setShowLogin(true);
  };

  // If user is authenticated, show a success message
  if (isAuthenticated) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" component="h1" gutterBottom>
            You are logged in!
          </Typography>
          <Typography variant="body1">
            You can now access all features of BodyLevel.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          BodyLevel
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your calisthenics progress and level up your skills
        </Typography>
      </Box>

      {error && error.includes('Network error') && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {showLogin ? (
        <Login onSwitchToRegister={handleSwitchToRegister} />
      ) : (
        <Register onSwitchToLogin={handleSwitchToLogin} onRegisterSuccess={handleRegisterSuccess} />
      )}
    </Container>
  );
}; 