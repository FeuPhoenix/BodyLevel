import { useState } from 'react';
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
} from '@mui/material';
import { useAppDispatch } from '../../hooks';
import { login, register } from '../../features/auth/authSlice';

export const DevLogin = () => {
  const dispatch = useAppDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        // Login
        await dispatch(login({ email, password })).unwrap();
      } else {
        // Registration validation
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }

        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          return;
        }

        // Register
        await dispatch(register({ email, username, password })).unwrap();
        setShowSuccess(true);
        // Switch to login mode after successful registration
        setIsLogin(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
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

        {error && (
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
              required
            />
          )}
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {!isLogin && (
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 3 }}
          >
            {isLogin ? 'Login' : 'Register'}
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