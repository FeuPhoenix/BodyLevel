import { useSelector, useDispatch } from 'react-redux';
import { selectUser, selectAuth, logout } from '../../features/auth/authSlice';
import { AppDispatch } from '../../features/store';
import { Box, Typography, Button, Paper, Avatar, Divider, CircularProgress } from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';

export const UserProfile = () => {
  const { user, profile, isLoading } = useSelector(selectAuth);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout());
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 400, width: '100%', mx: 'auto' }}>
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar
          src={profile.avatar_url || undefined}
          sx={{ width: 64, height: 64, mr: 2 }}
        >
          <PersonIcon fontSize="large" />
        </Avatar>
        <Box>
          <Typography variant="h6">{profile.display_name || user.username}</Typography>
          <Typography variant="body2" color="text.secondary">
            @{user.username}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box mb={2}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Email
        </Typography>
        <Typography variant="body1">{user.email}</Typography>
      </Box>

      {profile.bio && (
        <Box mb={2}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Bio
          </Typography>
          <Typography variant="body1">{profile.bio}</Typography>
        </Box>
      )}

      <Button
        variant="outlined"
        color="primary"
        fullWidth
        onClick={handleLogout}
        sx={{ mt: 2 }}
      >
        Logout
      </Button>
    </Paper>
  );
}; 