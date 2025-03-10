import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
  Divider,
  Button,
  useTheme,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import { UserManagement } from './UserManagement';
import { SkillManagement } from './SkillManagement';
import { DashboardStats } from './DashboardStats';
import {
  PeopleAlt,
  FitnessCenterRounded,
  Dashboard,
  Settings,
  ArrowBack,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
      style={{ width: '100%' }}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `admin-tab-${index}`,
    'aria-controls': `admin-tabpanel-${index}`,
  };
}

export const AdminDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container 
      disableGutters={isMobile} 
      maxWidth="xl" 
      sx={{ 
        mt: 2, 
        mb: 8, 
        px: { xs: 0, sm: 2, md: 3 } 
      }}
    >
      <Paper 
        elevation={2} 
        sx={{ 
          p: { xs: 1, sm: 2, md: 3 }, 
          borderRadius: { xs: 0, sm: 2 },
          overflow: 'hidden',
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          gap: 2,
          mb: 3 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isMobile && (
              <IconButton 
                component={Link} 
                to="/" 
                color="primary"
                sx={{ mr: 1 }}
              >
                <ArrowBack />
              </IconButton>
            )}
            <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold">
              Admin Dashboard
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<Settings />}
            size={isMobile ? "small" : "medium"}
          >
            System Settings
          </Button>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        {/* Dashboard Overview */}
        <Box sx={{ 
          mb: 4, 
          overflow: 'auto',
          mx: -1, // Negative margin to compensate for the padding
          px: 1,  // Add padding back to maintain spacing
        }}>
          <DashboardStats />
        </Box>
        
        {/* Tabs */}
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="admin dashboard tabs"
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
            >
              <Tab 
                icon={<PeopleAlt />} 
                label={isMobile ? "" : "User Management"} 
                {...a11yProps(0)} 
                iconPosition="start"
              />
              <Tab 
                icon={<FitnessCenterRounded />} 
                label={isMobile ? "" : "Skill Management"} 
                {...a11yProps(1)} 
                iconPosition="start"
              />
              <Tab 
                icon={<Settings />} 
                label={isMobile ? "" : "System Settings"} 
                {...a11yProps(2)} 
                iconPosition="start"
              />
            </Tabs>
          </Box>
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ 
              overflow: 'auto',
              mx: isMobile ? -1 : 0, // Negative margin on mobile
              px: isMobile ? 1 : 0,  // Add padding back on mobile
            }}>
              <UserManagement />
            </Box>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ 
              overflow: 'auto',
              mx: isMobile ? -1 : 0, // Negative margin on mobile
              px: isMobile ? 1 : 0,  // Add padding back on mobile
            }}>
              <SkillManagement />
            </Box>
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6">System Settings</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                System settings and configuration options will be available here.
              </Typography>
            </Box>
          </TabPanel>
        </Box>
      </Paper>
    </Container>
  );
}; 