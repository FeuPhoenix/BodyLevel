import { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './features/store';
import { ThemeProvider } from './components/UI/ThemeProvider';
import { Layout } from './components/UI/Layout';
import { Home } from './components/Home';
import { DevLogin } from './components/Auth';
import { ProfileDashboard } from './components/Profile/ProfileDashboard';
import { SkillTreeVisualization } from './components/Skills/SkillTreeVisualization';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { useAuth } from './hooks/useAuth';
import { Box, CircularProgress, Typography, Button, Alert } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProfile } from './components/Auth/UserProfile';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        minHeight="70vh"
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading...
        </Typography>
      </Box>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Admin route component - requires admin role
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  
  // For development purposes, log the user object to debug
  console.log('AdminRoute - User:', user);
  console.log('AdminRoute - isAuthenticated:', isAuthenticated);
  
  // Check if user has admin role
  const isAdmin = user?.role === 'admin';
  
  if (isLoading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        minHeight="70vh"
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading...
        </Typography>
      </Box>
    );
  }
  
  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to home");
    return <Navigate to="/" replace />;
  }
  
  if (!isAdmin) {
    console.log("User is not an admin, redirecting to home");
    return <Navigate to="/" replace />;
  }
  
  // Render children only if user is an admin
  return <>{children}</>;
};

// Wrapper component that uses hooks
const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [serverError, setServerError] = useState(false);
  const [hasCheckedServer, setHasCheckedServer] = useState(false);
  const [isCheckingServer, setIsCheckingServer] = useState(false);

  // We'll only check the server when explicitly requested
  const checkServer = async () => {
    if (isCheckingServer) return;
    
    setIsCheckingServer(true);
    try {
      const response = await fetch('/api/health');
      if (!response.ok) {
        setServerError(true);
      } else {
        setServerError(false);
      }
    } catch (error) {
      console.error('Server check error:', error);
      setServerError(true);
    } finally {
      setHasCheckedServer(true);
      setIsCheckingServer(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <Layout>
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          minHeight="70vh"
        >
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading...
          </Typography>
        </Box>
      </Layout>
    );
  }

  // Show server error only if we've checked and found an error
  if (hasCheckedServer && serverError) {
    return (
      <Layout>
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          minHeight="70vh"
          maxWidth="600px"
          mx="auto"
          textAlign="center"
        >
          <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
            Cannot connect to the server. Please make sure the server is running.
          </Alert>
          <Typography variant="body1" paragraph>
            The application requires the server to be running on port 3001. 
            Please start the server using the command:
          </Typography>
          <Box 
            sx={{ 
              bgcolor: 'background.paper', 
              p: 2, 
              borderRadius: 1,
              fontFamily: 'monospace',
              mb: 3,
              width: '100%'
            }}
          >
            npm run server:dev
          </Box>
          <Button 
            variant="contained" 
            onClick={() => {
              setHasCheckedServer(false);
              checkServer();
            }}
          >
            Retry Connection
          </Button>
        </Box>
      </Layout>
    );
  }

  // Show the main app content with routing
  return (
    <Layout>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Home /> : <DevLogin />} />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfileDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/skills" 
          element={
            <ProtectedRoute>
              <SkillTreeVisualization />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />
        <Route path="/dev-login" element={<DevLogin />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <div className="App">
            <AppContent />
          </div>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
