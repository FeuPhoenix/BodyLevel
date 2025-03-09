import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  LinearProgress, 
  Chip,
  Tooltip,
  useTheme
} from '@mui/material';
import { 
  LockOutlined, 
  LockOpenOutlined, 
  CheckCircleOutline,
  PlayCircleOutline,
  Star,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Skill, SkillStatus } from '../../types';
import { useSkillProgress } from '../../hooks';
import { SkillDetailsModal } from './SkillDetailsModal';
import { fadeUp } from '../../utils/animationVariants';

interface SkillCardProps {
  skill: Skill;
}

export const SkillCard: React.FC<SkillCardProps> = ({ skill }) => {
  const theme = useTheme();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { percentComplete } = useSkillProgress(skill.id);
  const isDarkMode = theme.palette.mode === 'dark';
  
  const getStatusIcon = (status: SkillStatus) => {
    switch (status) {
      case 'locked':
        return <LockOutlined />;
      case 'unlocked':
        return <LockOpenOutlined />;
      case 'in-progress':
        return <PlayCircleOutline />;
      case 'completed':
        return <CheckCircleOutline />;
      default:
        return null;
    }
  };
  
  const getStatusColor = (status: SkillStatus) => {
    switch (status) {
      case 'locked':
        return isDarkMode ? '#616161' : '#757575';
      case 'unlocked':
        return '#00E676';
      case 'in-progress':
        return '#FFAB00';
      case 'completed':
        return '#00B0FF';
      default:
        return '#757575';
    }
  };
  
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
  
  const isDisabled = skill.status === 'locked';
  
  // Generate stars based on skill level
  const renderLevelStars = () => {
    const stars = [];
    for (let i = 0; i < skill.level; i++) {
      stars.push(
        <Star key={i} fontSize="small" sx={{ color: '#FFD700' }} />
      );
    }
    return stars;
  };
  
  return (
    <>
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        whileHover={isDisabled ? {} : { 
          scale: 1.05, 
          rotate: 1,
          transition: { type: "spring", stiffness: 400, damping: 10 }
        }}
        whileTap={isDisabled ? {} : { 
          scale: 0.98,
          transition: { type: "spring", stiffness: 400, damping: 17 }
        }}
        style={{
          width: '100%',
          maxWidth: '100%'
        }}
      >
        <Card 
          sx={{ 
            width: '100%',
            minWidth: { xs: '100%', sm: 275 }, 
            maxWidth: { xs: '100%', sm: 345 },
            opacity: isDisabled ? 0.7 : 1,
            border: `2px solid ${getStatusColor(skill.status)}`,
            borderRadius: '12px',
            boxShadow: isDisabled ? 1 : '0 8px 16px rgba(0,0,0,0.2)',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            background: isDisabled 
              ? isDarkMode ? '#2a2a2a' : '#f5f5f5'
              : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.paper}ee 100%)`,
            position: 'relative',
            overflow: 'visible',
            '&:hover': {
              boxShadow: isDisabled ? 1 : '0 12px 20px rgba(0,0,0,0.3)',
              transform: isDisabled ? 'none' : 'translateY(-5px)'
            }
          }}
          onClick={() => !isDisabled && setDetailsOpen(true)}
        >
          {/* Level Badge */}
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.2
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: '-12px',
                right: '-12px',
                backgroundColor: getCategoryColor(skill.category),
                color: 'white',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                zIndex: 1,
                border: '2px solid white'
              }}
            >
              {skill.level}
            </Box>
          </motion.div>
          
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 1,
              flexWrap: 'wrap',
              gap: 1
            }}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Chip 
                  label={skill.category} 
                  size="small" 
                  sx={{ 
                    backgroundColor: getCategoryColor(skill.category), 
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
              </motion.div>
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Tooltip title={skill.status}>
                  <Box sx={{ color: getStatusColor(skill.status) }}>
                    {getStatusIcon(skill.status)}
                  </Box>
                </Tooltip>
              </motion.div>
            </Box>
            
            <Typography 
              variant="h6" 
              component="div" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '1rem', sm: '1.25rem' },
                lineHeight: 1.2,
                minHeight: { xs: 'auto', sm: '3rem' },
                wordBreak: 'break-word'
              }}
            >
              {skill.title}
            </Typography>
            
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mb: 2,
                minHeight: { xs: 'auto', sm: '3rem' },
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                wordBreak: 'break-word'
              }}
            >
              {skill.description}
            </Typography>
            
            {/* Level stars */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Box sx={{ display: 'flex', mb: 1 }}>
                {renderLevelStars()}
              </Box>
            </motion.div>
            
            <Box sx={{ mb: 1 }}>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  wordBreak: 'break-word'
                }}
              >
                {skill.requirements.description}
              </Typography>
            </Box>
            
            {skill.status === 'in-progress' && (
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Box sx={{ width: '100%', mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      XP Progress
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {percentComplete}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={percentComplete} 
                    sx={{ 
                      height: 10, 
                      borderRadius: 5,
                      backgroundColor: isDarkMode ? '#424242' : '#e0e0e0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getStatusColor(skill.status),
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
                      }
                    }}
                  />
                </Box>
              </motion.div>
            )}
            
            {skill.status === 'completed' && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.3
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mt: 2,
                  p: 1,
                  backgroundColor: `${getStatusColor(skill.status)}22`,
                  borderRadius: 1,
                  border: `1px solid ${getStatusColor(skill.status)}`
                }}>
                  <CheckCircleOutline sx={{ mr: 1, color: getStatusColor(skill.status) }} />
                  <Typography variant="body2" sx={{ color: getStatusColor(skill.status), fontWeight: 'bold' }}>
                    MASTERED!
                  </Typography>
                </Box>
              </motion.div>
            )}
            
            {skill.status === 'locked' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mt: 2,
                  p: 1,
                  backgroundColor: isDarkMode ? '#424242' : '#f5f5f5',
                  borderRadius: 1,
                  border: '1px dashed #757575'
                }}>
                  <LockOutlined sx={{ mr: 1, color: '#757575' }} />
                  <Typography variant="body2" sx={{ color: '#757575' }}>
                    Complete prerequisites to unlock
                  </Typography>
                </Box>
              </motion.div>
            )}
          </CardContent>
          
          {/* Glow effect for unlocked skills */}
          {skill.status === 'unlocked' && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: '12px',
                boxShadow: `0 0 15px ${getStatusColor(skill.status)}`,
                opacity: 0.6,
                pointerEvents: 'none'
              }}
            />
          )}
        </Card>
      </motion.div>
      
      <SkillDetailsModal 
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        skillId={skill.id}
      />
    </>
  );
}; 