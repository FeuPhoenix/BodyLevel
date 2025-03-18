import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Divider,
  Link,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { login, register, clearError } from '../../features/auth/authSlice';

export const DevLogin = () => {
  const dispatch = useAppDispatch();
  const { error, isLoading } = useAppSelector(state => state.auth);

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Clear validation errors when switching between login/register
  useEffect(() => {
    setValidationError('');
    dispatch(clearError());
  }, [isLogin, dispatch]);

  // Form validation
  const validateForm = () => {
    // Reset errors
    setValidationError('');
    
    // Email validation
    if (!email) {
      setValidationError('Email is required');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError('Please enter a valid email address');
      return false;
    }
    
    // Password validation
    if (!password) {
      setValidationError('Password is required');
      return false;
    }
    
    if (!isLogin) {
      // Username validation for registration
      if (!username) {
        setValidationError('Username is required');
        return false;
      }
      
      if (username.length < 3) {
        setValidationError('Username must be at least 3 characters');
        return false;
      }
      
      // Password length check
      if (password.length < 6) {
        setValidationError('Password must be at least 6 characters');
        return false;
      }
      
      // Password confirmation
      if (password !== confirmPassword) {
        setValidationError('Passwords do not match');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    try {
      if (isLogin) {
        // Login
        await dispatch(login({ email, password })).unwrap();
      } else {
        // Register
        await dispatch(register({ email, username, password })).unwrap();
        setShowSuccess(true);
        // Switch to login mode after successful registration
        setIsLogin(true);
      }
    } catch (err) {
      // Display the error message from the API or a generic error
      const errorMessage = err instanceof Error ? err.message : 
                          typeof err === 'string' ? err : 
                          'Authentication failed. Please try again.';
      
      // Display error on screen 
      setValidationError(errorMessage);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    // Clear form when switching modes
    if (!isLogin) {
      setUsername('');
      setConfirmPassword('');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 64px)',
        p: 2,
      }}
    >
      <Paper
        elevation={2}
        sx={{
          p: 4,
          maxWidth: 400,
          width: '100%',
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {isLogin ? 'Developer Login' : 'Create Account'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {isLogin 
            ? 'Use this form to log in as a developer for testing purposes.' 
            : 'Create a new account to start tracking your fitness progress.'}
        </Typography>

        {/* Display validation errors with priority */}
        {validationError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {validationError}
          </Alert>
        )}
        
        {/* Display Redux auth errors */}
        {!validationError && error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <TextField
              label="Username"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={!isLogin && !username && validationError === 'Username is required'}
              helperText={!isLogin && !username && validationError === 'Username is required' ? 'Username is required' : ''}
              required
              disabled={isLoading}
            />
          )}
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!email && validationError === 'Email is required'}
            helperText={!email && validationError === 'Email is required' ? 'Email is required' : ''}
            required
            disabled={isLoading}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!password && validationError === 'Password is required'}
            helperText={!password && validationError === 'Password is required' ? 'Password is required' : ''}
            required
            disabled={isLoading}
          />
          {!isLogin && (
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={password !== confirmPassword && validationError === 'Passwords do not match'}
              helperText={password !== confirmPassword && validationError === 'Passwords do not match' ? 'Passwords do not match' : ''}
              required
              disabled={isLoading}
            />
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 3 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              isLogin ? 'Login' : 'Register'
            )}
          </Button>
        </form>

        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </Typography>
          <Link
            component="button"
            variant="body2"
            onClick={toggleMode}
            sx={{ mt: 1, cursor: 'pointer' }}
            disabled={isLoading}
          >
            {isLogin ? 'Create Account' : 'Login'}
          </Link>
        </Box>

        <Snackbar
          open={showSuccess}
          autoHideDuration={6000}
          onClose={() => setShowSuccess(false)}
          message="Registration successful! You can now log in."
        />
      </Paper>
    </Box>
  );
}; 