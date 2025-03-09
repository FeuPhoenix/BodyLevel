import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  useTheme, 
  Container,
  Button,
  IconButton,
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

export const Header: React.FC = () => {
  const theme = useTheme();
  const skills = useAppSelector(state => state.skills.skills);
  const progress = useAppSelector(state => state.skills.progress);
  
  // Calculate total XP and level
  const completedSkills = skills.filter(skill => skill.status === 'completed');
  const totalXP = completedSkills.reduce((total, skill) => total + (skill.level * 100), 0);
  const userLevel = Math.max(1, Math.floor(totalXP / 500) + 1);
  
  return (
    <AppBar 
      position="static" 
      elevation={0} 
      sx={{ 
        mb: 0,
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(90deg, #121212 0%, #1E1E1E 100%)'
          : 'linear-gradient(90deg, #FFFFFF 0%, #F5F5F5 100%)',
        borderBottom: `1px solid ${theme.palette.divider}`
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ py: 1 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Box display="flex" alignItems="center">
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
          
          {/* Game stats */}
          <Box 
            sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              alignItems: 'center', 
              gap: 3,
              mr: 3
            }}
          >
            <Tooltip title="Your Level">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <Avatar
                      sx={{ 
                        width: 22, 
                        height: 22, 
                        bgcolor: theme.palette.primary.main,
                        border: '2px solid white',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {userLevel}
                    </Avatar>
                  }
                >
                  <Avatar
                    sx={{ 
                      bgcolor: 'transparent',
                      border: `2px solid ${theme.palette.primary.main}`,
                      color: theme.palette.primary.main
                    }}
                  >
                    <EmojiEvents />
                  </Avatar>
                </Badge>
                <Box sx={{ ml: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1 }}>
                    Level
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {userLevel}
                  </Typography>
                </Box>
              </Box>
            </Tooltip>
            
            <Tooltip title="Total XP">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  sx={{ 
                    bgcolor: 'transparent',
                    border: `2px solid ${theme.palette.secondary.main}`,
                    color: theme.palette.secondary.main
                  }}
                >
                  <Whatshot />
                </Avatar>
                <Box sx={{ ml: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1 }}>
                    XP
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {totalXP}
                  </Typography>
                </Box>
              </Box>
            </Tooltip>
            
            <Tooltip title="Completed Skills">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  sx={{ 
                    bgcolor: 'transparent',
                    border: `2px solid #00B0FF`,
                    color: '#00B0FF'
                  }}
                >
                  <FitnessCenterRounded />
                </Avatar>
                <Box sx={{ ml: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1 }}>
                    Skills
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {completedSkills.length}/{skills.length}
                  </Typography>
                </Box>
              </Box>
            </Tooltip>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ProgressImportExport />
            <ProgressReset />
            <ThemeToggle />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}; 