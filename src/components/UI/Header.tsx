import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  useTheme, 
  Container,
  Avatar,
  Badge,
  Tooltip
} from '@mui/material';
import { ThemeToggle } from './ThemeToggle';
import { ProgressReset } from './ProgressReset';
import { ProgressImportExport } from './ProgressImportExport';
import { useAppSelector } from '../../hooks';
import { 
  FitnessCenterRounded, 
  EmojiEvents, 
  Whatshot
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { slideInLeft, slideInRight } from '../../utils/animationVariants';

export const Header: React.FC = () => {
  const theme = useTheme();
  const skills = useAppSelector(state => state.skills.skills);
  
  // Calculate total XP and level
  const completedSkills = skills.filter(skill => skill.status === 'completed');
  const totalXP = completedSkills.reduce((total, skill) => total + (skill.level * 100), 0);
  const level = Math.floor(totalXP / 500) + 1;
  
  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(90deg, #121212 0%, #1E1E1E 100%)'
          : 'linear-gradient(90deg, #FFFFFF 0%, #F5F5F5 100%)',
        borderBottom: `1px solid ${theme.palette.divider}`
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ py: 1 }}>
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            animate="show"
          >
            <Box display="flex" alignItems="center">
              <motion.div
                initial={{ scale: 1 }}
                animate={{ 
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  repeatType: "reverse" as const
                }}
              >
                <Avatar
                  sx={{ 
                    bgcolor: theme.palette.primary.main,
                    width: 40,
                    height: 40,
                    mr: 1.5,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                >
                  <FitnessCenterRounded />
                </Avatar>
              </motion.div>
              <Typography 
                variant="h5" 
                component="div" 
                sx={{ 
                  fontWeight: 'bold',
                  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mr: 2
                }}
              >
                BodyLevel
              </Typography>
            </Box>
          </motion.div>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <motion.div
            variants={slideInRight}
            initial="hidden"
            animate="show"
          >
            <Box display="flex" alignItems="center" gap={2}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    bgcolor: 'background.paper', 
                    py: 0.5, 
                    px: 2, 
                    borderRadius: 20,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <Tooltip title="Your Level">
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        <Avatar sx={{ width: 22, height: 22, bgcolor: theme.palette.secondary.main, fontSize: '0.8rem' }}>
                          {level}
                        </Avatar>
                      }
                    >
                      <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 35, height: 35 }}>
                        <EmojiEvents fontSize="small" />
                      </Avatar>
                    </Badge>
                  </Tooltip>
                  
                  <Box sx={{ ml: 1.5 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1 }}>
                      XP Points
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Whatshot sx={{ color: '#FF9800', fontSize: 16, mr: 0.5 }} />
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {totalXP}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <ThemeToggle />
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <ProgressReset />
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <ProgressImportExport />
              </motion.div>
            </Box>
          </motion.div>
        </Toolbar>
      </Container>
    </AppBar>
  );
}; 