import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks';
import { login } from '../../features/auth/authSlice';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Avatar,
  Divider,
  Link,
  FormControlLabel,
  Checkbox,
  Alert,
  Collapse,
  IconButton,
  Snackbar
} from '@mui/material';
import { LockOutlined, CloseOutlined, FitnessCenterRounded } from '@mui/icons-material';

// Default mock users that are always available
const DEFAULT_MOCK_USERS = [
  { email: 'user@example.com', password: 'password', username: 'JohnDoe', role: 'user' },
  { email: 'admin@example.com', password: 'admin123', username: 'AdminUser', role: 'admin' },
];

export const DevLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [mockUsers, setMockUsers] = useState(DEFAULT_MOCK_USERS);
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  // Load registered users from localStorage on component mount
  useEffect(() => {
    try {
      const savedUsers = localStorage.getItem('registeredUsers');
      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers);
        setMockUsers([...DEFAULT_MOCK_USERS, ...parsedUsers]);
      }
      console.log('Loaded users:', mockUsers);
    } catch (error) {
      console.error('Error loading users from localStorage:', error);
    }
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError(''); // Clear any previous errors
    
    try {
      if (isLogin) {
        // Login mode - check against mock users
        const user = mockUsers.find(
          u => u.email === email && u.password === password
        );
        
        if (!user) {
          // Incorrect credentials - show error
          throw new Error('Invalid email or password');
        }
        
        // Successful login
        await dispatch(login({ 
          email, 
          password,
          username: user.username,
          role: user.role
        })).unwrap();
        
        // Store in localStorage if "Remember me" is checked
        if (rememberMe) {
          localStorage.setItem('currentUser', JSON.stringify({
            email,
            username: user.username,
            role: user.role
          }));
        }
        
        navigate('/');
      } else {
        // Register mode - simulate successful registration
        if (!username || username.length < 3) {
          throw new Error('Username must be at least 3 characters');
        }
        
        if (!email || !email.includes('@')) {
          throw new Error('Please enter a valid email address');
        }
        
        if (!password || password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        
        // Check if email already exists
        const existingUser = mockUsers.find(u => u.email === email);
        if (existingUser) {
          throw new Error('An account with this email already exists');
        }
        
        // Create new user
        const newUser = {
          email,
          password,
          username,
          role: 'user' // Default role for new users
        };
        
        // Add to mock users
        const updatedUsers = [...mockUsers, newUser];
        setMockUsers(updatedUsers);
        
        // Save to localStorage
        try {
          const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
          existingUsers.push(newUser);
          localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
          console.log('Successfully registered user:', newUser);
        } catch (error) {
          console.error('Error saving user to localStorage:', error);
        }
        
        // Show success message
        setRegistrationSuccess(true);
        
        // Clear form and switch to login
        setEmail('');
        setPassword('');
        setUsername('');
        setIsLogin(true);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setLoginError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };
  
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setLoginError(''); // Clear errors when switching modes
  };
  
  const loginWithMockUser = async (role: 'user' | 'admin') => {
    setLoading(true);
    setLoginError(''); // Clear any previous errors
    
    try {
      const mockUser = DEFAULT_MOCK_USERS.find(user => user.role === role);
      
      if (mockUser) {
        console.log('Quick login with:', mockUser);
        
        // Dispatch login action with mock user credentials
        await dispatch(login({ 
          email: mockUser.email,
          password: mockUser.password,
          username: mockUser.username,
          role: mockUser.role
        })).unwrap();
        
        // Navigate to home page
        navigate('/');
      } else {
        throw new Error('Mock user not found');
      }
    } catch (error) {
      console.error('Quick login error:', error);
      setLoginError('Quick login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 64px)',
        py: 4,
        px: 2,
        backgroundColor: theme => theme.palette.background.default
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={4}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
            bgcolor: 'background.paper',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
            <FitnessCenterRounded fontSize="large" />
          </Avatar>
          
          <Typography component="h1" variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
            {isLogin ? 'Sign In to BodyLevel' : 'Create Account'}
          </Typography>
          
          {/* Error message */}
          <Collapse in={!!loginError} sx={{ width: '100%', mb: 2 }}>
            <Alert 
              severity="error"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => setLoginError('')}
                >
                  <CloseOutlined fontSize="inherit" />
                </IconButton>
              }
            >
              {loginError}
            </Alert>
          </Collapse>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            {!isLogin && (
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                variant="outlined"
                sx={{ mb: 2 }}
              />
            )}
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!loginError}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!loginError}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            
            {isLogin && (
              <FormControlLabel
                control={
                  <Checkbox 
                    value="remember" 
                    color="primary" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                }
                label="Remember me"
                sx={{ mb: 2 }}
              />
            )}
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ 
                py: 1.5,
                mb: 2,
                borderRadius: 2,
                fontWeight: 'bold',
              }}
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            </Button>
            
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Link 
                component="button" 
                type="button" 
                variant="body2" 
                onClick={toggleMode}
                sx={{ cursor: 'pointer' }}
              >
                {isLogin 
                  ? "Don't have an account? Sign Up" 
                  : "Already have an account? Sign In"}
              </Link>
            </Box>
            
            {isLogin && (
              <>
                <Divider sx={{ my: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Quick Dev Login
                  </Typography>
                </Divider>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => loginWithMockUser('user')}
                      disabled={loading}
                      sx={{ borderRadius: 2 }}
                    >
                      Regular User
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => loginWithMockUser('admin')}
                      disabled={loading}
                      sx={{ borderRadius: 2 }}
                    >
                      Admin User
                    </Button>
                  </Grid>
                </Grid>
              </>
            )}
          </Box>
        </Paper>
      </Container>
      
      {/* Registration success message */}
      <Snackbar
        open={registrationSuccess}
        autoHideDuration={6000}
        onClose={() => setRegistrationSuccess(false)}
        message="Registration successful! You can now log in."
      />
    </Box>
  );
}; 