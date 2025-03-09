import { Box, Typography, Grid, Paper, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { SkillCard } from './SkillCard';
import { Skill, SkillCategory } from '../../types';
import { FitnessCenter, Whatshot } from '@mui/icons-material';
import { useAppSelector } from '../../hooks';

interface SkillTreeProps {
  category?: SkillCategory | 'All';
}

export const SkillTree = ({ category = 'All' }: SkillTreeProps) => {
  const theme = useTheme();
  const skills = useAppSelector(state => state.skills.skills);
  
  // Get skills for the current category
  const currentSkills = category === 'All' 
    ? skills 
    : skills.filter(skill => skill.category === category);
  
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
  
  // Get category icon
  const getCategoryIcon = () => {
    return <FitnessCenter />;
  };
  
  // Group skills by category and level
  const skillsByCategory: Record<string, Skill[][]> = {};
  
  // Organize skills by category and level
  currentSkills.forEach(skill => {
    const category = skill.category;
    if (!skillsByCategory[category]) {
      skillsByCategory[category] = [];
    }
    
    if (!skillsByCategory[category][skill.level - 1]) {
      skillsByCategory[category][skill.level - 1] = [];
    }
    
    skillsByCategory[category][skill.level - 1].push(skill);
  });
  
  // Render a category section
  const renderCategorySection = (categoryName: string) => {
    // Skip if no skills in this category
    if (!skillsByCategory[categoryName] || skillsByCategory[categoryName].length === 0) {
      return null;
    }
    
    return (
      <motion.div
        key={`category-${categoryName}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            mb: 5, 
            borderRadius: 3,
            overflow: 'hidden',
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(135deg, #1E1E1E 0%, #121212 100%)' 
              : 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)',
            boxShadow: `0 8px 32px ${getCategoryColor(categoryName)}33`
          }}
        >
          <Box sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `linear-gradient(135deg, ${getCategoryColor(categoryName)} 0%, ${getCategoryColor(categoryName)}cc 100%)`,
                  color: 'white',
                  mr: 2,
                  boxShadow: `0 4px 10px ${getCategoryColor(categoryName)}66`
                }}
              >
                {getCategoryIcon()}
              </Box>
              <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', color: getCategoryColor(categoryName) }}>
                {categoryName} Skills
              </Typography>
            </Box>
            
            {skillsByCategory[categoryName].map((skills, levelIndex) => {
              if (!skills || skills.length === 0) return null;
              
              return (
                <Box key={`level-${categoryName}-${levelIndex}`} sx={{ mb: 5, position: 'relative' }}>
                  {/* Level connector line */}
                  {levelIndex > 0 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -40,
                        left: 25,
                        width: 4,
                        height: 40,
                        bgcolor: getCategoryColor(categoryName),
                        zIndex: 1
                      }}
                    />
                  )}
                  
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 3,
                      position: 'relative',
                      pt: 2,
                      pb: 1
                    }}
                  >
                    <Paper
                      elevation={3}
                      sx={{ 
                        width: 50, 
                        height: 50, 
                        borderRadius: '50%', 
                        bgcolor: getCategoryColor(categoryName),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: 20,
                        mr: 2,
                        boxShadow: `0 4px 10px ${getCategoryColor(categoryName)}66`,
                        border: '2px solid white',
                        zIndex: 2
                      }}
                    >
                      {levelIndex + 1}
                    </Paper>
                    
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        Level {levelIndex + 1}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {levelIndex === 0 ? 'Beginner' : levelIndex === 1 ? 'Intermediate' : levelIndex === 2 ? 'Advanced' : 'Expert'} skills
                      </Typography>
                    </Box>
                    
                    <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', mt: 2 }}>
                      <Whatshot sx={{ color: '#FF6D00', mr: 0.5 }} />
                      <Typography variant="body2" sx={{ fontWeight: 'medium', color: '#FF6D00' }}>
                        {(levelIndex + 1) * 100} XP per skill
                      </Typography>
                    </Box>
                  </Box>
                  
                  {/* Horizontal connector for skills */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 30,
                      left: 25,
                      height: 2,
                      bgcolor: getCategoryColor(categoryName),
                      zIndex: 1,
                      width: `calc(100% - 50px)`,
                      opacity: 0.5
                    }}
                  />
                  
                  <Grid container spacing={3} sx={{ position: 'relative', zIndex: 2, mt: 2 }}>
                    {skills.map((skill, index) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={`skill-${skill.id}`}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                        >
                          <SkillCard skill={skill} />
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              );
            })}
          </Box>
        </Paper>
      </motion.div>
    );
  };
  
  // Get categories to render
  const categoriesToRender = true 
    ? Object.keys(skillsByCategory) 
    : ['Push'];
  
  // Check if any categories are being displayed
  const hasVisibleCategories = categoriesToRender.some(cat => 
    skillsByCategory[cat] && skillsByCategory[cat].some(level => level && level.length > 0)
  );
  
  return (
    <Box>
      {/* Render each category section */}
      {categoriesToRender.map(cat => renderCategorySection(cat))}
      
      {/* Show empty state when no categories are visible */}
      {!hasVisibleCategories && (
        <Paper 
          elevation={3}
          sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center',
            height: 300,
            borderRadius: 3,
            p: 4,
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(135deg, #1E1E1E 0%, #121212 100%)'
              : 'linear-gradient(135deg, #F5F5F5 0%, #E0E0E0 100%)',
          }}
        >
          <FitnessCenter sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No skills found for {categoriesToRender[0] === 'All' ? 'any category' : `the ${categoriesToRender[0]} category`}
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center">
            Try selecting a different category
          </Typography>
        </Paper>
      )}
    </Box>
  );
}; 