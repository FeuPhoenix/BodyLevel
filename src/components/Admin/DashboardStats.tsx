import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  useTheme,
  LinearProgress,
  useMediaQuery,
} from '@mui/material';
import {
  PeopleAlt,
  FitnessCenterRounded,
  TrendingUp,
  AccessTime,
  PersonAdd,
  EmojiEvents,
} from '@mui/icons-material';

export const DashboardStats = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Mock data - in a real app, this would come from an API
  const stats = {
    totalUsers: 1248,
    activeUsers: 876,
    newUsersToday: 24,
    totalSkills: 48,
    completedSkills: 3642,
    averageUserLevel: 8.3,
    topCategories: [
      { name: 'Push', count: 42, percentage: 42 },
      { name: 'Pull', count: 28, percentage: 28 },
      { name: 'Legs', count: 18, percentage: 18 },
      { name: 'Core', count: 12, percentage: 12 },
    ],
    userActivity: {
      today: 246,
      yesterday: 198,
      thisWeek: 1245,
      lastWeek: 1102,
    },
  };

  // Category colors
  const categoryColors = {
    Push: '#f44336', // Red
    Pull: '#2196f3', // Blue
    Legs: '#4caf50', // Green
    Core: '#ff9800', // Orange
  };

  return (
    <Grid container spacing={isMobile ? 1 : 3}>
      {/* User Stats */}
      <Grid item xs={12} sm={6} md={3}>
        <Paper
          elevation={0}
          sx={{
            p: isMobile ? 1.5 : 2,
            borderRadius: 2,
            bgcolor: theme.palette.primary.main,
            color: 'white',
            height: '100%',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PeopleAlt sx={{ mr: 1 }} />
            <Typography variant="h6" fontWeight="bold">
              Users
            </Typography>
          </Box>
          <Typography variant={isMobile ? "h4" : "h3"} fontWeight="bold">
            {stats.totalUsers}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <PersonAdd fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="body2">
              +{stats.newUsersToday} today
            </Typography>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              Active Users: {stats.activeUsers} ({Math.round((stats.activeUsers / stats.totalUsers) * 100)}%)
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(stats.activeUsers / stats.totalUsers) * 100}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: 'rgba(255,255,255,0.2)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: 'white',
                },
              }}
            />
          </Box>
        </Paper>
      </Grid>

      {/* Skill Stats */}
      <Grid item xs={12} sm={6} md={3}>
        <Paper
          elevation={0}
          sx={{
            p: isMobile ? 1.5 : 2,
            borderRadius: 2,
            bgcolor: theme.palette.secondary.main,
            color: 'white',
            height: '100%',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FitnessCenterRounded sx={{ mr: 1 }} />
            <Typography variant="h6" fontWeight="bold">
              Skills
            </Typography>
          </Box>
          <Typography variant={isMobile ? "h4" : "h3"} fontWeight="bold">
            {stats.totalSkills}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <EmojiEvents fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="body2">
              {stats.completedSkills} completions
            </Typography>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              Avg. User Level: {stats.averageUserLevel}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(stats.averageUserLevel / 20) * 100} // Assuming max level is 20
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: 'rgba(255,255,255,0.2)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: 'white',
                },
              }}
            />
          </Box>
        </Paper>
      </Grid>

      {/* Category Distribution */}
      <Grid item xs={12} sm={6} md={3}>
        <Paper
          elevation={0}
          sx={{
            p: isMobile ? 1.5 : 2,
            borderRadius: 2,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
            height: '100%',
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TrendingUp sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="h6" fontWeight="bold">
              Categories
            </Typography>
          </Box>
          
          {stats.topCategories.map((category) => (
            <Box key={category.name} sx={{ mb: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">
                  {category.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {category.percentage}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={category.percentage}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: categoryColors[category.name as keyof typeof categoryColors],
                  },
                }}
              />
            </Box>
          ))}
        </Paper>
      </Grid>

      {/* User Activity */}
      <Grid item xs={12} sm={6} md={3}>
        <Paper
          elevation={0}
          sx={{
            p: isMobile ? 1.5 : 2,
            borderRadius: 2,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
            height: '100%',
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AccessTime sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="h6" fontWeight="bold">
              Activity
            </Typography>
          </Box>
          
          <Grid container spacing={isMobile ? 1 : 2}>
            <Grid item xs={6}>
              <Paper
                elevation={0}
                sx={{
                  p: isMobile ? 1 : 1.5,
                  borderRadius: 2,
                  bgcolor: theme.palette.primary.light,
                  color: theme.palette.primary.contrastText,
                  textAlign: 'center',
                }}
              >
                <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold">
                  {stats.userActivity.today}
                </Typography>
                <Typography variant="body2">Today</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper
                elevation={0}
                sx={{
                  p: isMobile ? 1 : 1.5,
                  borderRadius: 2,
                  bgcolor: theme.palette.secondary.light,
                  color: theme.palette.secondary.contrastText,
                  textAlign: 'center',
                }}
              >
                <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold">
                  {stats.userActivity.yesterday}
                </Typography>
                <Typography variant="body2">Yesterday</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper
                elevation={0}
                sx={{
                  p: isMobile ? 1 : 1.5,
                  borderRadius: 2,
                  bgcolor: theme.palette.success.light,
                  color: theme.palette.success.contrastText,
                  textAlign: 'center',
                }}
              >
                <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold">
                  {stats.userActivity.thisWeek}
                </Typography>
                <Typography variant="body2">This Week</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper
                elevation={0}
                sx={{
                  p: isMobile ? 1 : 1.5,
                  borderRadius: 2,
                  bgcolor: theme.palette.info.light,
                  color: theme.palette.info.contrastText,
                  textAlign: 'center',
                }}
              >
                <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold">
                  {stats.userActivity.lastWeek}
                </Typography>
                <Typography variant="body2">Last Week</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}; 