import { useEffect } from 'react';
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
} from '@mui/material';
import {
  FitnessCenterRounded,
  EmojiEvents,
  TrendingUp,
  Psychology,
} from '@mui/icons-material';
import { useAppSelector } from '../../hooks';

export const ProfileDashboard = () => {
  const theme = useTheme();
  const { user } = useAppSelector((state) => state.auth);
  const skills = useAppSelector((state) => state.skills.skills);

  // Calculate statistics
  const completedSkills = skills.filter((skill) => skill.status === 'completed');
  const inProgressSkills = skills.filter((skill) => skill.status === 'in-progress');
  const totalXP = completedSkills.reduce((total, skill) => total + skill.level * 100, 0);
  const level = Math.floor(totalXP / 500) + 1;
  const xpToNextLevel = (level * 500) - totalXP;
  const progressToNextLevel = ((totalXP % 500) / 500) * 100;

  return (
    <Box sx={{ mt: 2, mb: 8 }}>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">
            Profile Dashboard
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={{ bgcolor: 'background.default', borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      bgcolor: theme.palette.primary.main,
                      fontSize: '2.5rem',
                      mb: 2,
                    }}
                  >
                    {user?.username?.[0]}
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold">
                    {user?.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Level {level} Athlete
                  </Typography>
                  <Box sx={{ width: '100%', mt: 2 }}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Typography variant="body2" color="text.secondary">
                        {totalXP % 500} / 500 XP to Level {level + 1}
                      </Typography>
                    </Box>
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
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
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

              <Grid item xs={12} sm={6}>
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

              <Grid item xs={12} sm={6}>
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

              <Grid item xs={12} sm={6}>
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
      </Paper>
    </Box>
  );
}; 