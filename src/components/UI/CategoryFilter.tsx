import React from 'react';
import { Box, Button, Typography, Paper, useTheme, useMediaQuery } from '@mui/material';
import { 
  FitnessCenterOutlined, 
  FitnessCenter,
  FilterList
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { SkillCategory } from '../../types';
import { fadeUp } from '../../utils/animationVariants';

interface CategoryNavigationProps {
  onSelectCategory: (category: SkillCategory | 'All') => void;
  currentCategory: SkillCategory | 'All';
}

export const CategoryFilter: React.FC<CategoryNavigationProps> = ({ 
  onSelectCategory, 
  currentCategory 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDarkMode = theme.palette.mode === 'dark';
  
  // Get category color
  const getCategoryColor = (category: SkillCategory | 'All') => {
    switch (category) {
      case 'Push':
        return '#F44336'; // red
      case 'Pull':
        return '#2196F3'; // blue
      case 'Legs':
        return '#4CAF50'; // green
      case 'Core':
        return '#FF9800'; // orange
      case 'All':
      default:
        return '#9C27B0'; // purple
    }
  };
  
  // Get category icon
  const getCategoryIcon = (category: SkillCategory | 'All') => {
    const iconColor = isDarkMode ? 'white' : getCategoryColor(category);
    
    switch (category) {
      case 'Push':
        return <FitnessCenter sx={{ color: iconColor }} />;
      case 'Pull':
        return <FitnessCenter sx={{ color: iconColor, transform: 'rotate(90deg)' }} />;
      case 'Legs':
        return <FitnessCenter sx={{ color: iconColor, transform: 'rotate(45deg)' }} />;
      case 'Core':
        return <FitnessCenter sx={{ color: iconColor, transform: 'rotate(-45deg)' }} />;
      case 'All':
      default:
        return <FilterList sx={{ color: iconColor }} />;
    }
  };
  
  // Available categories
  const categories: Array<SkillCategory | 'All'> = ['All', 'Push', 'Pull', 'Legs', 'Core'];
  
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
    >
      <Paper 
        elevation={3} 
        sx={{ 
          mb: 4, 
          p: { xs: 2, sm: 3 }, 
          borderRadius: '16px',
          background: isDarkMode 
            ? 'linear-gradient(135deg, #1E1E1E 0%, #121212 100%)' 
            : 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          overflow: 'hidden' // Prevent content from overflowing
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 2,
          flexDirection: isMobile ? 'column' : 'row',
          textAlign: isMobile ? 'center' : 'left'
        }}>
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 1 }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.palette.primary.main,
                mr: isMobile ? 0 : 1.5,
                mb: isMobile ? 1 : 0,
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
              }}
            >
              <FitnessCenterOutlined sx={{ color: 'white' }} />
            </Box>
          </motion.div>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Skill Categories
          </Typography>
        </Box>
        
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 3, 
            opacity: 0.8,
            textAlign: isMobile ? 'center' : 'left'
          }}
        >
          Select a category to view specific skills or view all skills together
        </Typography>
        
        <Box 
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: { xs: 1, sm: 1.5 },
            justifyContent: 'center',
            width: '100%',
            maxWidth: '100%'
          }}
        >
          {categories.map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ 
                flex: isMobile ? '1 0 45%' : 'auto',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <Button
                variant={currentCategory === category ? "contained" : "outlined"}
                startIcon={getCategoryIcon(category)}
                onClick={() => onSelectCategory(category)}
                size={isMobile ? "small" : "medium"}
                sx={{
                  borderRadius: '20px',
                  px: { xs: 1, sm: 1.5, md: 2 },
                  py: 0.75,
                  width: '100%',
                  maxWidth: { xs: '100%', sm: '130px' },
                  backgroundColor: currentCategory === category 
                    ? getCategoryColor(category) 
                    : isDarkMode 
                      ? 'rgba(255,255,255,0.05)' 
                      : 'rgba(0,0,0,0.05)',
                  borderColor: getCategoryColor(category),
                  borderWidth: '2px',
                  color: currentCategory === category 
                    ? 'white' 
                    : getCategoryColor(category),
                  fontWeight: 'bold',
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  boxShadow: currentCategory === category 
                    ? `0 4px 10px ${getCategoryColor(category)}66` 
                    : 'none',
                  '&:hover': {
                    backgroundColor: currentCategory === category 
                      ? getCategoryColor(category) 
                      : `${getCategoryColor(category)}22`,
                    boxShadow: `0 6px 12px ${getCategoryColor(category)}66`,
                    borderWidth: '2px',
                    borderColor: getCategoryColor(category),
                  }
                }}
              >
                {category === 'All' ? 'All' : `${category}`}
              </Button>
            </motion.div>
          ))}
        </Box>
      </Paper>
    </motion.div>
  );
}; 