import { Box, Typography, Grid, Paper, useTheme, useMediaQuery } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { SkillCard } from './SkillCard';
import { Skill, SkillCategory } from '../../types';
import { FitnessCenter, Whatshot, ArrowDownward, ArrowForward } from '@mui/icons-material';
import { useAppSelector } from '../../hooks';
import { staggerContainer, fadeUp, fadeInScale } from '../../utils/animationVariants';

interface SkillTreeProps {
  category?: SkillCategory | 'All';
}

export const SkillTree = ({ category = 'All' }: SkillTreeProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
        variants={fadeInScale}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.5 }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            mb: 5, 
            borderRadius: '16px',
            overflow: 'hidden',
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(135deg, #1E1E1E 0%, #121212 100%)' 
              : 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)',
            boxShadow: `0 8px 32px ${getCategoryColor(categoryName)}33`,
            width: '100%',
            maxWidth: '100%'
          }}
        >
          <Box sx={{ 
            p: { xs: 2, sm: 3, md: 4 },
            width: '100%',
            maxWidth: '100%',
            overflowX: 'hidden'
          }}>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 3,
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? 2 : 0
              }}>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                >
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
                      mr: isMobile ? 0 : 2,
                      boxShadow: `0 4px 10px ${getCategoryColor(categoryName)}66`
                    }}
                  >
                    {getCategoryIcon()}
                  </Box>
                </motion.div>
                <Typography 
                  variant={isMobile ? "h5" : "h4"} 
                  component="h2" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: getCategoryColor(categoryName),
                    textAlign: isMobile ? 'center' : 'left'
                  }}
                >
                  {categoryName} Skills
                </Typography>
              </Box>
            </motion.div>
            
            {skillsByCategory[categoryName].map((skills, levelIndex) => {
              if (!skills || skills.length === 0) return null;
              
              // Determine if this is the last level
              const isLastLevel = levelIndex === skillsByCategory[categoryName].length - 1;
              
              return (
                <Box sx={{ 
                  mb: 5, 
                  position: 'relative',
                  width: '100%',
                  maxWidth: '100%'
                }} key={`level-${categoryName}-${levelIndex}`}>
                  <motion.div
                    variants={staggerContainer(0.1, levelIndex * 0.2)}
                    initial="hidden"
                    animate="show"
                  >
                    {/* Level connector line */}
                    {levelIndex > 0 && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 40 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            top: -40,
                            left: 25,
                            width: 4,
                            bgcolor: getCategoryColor(categoryName),
                            zIndex: 1
                          }}
                        />
                      </motion.div>
                    )}
                    
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 3,
                        position: 'relative',
                        pt: 2,
                        pb: 1,
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: isMobile ? 2 : 0,
                        width: '100%'
                      }}
                    >
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        width: isMobile ? '100%' : 'auto',
                        justifyContent: isMobile ? 'center' : 'flex-start'
                      }}>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ 
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            delay: 0.1
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
                        </motion.div>
                        
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          <Box sx={{ mt: 0 }}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                              Level {levelIndex + 1}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {levelIndex === 0 ? 'Beginner' : levelIndex === 1 ? 'Intermediate' : levelIndex === 2 ? 'Advanced' : 'Expert'} skills
                            </Typography>
                          </Box>
                        </motion.div>
                      </Box>
                      
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        style={{ 
                          marginLeft: isMobile ? 0 : 'auto',
                          textAlign: isMobile ? 'center' : 'right'
                        }}
                      >
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          mt: isMobile ? 0 : 2,
                          justifyContent: isMobile ? 'center' : 'flex-end'
                        }}>
                          <Whatshot sx={{ color: '#FF6D00', mr: 0.5 }} />
                          <Typography variant="body2" sx={{ fontWeight: 'medium', color: '#FF6D00' }}>
                            {(levelIndex + 1) * 100} XP per skill
                          </Typography>
                        </Box>
                      </motion.div>
                    </Box>
                    
                    {/* Horizontal connector for skills */}
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: isMobile ? '100%' : 'calc(100% - 50px)' }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          top: isMobile ? 60 : 30,
                          left: isMobile ? 0 : 25,
                          height: 2,
                          bgcolor: getCategoryColor(categoryName),
                          zIndex: 1,
                          opacity: 0.5
                        }}
                      />
                    </motion.div>
                    
                    <Grid 
                      container 
                      spacing={{ xs: 2, sm: 3 }} 
                      sx={{ 
                        position: 'relative', 
                        zIndex: 2, 
                        mt: 2,
                        width: '100%',
                        mx: 0
                      }}
                    >
                      <AnimatePresence>
                        {skills.map((skill, index) => (
                          <Grid item xs={12} sm={6} md={4} lg={3} key={`skill-${skill.id}`}>
                            <motion.div
                              variants={fadeUp}
                              transition={{ delay: index * 0.1 }}
                            >
                              <SkillCard skill={skill} />
                            </motion.div>
                          </Grid>
                        ))}
                      </AnimatePresence>
                    </Grid>
                    
                    {/* Next level arrow indicator - only show if not the last level */}
                    {!isLastLevel && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          marginTop: '2rem',
                          marginBottom: '1rem',
                          width: '100%'
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            p: 2,
                            borderRadius: 2,
                            bgcolor: `${getCategoryColor(categoryName)}15`,
                            border: `1px dashed ${getCategoryColor(categoryName)}`,
                            maxWidth: { xs: '100%', sm: '80%', md: '60%' },
                            mx: 'auto',
                            width: '100%'
                          }}
                        >
                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ 
                              mb: 1, 
                              fontWeight: 'medium',
                              textAlign: 'center'
                            }}
                          >
                            Complete these skills to unlock Level {levelIndex + 2}
                          </Typography>
                          <motion.div
                            animate={{ y: [0, 5, 0] }}
                            transition={{ 
                              repeat: Infinity, 
                              duration: 1.5,
                              repeatType: "reverse" as const
                            }}
                          >
                            {isMobile ? (
                              <ArrowDownward 
                                sx={{ 
                                  color: getCategoryColor(categoryName),
                                  fontSize: 30
                                }} 
                              />
                            ) : (
                              <ArrowForward 
                                sx={{ 
                                  color: getCategoryColor(categoryName),
                                  fontSize: 30
                                }} 
                              />
                            )}
                          </motion.div>
                        </Box>
                      </motion.div>
                    )}
                  </motion.div>
                </Box>
              );
            })}
          </Box>
        </Paper>
      </motion.div>
    );
  };
  
  // Get categories to render
  const categoriesToRender = category === 'All' 
    ? Object.keys(skillsByCategory) 
    : [category];
  
  // Check if any categories are being displayed
  const hasVisibleCategories = categoriesToRender.some(cat => 
    skillsByCategory[cat] && skillsByCategory[cat].some(level => level && level.length > 0)
  );
  
  return (
    <Box sx={{ 
      px: { xs: 1, sm: 2, md: 3 },
      width: '100%',
      maxWidth: '100%',
      overflowX: 'hidden'
    }}>
      {/* Render each category section */}
      <motion.div
        variants={staggerContainer(0.3)}
        initial="hidden"
        animate="show"
      >
        {categoriesToRender.map(cat => renderCategorySection(cat))}
      </motion.div>
      
      {/* Show empty state when no categories are visible */}
      <AnimatePresence>
        {!hasVisibleCategories && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Paper 
              elevation={3}
              sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center',
                height: 300,
                borderRadius: '16px',
                p: 4,
                background: theme.palette.mode === 'dark' 
                  ? 'linear-gradient(135deg, #1E1E1E 0%, #121212 100%)'
                  : 'linear-gradient(135deg, #F5F5F5 0%, #E0E0E0 100%)',
                width: '100%'
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.05)',
                    mb: 2
                  }}
                >
                  <FitnessCenter sx={{ fontSize: 40, color: 'text.secondary', opacity: 0.5 }} />
                </Box>
              </motion.div>
              <Typography variant="h5" color="text.secondary" gutterBottom>
                No skills found for {categoriesToRender[0] === 'All' ? 'any category' : `the ${categoriesToRender[0]} category`}
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                Try selecting a different category
              </Typography>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}; 