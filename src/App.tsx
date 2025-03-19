import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { PaletteMode } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './features/store';
import Header from './components/UI/Header';
import { Home } from './components/Home';
import { DevLogin } from './components/Auth/DevLogin';
// Import the components that exist, comment out the ones that don't
// import Login from './components/Auth/Login';
// import Register from './components/Auth/Register';
// import Dashboard from './components/Dashboard';
import { ProfileDashboard as Profile } from './components/Profile';
// import LearningPath from './components/LearningPath';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { PrivateRoute } from './components/Auth/PrivateRoute';
import { AdminRoute } from './components/Auth/AdminRoute';
// Import the Skills component
import { Skills } from './components/Skills';

function App() {
  const [mode, setMode] = useState<PaletteMode>('light');

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#2196f3',
      },
      secondary: {
        main: '#f50057',
      },
    },
  });

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Header toggleTheme={toggleTheme} mode={mode} />
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Comment out routes for components that don't exist yet */}
            {/* <Route path="/login" element={<Login />} /> */}
            {/* <Route path="/register" element={<Register />} /> */}
            <Route path="/dev-login" element={<DevLogin />} />
            
            {/* <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } /> */}
            
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            
            {/* Skills route */}
            <Route path="/skills" element={
              <PrivateRoute>
                <Skills />
              </PrivateRoute>
            } />
            
            {/* <Route path="/learning-path" element={
              <PrivateRoute>
                <LearningPath />
              </PrivateRoute>
            } /> */}
            
            <Route path="/admin/*" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
