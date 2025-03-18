import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  useTheme,
  Tabs,
  Tab,
  Button,
  TextField,
} from '@mui/material';
import {
  FitnessCenterRounded,
  EmojiEvents,
  TrendingUp,
  Psychology,
  Person,
  Edit,
  Save,
  Dashboard,
  Settings,
} from '@mui/icons-material';
import { useAppSelector } from '../../hooks';

// Interface for TabPanel props
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// TabPanel component
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Helper function for a11y props
function a11yProps(index: number) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`,
  };
}

export const ProfileDashboard = () => {
  const theme = useTheme();
  const { user, profile } = useAppSelector((state) => state.auth);
  const skills = useAppSelector((state) => state.skills.skills);
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: profile?.bio || '',
  });

  // Calculate statistics
  const completedSkills = skills.filter((skill) => skill.status === 'completed');
  const inProgressSkills = skills.filter((skill) => skill.status === 'in-progress');
  const totalXP = completedSkills.reduce((total, skill) => total + skill.level * 100, 0);
  const level = Math.floor(totalXP / 500) + 1;
  const xpToNextLevel = (level * 500) - totalXP;
  const progressToNextLevel = ((totalXP % 500) / 500) * 100;

  // Tab change handler
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Form change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update logic
    setIsEditing(false);
  };

  return (
    <Box sx={{ mt: 2, mb: 8 }}>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">
            User Profile
          </Typography>
          {tabValue === 1 && (
            <Button
              variant="outlined"
              startIcon={isEditing ? <Save /> : <Edit />}
              onClick={() => isEditing ? handleSubmit : setIsEditing(true)}
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </Button>
          )}
        </Box>

        {/* User info card - visible in both tabs */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: theme.palette.primary.main,
              fontSize: '2.5rem',
              mr: 3,
            }}
          >
            {user?.username?.[0] || <Person />}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {user?.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
            <Typography variant="body1">
              Level {level} Athlete
            </Typography>
            <Box sx={{ width: 200, mt: 1 }}>
              <LinearProgress
                variant="determinate"
                value={progressToNextLevel}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'background.paper',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                  },
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {totalXP % 500} / 500 XP to Level {level + 1}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Tabs for Dashboard and Settings */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs">
            <Tab icon={<Dashboard fontSize="small" />} label="Overview" {...a11yProps(0)} />
            <Tab icon={<Settings fontSize="small" />} label="Profile Settings" {...a11yProps(1)} />
          </Tabs>
        </Box>

        {/* Dashboard Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card elevation={0} sx={{ bgcolor: 'background.default', borderRadius: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            bgcolor: 'primary.light',
                            color: 'primary.main',
                            mr: 2,
                          }}
                        >
                          <EmojiEvents />
                        </Box>
                        <Typography variant="h6" fontWeight="bold">
                          Total XP
                        </Typography>
                      </Box>
                      <Typography variant="h4" fontWeight="bold">
                        {totalXP}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {xpToNextLevel} XP to next level
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card elevation={0} sx={{ bgcolor: 'background.default', borderRadius: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            bgcolor: 'secondary.light',
                            color: 'secondary.main',
                            mr: 2,
                          }}
                        >
                          <FitnessCenterRounded />
                        </Box>
                        <Typography variant="h6" fontWeight="bold">
                          Skills
                        </Typography>
                      </Box>
                      <Typography variant="h4" fontWeight="bold">
                        {skills.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {completedSkills.length} completed, {inProgressSkills.length} in progress
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card elevation={0} sx={{ bgcolor: 'background.default', borderRadius: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            bgcolor: 'warning.light',
                            color: 'warning.main',
                            mr: 2,
                          }}
                        >
                          <Psychology />
                        </Box>
                        <Typography variant="h6" fontWeight="bold">
                          In Progress
                        </Typography>
                      </Box>
                      <Typography variant="h4" fontWeight="bold">
                        {inProgressSkills.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active skills being learned
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card elevation={0} sx={{ bgcolor: 'background.default', borderRadius: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            bgcolor: 'success.light',
                            color: 'success.main',
                            mr: 2,
                          }}
                        >
                          <TrendingUp />
                        </Box>
                        <Typography variant="h6" fontWeight="bold">
                          Completed
                        </Typography>
                      </Box>
                      <Typography variant="h4" fontWeight="bold">
                        {completedSkills.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Skills mastered
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Settings Tab */}
        <TabPanel value={tabValue} index={1}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Username"
                  name="username"
                  fullWidth
                  value={formData.username}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  fullWidth
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Bio"
                  name="bio"
                  multiline
                  rows={4}
                  fullWidth
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Tell us about yourself..."
                />
              </Grid>
            </Grid>
          </form>
        </TabPanel>
      </Paper>
    </Box>
  );
}; 