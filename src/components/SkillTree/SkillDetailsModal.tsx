import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Chip,
  Grid,
  useTheme,
  ButtonGroup,
  Paper,
  Avatar,
  Badge,
  LinearProgress
} from '@mui/material';
import {
  Close,
  FitnessCenter,
  CheckCircle,
  ArrowUpward,
  ArrowDownward,
  Info,
  PlayArrow,
  EmojiEvents,
  Star,
  StarBorder,
  Whatshot,
  AddCircle,
  RemoveCircle
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useSkillProgress } from '../../hooks';

// Define a simple confetti function if the canvas-confetti package is not available
const triggerConfetti = (options: any = {}) => {
  try {
    // Try to dynamically import canvas-confetti
    import('canvas-confetti').then(confettiModule => {
      const confetti = confettiModule.default;
      confetti(options);
    }).catch(err => {
      console.warn('Confetti effect not available:', err);
    });
  } catch (error) {
    console.warn('Confetti effect not available:', error);
  }
};

interface SkillDetailsModalProps {
  open: boolean;
  onClose: () => void;
  skillId: string;
}

export const SkillDetailsModal: React.FC<SkillDetailsModalProps> = ({
  open,
  onClose,
  skillId
}) => {
  const theme = useTheme();
  const {
    skill,
    sets,
    reps,
    incrementSets,
    decrementSets,
    incrementReps,
    decrementReps,
    isCompleted,
    percentComplete
  } = useSkillProgress(skillId);
  
  const [showConfetti, setShowConfetti] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  
  // Trigger confetti effect when skill is completed
  useEffect(() => {
    if (isCompleted && open) {
      setShowConfetti(true);
      
      // Trigger confetti
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        // Random colors
        triggerConfetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#00E676', '#6200EA', '#FFAB00'],
        });
        triggerConfetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#00B0FF', '#F44336', '#FFAB00'],
        });
      }, 250);
      
      // Show level up animation
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3000);
      
      return () => clearInterval(interval);
    }
  }, [isCompleted, open]);

  if (!skill) return null;

  const isLocked = skill.status === 'locked';
  
  // Generate stars based on skill level
  const renderLevelStars = () => {
    const stars = [];
    for (let i = 0; i < skill.level; i++) {
      stars.push(
        <Star key={i} sx={{ color: '#FFD700' }} />
      );
    }
    return stars;
  };
  
  // Calculate XP reward based on skill level
  const xpReward = skill.level * 100;
  
  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Push':
        return '#F44336';
      case 'Pull':
        return '#2196F3';
      case 'Legs':
        return '#4CAF50';
      case 'Core':
        return '#FF9800';
      default:
        return '#9C27B0';
    }
  };
  
  // Check if the video URL is a YouTube embed
  const isYouTubeEmbed = skill.videoUrl?.includes('youtube.com/embed/');

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
            backgroundImage: theme.palette.mode === 'dark' 
              ? 'linear-gradient(135deg, #1E1E1E 0%, #121212 100%)' 
              : 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          bgcolor: getCategoryColor(skill.category),
          color: 'white',
          p: 2
        }}>
          <Box display="flex" alignItems="center">
            <FitnessCenter sx={{ mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{skill.title}</Typography>
            <Chip 
              label={skill.category} 
              size="small" 
              sx={{ ml: 2, bgcolor: 'rgba(255,255,255,0.2)', fontWeight: 'bold' }} 
            />
          </Box>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              {skill.imageUrl && (
                <Box 
                  component="img" 
                  src={skill.imageUrl} 
                  alt={skill.title}
                  sx={{ 
                    width: '100%', 
                    height: 250, 
                    objectFit: 'cover',
                    borderRadius: 2,
                    mb: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                />
              )}
              
              <Typography variant="body1" paragraph>
                {skill.description}
              </Typography>
              
              <Paper elevation={0} sx={{ 
                mb: 3, 
                p: 2, 
                borderRadius: 2,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                border: `1px solid ${theme.palette.divider}`
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <EmojiEvents sx={{ mr: 1, color: '#FFD700' }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Skill Level: {skill.level}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  {renderLevelStars()}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Whatshot sx={{ mr: 1, color: '#FF6D00' }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    XP Reward: {xpReward} XP
                  </Typography>
                </Box>
              </Paper>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                  <FitnessCenter sx={{ mr: 1 }} />
                  Requirements:
                </Typography>
                <Paper elevation={0} sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  border: `1px solid ${theme.palette.divider}`
                }}>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {skill.requirements.description}
                  </Typography>
                </Paper>
              </Box>
              
              {skill.prerequisites.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                    <CheckCircle sx={{ mr: 1 }} />
                    Prerequisites:
                  </Typography>
                  <Paper elevation={0} sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                    border: `1px solid ${theme.palette.divider}`
                  }}>
                    <List dense>
                      {skill.prerequisites.map(preId => (
                        <ListItem key={preId}>
                          <ListItemIcon>
                            <CheckCircle color="success" />
                          </ListItemIcon>
                          <ListItemText primary={preId} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Box>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              {!isLocked && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Paper elevation={0} sx={{ 
                    mb: 3, 
                    p: 3, 
                    borderRadius: 2,
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                    border: `1px solid ${theme.palette.divider}`
                  }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
                      Track Your Progress
                    </Typography>
                    
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2" gutterBottom sx={{ fontWeight: 'medium' }}>
                          Sets: {sets}/{skill.requirements.sets}
                        </Typography>
                        <Paper 
                          elevation={0} 
                          sx={{ 
                            p: 1, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            borderRadius: 2,
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)',
                          }}
                        >
                          <IconButton 
                            onClick={decrementSets} 
                            disabled={sets <= 0}
                            color="primary"
                            size="small"
                          >
                            <RemoveCircle />
                          </IconButton>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {sets}
                          </Typography>
                          <IconButton 
                            onClick={incrementSets} 
                            disabled={sets >= skill.requirements.sets}
                            color="primary"
                            size="small"
                          >
                            <AddCircle />
                          </IconButton>
                        </Paper>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="body2" gutterBottom sx={{ fontWeight: 'medium' }}>
                          Reps: {reps}/{skill.requirements.reps}
                        </Typography>
                        <Paper 
                          elevation={0} 
                          sx={{ 
                            p: 1, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            borderRadius: 2,
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)',
                          }}
                        >
                          <IconButton 
                            onClick={decrementReps} 
                            disabled={reps <= 0}
                            color="primary"
                            size="small"
                          >
                            <RemoveCircle />
                          </IconButton>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {reps}
                          </Typography>
                          <IconButton 
                            onClick={incrementReps} 
                            disabled={reps >= skill.requirements.reps}
                            color="primary"
                            size="small"
                          >
                            <AddCircle />
                          </IconButton>
                        </Paper>
                      </Grid>
                    </Grid>
                    
                    {isCompleted ? (
                      <Box sx={{ 
                        p: 2, 
                        bgcolor: 'rgba(76, 175, 80, 0.1)', 
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        gap: 1,
                        border: '1px solid #4CAF50'
                      }}>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ 
                            type: "spring",
                            stiffness: 260,
                            damping: 20
                          }}
                        >
                          <Avatar 
                            sx={{ 
                              width: 80, 
                              height: 80, 
                              bgcolor: '#4CAF50',
                              mb: 1
                            }}
                          >
                            <EmojiEvents sx={{ fontSize: 40, color: '#FFD700' }} />
                          </Avatar>
                        </motion.div>
                        <Typography variant="h5" color="success.main" sx={{ fontWeight: 'bold' }}>
                          SKILL MASTERED!
                        </Typography>
                        <Typography variant="body1" align="center">
                          You've earned {xpReward} XP and unlocked new skills!
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ 
                        p: 2, 
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)',
                        borderRadius: 2
                      }}>
                        <Typography variant="body2" align="center" gutterBottom sx={{ fontWeight: 'medium' }}>
                          Progress: {percentComplete}%
                        </Typography>
                        <Box sx={{ 
                          width: '100%', 
                          height: 12, 
                          bgcolor: theme.palette.mode === 'light' ? '#e0e0e0' : '#424242',
                          borderRadius: 6,
                          overflow: 'hidden',
                          position: 'relative',
                          mb: 1
                        }}>
                          <Box sx={{ 
                            width: `${percentComplete}%`, 
                            height: '100%', 
                            bgcolor: theme.palette.primary.main,
                            position: 'absolute',
                            transition: 'width 0.5s ease',
                            backgroundImage: `linear-gradient(45deg, 
                              rgba(255, 255, 255, 0.15) 25%, 
                              transparent 25%, 
                              transparent 50%, 
                              rgba(255, 255, 255, 0.15) 50%, 
                              rgba(255, 255, 255, 0.15) 75%, 
                              transparent 75%, 
                              transparent)`,
                            backgroundSize: '40px 40px',
                            animation: 'progress-bar-stripes 1s linear infinite',
                            '@keyframes progress-bar-stripes': {
                              '0%': { backgroundPosition: '40px 0' },
                              '100%': { backgroundPosition: '0 0' }
                            }
                          }} />
                        </Box>
                        <Typography variant="body2" align="center">
                          Complete the requirements to master this skill!
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </motion.div>
              )}
              
              {skill.formTips && skill.formTips.length > 0 && (
                <Paper elevation={0} sx={{ 
                  mb: 3, 
                  p: 2, 
                  borderRadius: 2,
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  border: `1px solid ${theme.palette.divider}`
                }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                    <Info sx={{ mr: 1 }} />
                    Form Tips:
                  </Typography>
                  <List dense>
                    {skill.formTips.map((tip, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <FitnessCenter fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={tip} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}
              
              {skill.videoUrl && (
                <Paper elevation={0} sx={{ 
                  mb: 3, 
                  p: 2, 
                  borderRadius: 2,
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  border: `1px solid ${theme.palette.divider}`
                }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                    <PlayArrow sx={{ mr: 1 }} />
                    Demo Video:
                  </Typography>
                  {isYouTubeEmbed ? (
                    <Box 
                      component="iframe"
                      src={skill.videoUrl}
                      title={`${skill.title} demonstration`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      sx={{ 
                        width: '100%',
                        height: 250,
                        borderRadius: 2,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}
                    />
                  ) : (
                    <Box 
                      component="video"
                      controls
                      src={skill.videoUrl}
                      sx={{ 
                        width: '100%', 
                        borderRadius: 2,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}
                    />
                  )}
                </Paper>
              )}
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)' }}>
          <Button 
            onClick={onClose} 
            variant="contained" 
            color="primary"
            sx={{ 
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 'bold'
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Level Up Animation */}
      <AnimatePresence>
        {showLevelUp && (
          <Box
            component={motion.div}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5 }}
            sx={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 9999,
              pointerEvents: 'none'
            }}
          >
            <Paper
              elevation={24}
              sx={{
                p: 4,
                borderRadius: 4,
                textAlign: 'center',
                bgcolor: 'rgba(0,0,0,0.8)',
                color: 'white',
                border: '3px solid #FFD700'
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#FFD700', mb: 2 }}>
                LEVEL UP!
              </Typography>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Skill Mastered: {skill.title}
              </Typography>
              <Typography variant="h6" sx={{ color: '#00E676' }}>
                +{xpReward} XP
              </Typography>
            </Paper>
          </Box>
        )}
      </AnimatePresence>
    </>
  );
}; 