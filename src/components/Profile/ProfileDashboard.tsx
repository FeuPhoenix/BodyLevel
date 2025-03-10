import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAppSelector } from '../../hooks';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Divider,
  LinearProgress,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import {
  Person,
  CalendarToday,
  EmojiEvents,
  Whatshot,
  TrendingUp,
  FitnessCenterRounded,
  AccessTime,
} from '@mui/icons-material';

export const ProfileDashboard = () => {
  const { user, profile } = useAuth();
  const theme = useTheme();
  const skills = useAppSelector(state => state.skills.skills);
  
  // Calculate stats
  const completedSkills = skills.filter(skill => skill.status === 'completed');
  const inProgressSkills = skills.filter(skill => skill.status === 'in-progress');
  const totalXP = completedSkills.reduce((total, skill) => total + (skill.level * 100), 0);
  const level = Math.floor(totalXP / 500) + 1;
  
  // Progress to next level
  const xpForCurrentLevel = (level - 1) * 500;
  const xpForNextLevel = level * 500;
  const xpProgress = ((totalXP - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;
  
  // Mock data (in a real app, these would come from the backend)
  const daysActive = 14;
  const lastActive = new Date().toLocaleDateString();
  const longestStreak = 7;
  const currentStreak = 3;
  
  // Calculate skill category distribution
  const categoryDistribution = {
    Push: skills.filter(skill => skill.category === 'Push' && skill.status === 'completed').length,
    Pull: skills.filter(skill => skill.category === 'Pull' && skill.status === 'completed').length,
    Legs: skills.filter(skill => skill.category === 'Legs' && skill.status === 'completed').length,
    Core: skills.filter(skill => skill.category === 'Core' && skill.status === 'completed').length,
  };
  
  const totalCompleted = Object.values(categoryDistribution).reduce((sum, val) => sum + val, 0);
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Grid container spacing={4}>
        {/* User Profile Card */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: theme.palette.primary.main,
                  mb: 2,
                  fontSize: '2rem',
                }}
              >
                {profile?.display_name?.[0] || user?.username?.[0] || <Person />}
              </Avatar>
              <Typography variant="h5" fontWeight="bold">
                {profile?.display_name || user?.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                @{user?.username}
              </Typography>
              
              {profile?.bio && (
                <Typography variant="body1" textAlign="center" mt={2}>
                  {profile.bio}
                </Typography>
              )}
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Level {level} Athlete
              </Typography>
              <Box display="flex" alignItems="center" mb={1}>
                <Typography variant="body2" color="text.secondary">
                  {totalXP - xpForCurrentLevel} / {xpForNextLevel - xpForCurrentLevel} XP to Level {level + 1}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={xpProgress} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  mb: 2,
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: theme.palette.secondary.main,
                  }
                }} 
              />
              
              <Box display="flex" justifyContent="space-between" mt={3}>
                <Box textAlign="center">
                  <Typography variant="h6" fontWeight="bold">{totalXP}</Typography>
                  <Typography variant="body2" color="text.secondary">Total XP</Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="h6" fontWeight="bold">{completedSkills.length}</Typography>
                  <Typography variant="body2" color="text.secondary">Skills Mastered</Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="h6" fontWeight="bold">{inProgressSkills.length}</Typography>
                  <Typography variant="body2" color="text.secondary">In Progress</Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        {/* Activity Stats */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {/* Streak Card */}
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Activity Overview
                </Typography>
                <Grid container spacing={3} mt={1}>
                  <Grid item xs={6} sm={3}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                      <Avatar sx={{ bgcolor: theme.palette.primary.light, mb: 1 }}>
                        <CalendarToday />
                      </Avatar>
                      <Typography variant="h6" fontWeight="bold">{daysActive}</Typography>
                      <Typography variant="body2" color="text.secondary" textAlign="center">
                        Days Active
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                      <Avatar sx={{ bgcolor: theme.palette.success.light, mb: 1 }}>
                        <TrendingUp />
                      </Avatar>
                      <Typography variant="h6" fontWeight="bold">{currentStreak}</Typography>
                      <Typography variant="body2" color="text.secondary" textAlign="center">
                        Current Streak
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                      <Avatar sx={{ bgcolor: theme.palette.warning.light, mb: 1 }}>
                        <EmojiEvents />
                      </Avatar>
                      <Typography variant="h6" fontWeight="bold">{longestStreak}</Typography>
                      <Typography variant="body2" color="text.secondary" textAlign="center">
                        Longest Streak
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                      <Avatar sx={{ bgcolor: theme.palette.info.light, mb: 1 }}>
                        <AccessTime />
                      </Avatar>
                      <Typography variant="h6" fontWeight="bold">{lastActive}</Typography>
                      <Typography variant="body2" color="text.secondary" textAlign="center">
                        Last Active
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            
            {/* Skill Distribution */}
            <Grid item xs={12} sm={6}>
              <Card elevation={2} sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Skill Distribution
                  </Typography>
                  <Box mt={2}>
                    {Object.entries(categoryDistribution).map(([category, count]) => (
                      <Box key={category} mb={2}>
                        <Box display="flex" justifyContent="space-between" mb={0.5}>
                          <Typography variant="body2">{category}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {count} / {skills.filter(s => s.category === category).length} completed
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(count / Math.max(1, skills.filter(s => s.category === category).length)) * 100}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: 
                                category === 'Push' ? '#f44336' : 
                                category === 'Pull' ? '#2196f3' : 
                                category === 'Legs' ? '#4caf50' : 
                                '#ff9800',
                            }
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Recent Achievements */}
            <Grid item xs={12} sm={6}>
              <Card elevation={2} sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Recent Achievements
                  </Typography>
                  
                  {completedSkills.length > 0 ? (
                    completedSkills.slice(0, 4).map((skill) => (
                      <Box key={skill.id} display="flex" alignItems="center" mb={2}>
                        <Avatar 
                          sx={{ 
                            bgcolor: 
                              skill.category === 'Push' ? '#f44336' : 
                              skill.category === 'Pull' ? '#2196f3' : 
                              skill.category === 'Legs' ? '#4caf50' : 
                              '#ff9800',
                            mr: 2,
                          }}
                        >
                          <FitnessCenterRounded />
                        </Avatar>
                        <Box>
                          <Typography variant="body1">{skill.title}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {skill.category} • Level {skill.level}
                          </Typography>
                        </Box>
                      </Box>
                    ))
                  ) : (
                    <Box textAlign="center" py={4}>
                      <Typography variant="body1" color="text.secondary">
                        No achievements yet. Start completing skills!
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}; 