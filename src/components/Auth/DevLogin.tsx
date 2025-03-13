import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
} from '@mui/material';
import { useAppDispatch } from '../../hooks';
import { login } from '../../features/auth/authSlice';

export const DevLogin = () => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }));
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
          Developer Login
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Use this form to log in as a developer for testing purposes.
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 3 }}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
}; 