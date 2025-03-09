import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Container, Button, Grid, useTheme, Fab, Zoom } from '@mui/material';
import { motion } from 'framer-motion';
import { CategoryFilter } from './UI/CategoryFilter';
import { SkillTree } from './SkillTree/SkillTree';
import { FitnessCenter, EmojiEvents, Whatshot, ArrowDownward, KeyboardArrowUp } from '@mui/icons-material';
import { SkillCategory } from '../types';

export const Home: React.FC = () => {
  const theme = useTheme();
  const [currentCategory, setCurrentCategory] = useState<SkillCategory | 'All'>('All');
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  // Handle category selection
  const handleCategorySelect = (category: SkillCategory | 'All') => {
    console.log(`Selected category: ${category}`);
    setCurrentCategory(category);
    
    // Scroll to skill tree
    const skillTreeElement = document.getElementById('skill-tree');
    if (skillTreeElement) {
      skillTreeElement.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Handle scroll to show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      // Show button when page is scrolled down 300px
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <Box>
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 4, md: 6 }, 
          mb: 5, 
          borderRadius: 4,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative elements */}
        <Box 
          sx={{ 
            position: 'absolute', 
            top: -100, 
            right: -100, 
            width: 300, 
            height: 300, 
            borderRadius: '50%', 
            background: 'rgba(255,255,255,0.1)',
            zIndex: 0
          }} 
        />
        <Box 
          sx={{ 
            position: 'absolute', 
            bottom: -50, 
            left: -50, 
            width: 200, 
            height: 200, 
            borderRadius: '50%', 
            background: 'rgba(255,255,255,0.1)',
            zIndex: 0
          }} 
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
              Body Level Up
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, opacity: 0.9, maxWidth: 700 }}>
              Progressive calisthenics skill tree to level up your fitness journey
            </Typography>
            
            <Button 
              variant="contained" 
              size="large"
              color="secondary"
              onClick={() => handleCategorySelect('All')}
              sx={{ 
                borderRadius: 30, 
                px: 4, 
                py: 1.5, 
                fontSize: '1.1rem',
                boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 25px rgba(0,0,0,0.4)',
                }
              }}
            >
              View All Skills
            </Button>
          </motion.div>
          
          <Grid container spacing={4} sx={{ mt: 8 }}>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Box>
                  <Paper 
                    elevation={3} 
                    sx={{ 
                      p: 3, 
                      borderRadius: 3,
                      height: '100%',
                      background: theme.palette.mode === 'dark' 
                        ? 'linear-gradient(135deg, #1E1E1E 0%, #121212 100%)' 
                        : 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 12px 25px rgba(0,0,0,0.15)',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'primary.main',
                          color: 'white',
                          mr: 2
                        }}
                      >
                        <FitnessCenter />
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        Progressive Skills
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      Follow a structured progression path from beginner to advanced exercises
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'rgba(255,255,255,0.1)',
                          flexShrink: 0
                        }}
                      >
                        <FitnessCenter sx={{ color: theme.palette.primary.main }} />
                      </Box>
                      <Typography variant="body1">
                        Each skill builds upon the previous one
                      </Typography>
                    </Box>
                  </Paper>
                </Box>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Box>
                  <Paper 
                    elevation={3} 
                    sx={{ 
                      p: 3, 
                      borderRadius: 3,
                      height: '100%',
                      background: theme.palette.mode === 'dark' 
                        ? 'linear-gradient(135deg, #1E1E1E 0%, #121212 100%)' 
                        : 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 12px 25px rgba(0,0,0,0.15)',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'secondary.main',
                          color: 'white',
                          mr: 2
                        }}
                      >
                        <EmojiEvents />
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        Achievement System
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      Track your progress and unlock new skills as you complete exercises
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'rgba(255,255,255,0.1)',
                          flexShrink: 0
                        }}
                      >
                        <EmojiEvents sx={{ color: theme.palette.secondary.main }} />
                      </Box>
                      <Typography variant="body1">
                        Earn XP and level up as you master new skills
                      </Typography>
                    </Box>
                  </Paper>
                </Box>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Box>
                  <Paper 
                    elevation={3} 
                    sx={{ 
                      p: 3, 
                      borderRadius: 3,
                      height: '100%',
                      background: theme.palette.mode === 'dark' 
                        ? 'linear-gradient(135deg, #1E1E1E 0%, #121212 100%)' 
                        : 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 12px 25px rgba(0,0,0,0.15)',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: '#FF9800',
                          color: 'white',
                          mr: 2
                        }}
                      >
                        <Whatshot />
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        Progress Tracking
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      Keep track of your sets, reps, and completed exercises
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'rgba(255,255,255,0.1)',
                          flexShrink: 0
                        }}
                      >
                        <FitnessCenter sx={{ color: '#FFFFFF' }} />
                      </Box>
                      <Typography variant="body1">
                        Track your sets and reps with visual progress indicators
                      </Typography>
                    </Box>
                  </Paper>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
          
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 6,
              animation: 'bounce 2s infinite',
              '@keyframes bounce': {
                '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
                '40%': { transform: 'translateY(-20px)' },
                '60%': { transform: 'translateY(-10px)' }
              }
            }}
          >
            <ArrowDownward sx={{ fontSize: 40, opacity: 0.7 }} />
          </Box>
        </Container>
      </Paper>
      
      <Box id="skill-tree">
        <CategoryFilter 
          onSelectCategory={handleCategorySelect} 
          currentCategory={currentCategory} 
        />
        <SkillTree category={currentCategory} />
      </Box>
      
      {/* Back to top button */}
      <Zoom in={showBackToTop}>
        <Fab 
          color="primary" 
          size="medium" 
          aria-label="scroll back to top"
          onClick={scrollToTop}
          sx={{ 
            position: 'fixed', 
            bottom: 20, 
            right: 20,
            zIndex: 1000
          }}
        >
          <KeyboardArrowUp />
        </Fab>
      </Zoom>
    </Box>
  );
}; 