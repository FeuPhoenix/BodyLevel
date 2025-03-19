import { Box, Typography, Container, Paper, useTheme } from '@mui/material';
import { FitnessCenterRounded } from '@mui/icons-material';
import { useAppSelector } from '../../hooks';

export const Skills = () => {
  const theme = useTheme();
  const { skills } = useAppSelector(state => state.skills);
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom fontWeight="bold">
          Skills Overview
        </Typography>
        
        <Typography variant="body1" paragraph color="text.secondary">
          Track your progress and unlock new skills as you advance on your fitness journey.
        </Typography>
        
        <Box sx={{ mt: 4 }}>
          {skills && skills.length > 0 ? (
            <Box>
              <Typography variant="h6" gutterBottom>
                You have {skills.length} skills available
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                We're working on a better way to visualize and track your skills.
                Check back soon for an improved experience!
              </Typography>
            </Box>
          ) : (
            <Box textAlign="center" p={4}>
              <FitnessCenterRounded sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No Skills Available Yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We're setting up your personalized skills. Check back soon!
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
}; 