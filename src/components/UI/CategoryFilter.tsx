import React from 'react';
import { Box, Button, Typography, Paper, useTheme, Stack } from '@mui/material';
import { 
  FitnessCenterOutlined, 
  FitnessCenterTwoTone,
  HomeOutlined,
  FitnessCenterRounded
} from '@mui/icons-material';
import { SkillCategory } from '../../types';

interface CategoryNavigationProps {
  onSelectCategory: (category: SkillCategory | 'All') => void;
  currentCategory: SkillCategory | 'All';
}

export const CategoryFilter: React.FC<CategoryNavigationProps> = ({ 
  onSelectCategory, 
  currentCategory 
}) => {
  const theme = useTheme();
  
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
    switch (category) {
      case 'Push':
        return <FitnessCenterTwoTone />;
      case 'Pull':
        return <FitnessCenterTwoTone />;
      case 'Legs':
        return <FitnessCenterTwoTone />;
      case 'Core':
        return <FitnessCenterTwoTone />;
      case 'All':
      default:
        return <HomeOutlined />;
    }
  };
  
  // Available categories
  const categories: Array<SkillCategory | 'All'> = ['All', 'Push', 'Pull', 'Legs', 'Core'];
  
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        mb: 4, 
        p: 3, 
        borderRadius: 3,
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #1E1E1E 0%, #121212 100%)' 
          : 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <FitnessCenterOutlined sx={{ mr: 1, color: theme.palette.primary.main }} />
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Skill Categories
        </Typography>
      </Box>
      
      <Typography variant="body1" sx={{ mb: 3, opacity: 0.8 }}>
        Select a category to view specific skills or view all skills together
      </Typography>
      
      <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
        {categories.map((category) => (
          <Button
            key={category}
            variant={currentCategory === category ? "contained" : "outlined"}
            startIcon={getCategoryIcon(category)}
            onClick={() => onSelectCategory(category)}
            sx={{
              borderRadius: '20px',
              px: 2,
              py: 1,
              backgroundColor: currentCategory === category ? getCategoryColor(category) : 'transparent',
              borderColor: getCategoryColor(category),
              color: currentCategory === category ? 'white' : getCategoryColor(category),
              '&:hover': {
                backgroundColor: currentCategory === category 
                  ? getCategoryColor(category) 
                  : `${getCategoryColor(category)}22`,
              }
            }}
          >
            {category === 'All' ? 'All Skills' : `${category} Skills`}
          </Button>
        ))}
      </Stack>
    </Paper>
  );
}; 