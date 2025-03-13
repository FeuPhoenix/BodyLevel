import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import { Settings } from '@mui/icons-material';
import { UserManagement } from './UserManagement';
import { SkillManagement } from './SkillManagement';
import { DashboardStats } from './DashboardStats';

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
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
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
  const [value, setValue] = useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ mt: 2, mb: 8 }}>
      <Paper elevation={2} sx={{ 
        p: 3, 
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">
            Admin Dashboard
          </Typography>
          <Tooltip title="System Settings">
            <IconButton>
              <Settings />
            </IconButton>
          </Tooltip>
        </Box>

        <DashboardStats />

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 4 }}>
          <Tabs value={value} onChange={handleChange} aria-label="admin tabs">
            <Tab label="User Management" {...a11yProps(0)} />
            <Tab label="Skill Management" {...a11yProps(1)} />
            <Tab label="System Settings" {...a11yProps(2)} />
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          <UserManagement />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <SkillManagement />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Typography>System Settings coming soon...</Typography>
        </TabPanel>
      </Paper>
    </Box>
  );
}; 