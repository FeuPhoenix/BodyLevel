import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Paper, 
  Grid, 
  useTheme,
  Fab,
  useMediaQuery
} from '@mui/material';
import { FitnessCenter, EmojiEvents, Whatshot, ArrowDownward, KeyboardArrowUp } from '@mui/icons-material';
import { SkillTree } from './SkillTree/SkillTree';
import { CategoryFilter } from './UI/CategoryFilter';
import { SkillCategory } from '../types';
import { 
  staggerContainer, 
  fadeUp, 
  slideInLeft, 
  slideInRight, 
  fadeInScale 
} from '../utils/animationVariants';

export const Home: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentCategory, setCurrentCategory] = useState<SkillCategory | 'All'>('All');
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  // Handle scroll to show back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleCategorySelect = (category: SkillCategory | 'All') => {
    setCurrentCategory(category);
    
    // Scroll to skill tree section
    const skillTreeElement = document.getElementById('skill-tree');
    if (skillTreeElement) {
      skillTreeElement.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <Box>
      {/* Hero Section */}
      <Paper 
        elevation={0}
        sx={{ 
          pt: { xs: 8, sm: 12 }, 
          pb: { xs: 12, sm: 16 }, 
          borderRadius: { xs: '0 0 24px 24px', sm: '0 0 32px 32px' },
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, #1a237e 0%, #311b92 100%)' 
            : 'linear-gradient(135deg, #3f51b5 0%, #7e57c2 100%)',
          position: 'relative',
          overflow: 'hidden',
          mb: { xs: 2, sm: 4 }
        }}
      >
        {/* Decorative circles */}
        <Box 
          sx={{ 
            position: 'absolute', 
            top: -100, 
            right: -50, 
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
            variants={staggerContainer(0.2, 0.1)}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={fadeUp}>
              <Typography 
                variant={isMobile ? "h3" : "h2"} 
                component="h1" 
                sx={{ 
                  fontWeight: 'bold', 
                  mb: 2, 
                  color: 'white',
                  textAlign: isMobile ? 'center' : 'left',
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' }
                }}
              >
                Body Level Up
              </Typography>
            </motion.div>
            
            <motion.div variants={fadeUp}>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 4, 
                  opacity: 0.9, 
                  maxWidth: 700, 
                  color: 'white',
                  textAlign: isMobile ? 'center' : 'left',
                  fontSize: { xs: '1.1rem', sm: '1.5rem' },
                  mx: isMobile ? 'auto' : 0
                }}
              >
                Progressive calisthenics skill tree to level up your fitness journey
              </Typography>
            </motion.div>
            
            <motion.div 
              variants={fadeUp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: 'flex',
                justifyContent: isMobile ? 'center' : 'flex-start'
              }}
            >
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
          </motion.div>
          
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ mt: { xs: 6, sm: 8 } }}>
            <Grid item xs={12} md={4}>
              <motion.div
                variants={slideInLeft}
                initial="hidden"
                animate="show"
                transition={{ delay: 0.3 }}
              >
                <Box>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 2,
                      color: 'white',
                      justifyContent: isMobile ? 'center' : 'flex-start'
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        mr: 1.5,
                        boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
                      }}
                    >
                      <FitnessCenter sx={{ color: 'white' }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Progressive Overload
                    </Typography>
                  </Box>
                  <Paper 
                    sx={{ 
                      p: 3, 
                      borderRadius: 4,
                      boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                      }
                    }}
                  >
                    <Typography align={isMobile ? "center" : "left"}>
                      Follow a structured progression from beginner to advanced exercises, 
                      gradually increasing difficulty as you master each skill.
                    </Typography>
                  </Paper>
                </Box>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <motion.div
                variants={fadeInScale}
                initial="hidden"
                animate="show"
                transition={{ delay: 0.4 }}
              >
                <Box>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 2,
                      color: 'white',
                      justifyContent: isMobile ? 'center' : 'flex-start'
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        mr: 1.5,
                        boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
                      }}
                    >
                      <EmojiEvents sx={{ color: 'white' }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Achievement System
                    </Typography>
                  </Box>
                  <Paper 
                    sx={{ 
                      p: 3, 
                      borderRadius: 4,
                      boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                      }
                    }}
                  >
                    <Typography align={isMobile ? "center" : "left"}>
                      Earn XP and unlock new skills as you complete exercises. 
                      Track your progress and celebrate your achievements along the way.
                    </Typography>
                  </Paper>
                </Box>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <motion.div
                variants={slideInRight}
                initial="hidden"
                animate="show"
                transition={{ delay: 0.5 }}
              >
                <Box>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 2,
                      color: 'white',
                      justifyContent: isMobile ? 'center' : 'flex-start'
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        mr: 1.5,
                        boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
                      }}
                    >
                      <Whatshot sx={{ color: 'white' }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Balanced Training
                    </Typography>
                  </Box>
                  <Paper 
                    sx={{ 
                      p: 3, 
                      borderRadius: 4,
                      boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                      }
                    }}
                  >
                    <Typography align={isMobile ? "center" : "left"}>
                      Focus on all aspects of fitness with exercises organized by Push, Pull, Legs, and Core categories
                      for a well-rounded physique.
                    </Typography>
                  </Paper>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
          
          <motion.div
            initial={{ y: 0 }}
            animate={{ 
              y: [0, -15, 0] 
            }}
            transition={{ 
              duration: 0.6, 
              repeat: Infinity, 
              repeatType: "reverse" as const, 
              repeatDelay: 0.5 
            }}
            style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              marginTop: '4rem' 
            }}
          >
            <Box 
              onClick={() => {
                const skillTreeElement = document.getElementById('skill-tree');
                if (skillTreeElement) {
                  skillTreeElement.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              sx={{ 
                cursor: 'pointer',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 'medium' }}>
                Explore Skills
              </Typography>
              <ArrowDownward sx={{ fontSize: 40, opacity: 0.7 }} />
            </Box>
          </motion.div>
        </Container>
      </Paper>
      
      <Box id="skill-tree" sx={{ px: { xs: 2, sm: 3, md: 4 }, maxWidth: '1400px', mx: 'auto' }}>
        <CategoryFilter 
          onSelectCategory={handleCategorySelect} 
          currentCategory={currentCategory} 
        />
        <SkillTree category={currentCategory} />
      </Box>
      
      {/* Back to top button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            style={{
              position: 'fixed',
              bottom: 20,
              right: 20,
              zIndex: 1000
            }}
          >
            <Fab 
              color="primary" 
              size="medium" 
              aria-label="scroll back to top"
              onClick={scrollToTop}
              sx={{
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}
            >
              <KeyboardArrowUp />
            </Fab>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}; 