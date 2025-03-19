import { useNavigate } from 'react-router-dom';
import {
  Container,
  Avatar,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Divider,
} from '@mui/material';
import { Person } from '@mui/icons-material';
import { useAppDispatch } from '../../hooks';
import { setAuthenticated } from '../../features/auth/authSlice';

// Define user role type
type UserRole = 'user' | 'admin';
// Define theme preference type
type ThemePreference = 'light' | 'dark';

// Mock users for development
const DEFAULT_MOCK_USERS = [
  {
    id: 'user1',
    username: 'johndoe',
    email: 'john@example.com',
    role: 'user' as UserRole,
    status: 'active',
  },
  {
    id: 'admin1',
    username: 'adminuser',
    email: 'admin@example.com',
    role: 'admin' as UserRole,
    status: 'active',
  },
];

export const DevLogin = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Function to handle login with mock user
  const loginWithMockUser = (role: UserRole) => {
    // Find the mock user with the specified role
    const mockUser = DEFAULT_MOCK_USERS.find(user => user.role === role);
    
    if (mockUser) {
      // Create an auth object similar to what a real login would provide
      const authData = {
        user: {
          id: mockUser.id,
          username: mockUser.username,
          email: mockUser.email,
          role: mockUser.role,
          status: mockUser.status,
        },
        profile: {
          user_id: mockUser.id,
          display_name: mockUser.role === 'admin' ? 'Admin User' : 'John Doe',
          bio: 'This is a mock user for development testing.',
          theme_preference: 'light' as ThemePreference,
        },
      };
      
      // Save auth state to localStorage
      localStorage.setItem('authState', JSON.stringify(authData));
      
      // Update Redux state
      dispatch(setAuthenticated(authData));
      
      // Redirect based on role
      if (mockUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
          <Person fontSize="large" />
        </Avatar>
        <Typography component="h1" variant="h4" sx={{ mt: 2 }}>
          Development Login
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 1 }}>
          This is a simplified login for development purposes.
        </Typography>
        
        <Box sx={{ mt: 4, width: '100%' }}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Select a user type to continue:
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={() => loginWithMockUser('user')}
                    sx={{ py: 2 }}
                  >
                    Regular User
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={() => loginWithMockUser('admin')}
                    sx={{ py: 2 }}
                  >
                    Admin User
                  </Button>
                </Grid>
              </Grid>
              <Divider sx={{ my: 3 }} />
              <Typography variant="body2" color="text.secondary">
                Note: This simplified login is for development only. No actual authentication is performed.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
}; 