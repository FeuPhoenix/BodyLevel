import React from 'react';
import { Container, Box } from '@mui/material';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header toggleTheme={() => {}} mode="light" />
      <Container maxWidth="xl" sx={{ flex: 1, py: 3 }}>
        {children}
      </Container>
      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          textAlign: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
          mt: 'auto'
        }}
      >
        <Container maxWidth="lg">
          BodyLevel © {new Date().getFullYear()} - Calisthenics Skill Progression Platform
        </Container>
      </Box>
    </Box>
  );
}; 