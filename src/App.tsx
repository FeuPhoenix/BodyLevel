import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './features/store';
import { Header } from './components/UI/Header';
import { Home } from './components/Home';
import { SkillTreeVisualization } from './components/Skills/SkillTreeVisualization';
import { ProfileDashboard } from './components/Profile/ProfileDashboard';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { DevLogin } from './components/Auth/DevLogin';
import { PrivateRoute } from './components/Auth/PrivateRoute';
import { AdminRoute } from './components/Auth/AdminRoute';
import { Box, CircularProgress, Typography, Button, Alert } from '@mui/material';
import { useAuth } from './hooks/useAuth';
import { useAppSelector } from './hooks';

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

  // Show server error only if we've checked and found an error
  if (hasCheckedServer && serverError) {
    return (
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
    );
  }

  // Show the main app content with routing
  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Home /> : <DevLogin />} />
      <Route 
        path="/profile" 
        element={
          <PrivateRoute>
            <ProfileDashboard />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/skills" 
        element={
          <PrivateRoute>
            <SkillTreeVisualization />
          </PrivateRoute>
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
  );
};

// Theme-enabled App wrapper
const ThemedApp = () => {
  const themeConfig = useAppSelector(state => state.theme.theme);
  
  // Create MUI theme based on Redux state
  const theme = createTheme({
    palette: {
      mode: themeConfig.mode,
      primary: {
        main: themeConfig.primaryColor,
      },
      secondary: {
        main: themeConfig.secondaryColor,
      },
      background: {
        default: themeConfig.backgroundColor,
        paper: themeConfig.cardBackgroundColor,
      },
      text: {
        primary: themeConfig.textColor,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: themeConfig.backgroundColor,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: themeConfig.primaryColor,
              borderRadius: '4px',
            },
          },
        },
      },
    },
  });
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Header />
          <AppContent />
        </div>
      </Router>
    </ThemeProvider>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ThemedApp />
    </Provider>
  );
}

export default App;
