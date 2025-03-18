import { useEffect, useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { Navigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  useTheme,
  CircularProgress,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Grid,
  Divider,
  Slider,
  Container,
  Alert,
} from '@mui/material';
import {
  FitnessCenterRounded,
  LockOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  Close,
  ArrowForward,
  ArrowBack,
  Refresh,
} from '@mui/icons-material';
import { syncAdminSkills } from '../../features/skills/skillsSlice';

// Define the node size and spacing
const NODE_SIZE = 100;
const VERTICAL_SPACING = 180;

// Define the skill categories and their colors
const CATEGORY_COLORS = {
  Push: '#f44336', // Red
  Pull: '#2196f3', // Blue
  Legs: '#4caf50', // Green
  Core: '#ff9800', // Orange
};

// No longer needed since we have handleForceNavigateHome
// const forceNavigateHome = () => {
//   window.location.href = '/';
// };

export const SkillTreeVisualization = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const skills = useAppSelector(state => state.skills.skills);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [svgDimensions, setSvgDimensions] = useState({ width: 1000, height: 800 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [redirectToHome, setRedirectToHome] = useState(false);
  const [categoryTitlePositions, setCategoryTitlePositions] = useState<Record<string, number>>({});
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});
  const [connections, setConnections] = useState<{ from: string; to: string; fromX: number; fromY: number; toX: number; toY: number }[]>([]);
  const [organizedSkills, setOrganizedSkills] = useState<Record<string, Record<number, any[]>>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Sync skills data on component mount
  useEffect(() => {
    console.log("SkillTreeVisualization - Syncing skills data");
    setIsLoading(true);
    
    // Load fresh skills data
    dispatch(syncAdminSkills());
    
    // Set loading to false after a short delay
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [dispatch]);

  // Update forceNavigateHome to use setRedirectToHome
  const handleForceNavigateHome = () => {
    setRedirectToHome(true);
  };

  // If redirectToHome is true, navigate to home
  if (redirectToHome) {
    return <Navigate to="/" replace />;
  }

  // Group skills by category and level
  useEffect(() => {
    if (!skills || skills.length === 0) return;
    
    console.log("Organizing skills:", skills.length, "skills");
    
    const organizeSkillsData = () => {
      // First group by category
      const byCategory: Record<string, any[]> = {};
      
      // Initialize categories
      Object.keys(CATEGORY_COLORS).forEach(category => {
        byCategory[category] = [];
      });
      
      // Add skills to their categories
      skills.forEach(skill => {
        if (byCategory[skill.category]) {
          byCategory[skill.category].push(skill);
        }
      });
      
      // Then organize by level within each category
      const organized: Record<string, Record<number, any[]>> = {};
      
      Object.keys(byCategory).forEach(category => {
        organized[category] = {};
        
        // Group skills by level
        byCategory[category].forEach(skill => {
          if (!organized[category][skill.level]) {
            organized[category][skill.level] = [];
          }
          organized[category][skill.level].push(skill);
        });
      });
      
      console.log("Organized skills:", organized);
      setOrganizedSkills(organized);
    };

    organizeSkillsData();
  }, [skills]);

  // Calculate the positions of each skill node
  useEffect(() => {
    if (Object.keys(organizedSkills).length === 0) return;

    const calculateNodePositionsData = () => {
      const positions: Record<string, { x: number; y: number }> = {};
      const categories = Object.keys(organizedSkills);
      
      // Calculate the maximum number of skills in any level for each category
      const maxSkillsPerLevel: Record<string, number> = {};
      
      categories.forEach(category => {
        const levels = Object.keys(organizedSkills[category]).map(Number);
        levels.forEach(level => {
          const skillsInLevel = organizedSkills[category][level];
          if (!maxSkillsPerLevel[category] || skillsInLevel.length > maxSkillsPerLevel[category]) {
            maxSkillsPerLevel[category] = skillsInLevel.length;
          }
        });
      });
      
      // Calculate the width needed for each category based on the maximum number of skills
      const categoryWidths: Record<string, number> = {};
      categories.forEach(category => {
        categoryWidths[category] = Math.max(1, maxSkillsPerLevel[category]) * (NODE_SIZE + 40);
      });
      
      // Calculate the total width needed and the starting position for each category
      let totalWidth = 0;
      const categoryStartX: Record<string, number> = {};
      const categoryTitleX: Record<string, number> = {};
      
      categories.forEach(category => {
        categoryStartX[category] = totalWidth + 150; // Add some padding
        // Center the category title above the skills
        categoryTitleX[category] = categoryStartX[category] + categoryWidths[category] / 2;
        totalWidth += categoryWidths[category] + 150; // Add spacing between categories
      });
      
      // Position each skill
      categories.forEach(category => {
        const levels = Object.keys(organizedSkills[category]).map(Number).sort((a, b) => a - b);
        
        levels.forEach((level, levelIndex) => {
          const skillsInLevel = organizedSkills[category][level];
          const categoryWidth = categoryWidths[category];
          const startX = categoryStartX[category];
          
          // Calculate the total width needed for this level
          const levelWidth = skillsInLevel.length * (NODE_SIZE + 20);
          // Calculate the starting X position to center the skills in this level
          const levelStartX = startX + (categoryWidth - levelWidth) / 2;
          
          skillsInLevel.forEach((skill, skillIndex) => {
            // Position horizontally within the category, centered for the level
            const x = levelStartX + skillIndex * (NODE_SIZE + 20);
            
            // Position vertically by level
            const y = levelIndex * VERTICAL_SPACING + 150; // Increased from 100 to 150 to give more space for titles
            
            positions[skill.id] = { x, y };
          });
        });
      });
      
      // Store category title positions for rendering
      setCategoryTitlePositions(categoryTitleX);
      
      // Calculate the SVG dimensions based on node positions
      if (Object.keys(positions).length > 0) {
        const maxX = Math.max(...Object.values(positions).map(pos => pos.x)) + NODE_SIZE + 100;
        const maxY = Math.max(...Object.values(positions).map(pos => pos.y)) + NODE_SIZE + 100;
        setSvgDimensions({ width: Math.max(maxX, 1000), height: Math.max(maxY, 800) });
      }
      
      return positions;
    };

    const positions = calculateNodePositionsData();
    setNodePositions(positions);
  }, [organizedSkills]);

  // Calculate the connections between skills based on prerequisites
  useEffect(() => {
    if (Object.keys(nodePositions).length === 0) return;

    const calculateConnectionsData = () => {
      const connectionsData: { from: string; to: string; fromX: number; fromY: number; toX: number; toY: number }[] = [];
      
      skills.forEach(skill => {
        if (!skill.prerequisites || skill.prerequisites.length === 0) return;
        
        skill.prerequisites.forEach(prereqId => {
          const prereq = skills.find(s => s.id === prereqId);
          
          if (prereq && nodePositions[prereq.id] && nodePositions[skill.id]) {
            connectionsData.push({
              from: prereq.id,
              to: skill.id,
              fromX: nodePositions[prereq.id].x + NODE_SIZE / 2,
              fromY: nodePositions[prereq.id].y + NODE_SIZE / 2,
              toX: nodePositions[skill.id].x + NODE_SIZE / 2,
              toY: nodePositions[skill.id].y + NODE_SIZE / 2,
            });
          }
        });
      });
      
      return connectionsData;
    };

    const connectionsData = calculateConnectionsData();
    setConnections(connectionsData);
  }, [nodePositions, skills]);

  // Handle skill node click
  const handleSkillClick = (skill: any) => {
    setSelectedSkill(skill);
    setDialogOpen(true);
  };

  // Close the skill detail dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // Reset zoom and pan
  const handleResetView = () => {
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  };

  // Render the skill tree visualization
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: 'calc(100vh - 64px)',
        py: 4,
        px: { xs: 2, md: 4 }
      }}
    >
      <Container maxWidth="xl">
        <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" component="h1" gutterBottom>
            Skill Tree
          </Typography>
          
          <Box>
            <Button 
              startIcon={<Refresh />} 
              onClick={() => {
                setIsLoading(true);
                dispatch(syncAdminSkills());
                setTimeout(() => setIsLoading(false), 500);
              }}
              variant="outlined"
              sx={{ mr: 2 }}
            >
              Refresh Skills
            </Button>
            <Button
              variant="outlined"
              onClick={handleResetView}
            >
              Reset View
            </Button>
          </Box>
        </Box>
        
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
            <CircularProgress size={60} />
            <Typography variant="h6" ml={2}>Loading skill tree...</Typography>
          </Box>
        ) : skills.length === 0 ? (
          <Alert severity="info" sx={{ mb: 4 }}>
            <Typography variant="h6">No skills found</Typography>
            <Typography>There are no skills available in the skill tree. Try refreshing or contact an administrator.</Typography>
          </Alert>
        ) : Object.keys(organizedSkills).length === 0 ? (
          <Alert severity="warning" sx={{ mb: 4 }}>
            <Typography variant="h6">Could not organize skills</Typography>
            <Typography>The skills could not be properly organized by category. Try refreshing the page.</Typography>
          </Alert>
        ) : (
          <>
            <Paper
              ref={containerRef}
              elevation={3}
              sx={{
                width: '100%',
                height: '70vh',
                overflow: 'hidden',
                position: 'relative',
                borderRadius: 2,
                boxShadow: theme.shadows[5],
                mb: 2
              }}
              onMouseDown={(e) => {
                if (e.button === 0) {
                  setIsDragging(true);
                  setDragStart({ x: e.clientX, y: e.clientY });
                }
              }}
              onMouseMove={(e) => {
                if (isDragging) {
                  const dx = e.clientX - dragStart.x;
                  const dy = e.clientY - dragStart.y;
                  setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
                  setDragStart({ x: e.clientX, y: e.clientY });
                }
              }}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            >
              <svg
                ref={svgRef}
                width={svgDimensions.width}
                height={svgDimensions.height}
                viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
                style={{
                  transform: `scale(${zoomLevel}) translate(${pan.x}px, ${pan.y}px)`,
                  transformOrigin: '0 0',
                  transition: 'transform 0.1s ease-out'
                }}
              >
                {/* Category titles */}
                {Object.entries(categoryTitlePositions).map(([category, x]) => (
                  <g key={`category-${category}`} transform={`translate(${x}, 60)`}>
                    <text
                      x={0}
                      y={0}
                      fontSize="20"
                      fontWeight="bold"
                      textAnchor="middle"
                      fill={CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS]}
                    >
                      {category}
                    </text>
                  </g>
                ))}
                
                {/* Connection lines */}
                {connections.map((conn, i) => (
                  <g key={`connection-${i}`}>
                    <line
                      x1={conn.fromX}
                      y1={conn.fromY}
                      x2={conn.toX}
                      y2={conn.toY}
                      stroke={theme.palette.divider}
                      strokeWidth="2"
                      strokeDasharray={conn.from.includes('locked') ? '5,5' : ''}
                    />
                    {/* Arrow */}
                    <polygon
                      points={`${conn.toX - 5},${conn.toY} ${conn.toX},${conn.toY - 5} ${conn.toX + 5},${conn.toY}`}
                      fill={theme.palette.divider}
                      transform={`rotate(90, ${conn.toX}, ${conn.toY})`}
                    />
                  </g>
                ))}
                
                {/* Skill nodes */}
                {Object.entries(nodePositions).map(([skillId, position]) => {
                  const skill = skills.find(s => s.id === skillId);
                  if (!skill) return null;
                  
                  const statusIcon = () => {
                    switch (skill.status) {
                      case 'locked':
                        return <LockOutlined style={{ fontSize: 24, color: 'white' }} />;
                      case 'unlocked':
                        return <FitnessCenterRounded style={{ fontSize: 24, color: 'white' }} />;
                      case 'in-progress':
                        return <PlayCircleOutlined style={{ fontSize: 24, color: 'white' }} />;
                      case 'completed':
                        return <CheckCircleOutlined style={{ fontSize: 24, color: 'white' }} />;
                      default:
                        return <FitnessCenterRounded style={{ fontSize: 24, color: 'white' }} />;
                    }
                  };
                  
                  const categoryColor = CATEGORY_COLORS[skill.category as keyof typeof CATEGORY_COLORS];
                  
                  return (
                    <g
                      key={`skill-${skillId}`}
                      transform={`translate(${position.x - NODE_SIZE / 2}, ${position.y - NODE_SIZE / 2})`}
                      onClick={() => handleSkillClick(skill)}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* Skill node background */}
                      <rect
                        width={NODE_SIZE}
                        height={NODE_SIZE}
                        rx={10}
                        ry={10}
                        fill={skill.status === 'locked' ? '#757575' : categoryColor}
                        opacity={skill.status === 'locked' ? 0.7 : 1}
                        stroke={skill.status === 'completed' ? theme.palette.success.main : 'none'}
                        strokeWidth={skill.status === 'completed' ? 3 : 0}
                      />
                      
                      {/* Skill icon */}
                      <foreignObject width={NODE_SIZE} height={NODE_SIZE / 2} y={10}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            height: '100%'
                          }}
                        >
                          {statusIcon()}
                        </Box>
                      </foreignObject>
                      
                      {/* Skill title */}
                      <foreignObject width={NODE_SIZE} height={NODE_SIZE / 2} y={NODE_SIZE / 2}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            height: '100%',
                            px: 1
                          }}
                        >
                          <Typography
                            variant="caption"
                            align="center"
                            sx={{
                              color: 'white',
                              fontWeight: 'bold',
                              wordBreak: 'break-word',
                              textShadow: '0px 1px 2px rgba(0,0,0,0.5)'
                            }}
                          >
                            {skill.title}
                          </Typography>
                        </Box>
                      </foreignObject>
                    </g>
                  );
                })}
              </svg>
            </Paper>
            
            {/* Zoom controls */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="body2" sx={{ mr: 2 }}>Zoom:</Typography>
              <Slider
                value={zoomLevel}
                min={0.5}
                max={2}
                step={0.1}
                onChange={(_, value) => setZoomLevel(value as number)}
                sx={{ width: 200 }}
                valueLabelDisplay="auto"
                valueLabelFormat={value => `${Math.round(value * 100)}%`}
              />
            </Box>
            
            {/* Skill details dialog */}
            {selectedSkill && (
              <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
              >
                <DialogTitle sx={{ 
                  backgroundColor: CATEGORY_COLORS[selectedSkill.category as keyof typeof CATEGORY_COLORS],
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  {selectedSkill.title}
                  <IconButton
                    edge="end"
                    color="inherit"
                    onClick={handleCloseDialog}
                    aria-label="close"
                  >
                    <Close />
                  </IconButton>
                </DialogTitle>
                
                <DialogContent sx={{ py: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Chip
                        label={selectedSkill.category}
                        sx={{
                          backgroundColor: CATEGORY_COLORS[selectedSkill.category as keyof typeof CATEGORY_COLORS],
                          color: 'white',
                          mr: 1,
                          mb: 1
                        }}
                      />
                      <Chip
                        label={`Level ${selectedSkill.level}`}
                        color="secondary"
                        sx={{ mr: 1, mb: 1 }}
                      />
                      <Chip
                        label={selectedSkill.status.replace('-', ' ')}
                        color={
                          selectedSkill.status === 'completed'
                            ? 'success'
                            : selectedSkill.status === 'in-progress'
                            ? 'warning'
                            : selectedSkill.status === 'unlocked'
                            ? 'info'
                            : 'default'
                        }
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="body1">{selectedSkill.description}</Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="subtitle1" fontWeight="bold">Requirements:</Typography>
                      <Typography variant="body2">
                        {selectedSkill.requirements.description}
                      </Typography>
                    </Grid>
                    
                    {selectedSkill.formTips && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 1 }}>Form Tips:</Typography>
                        <ul style={{ marginTop: 0, paddingLeft: 20 }}>
                          {selectedSkill.formTips.map((tip: string, i: number) => (
                            <li key={i}>
                              <Typography variant="body2">{tip}</Typography>
                            </li>
                          ))}
                        </ul>
                      </Grid>
                    )}
                    
                    {selectedSkill.prerequisites.length > 0 && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 1 }}>Prerequisites:</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                          {selectedSkill.prerequisites.map((preId: string) => {
                            const preSkill = skills.find(s => s.id === preId);
                            return preSkill ? (
                              <Chip
                                key={preId}
                                label={preSkill.title}
                                size="small"
                                sx={{
                                  backgroundColor: CATEGORY_COLORS[preSkill.category as keyof typeof CATEGORY_COLORS],
                                  color: 'white',
                                  opacity: 0.8
                                }}
                              />
                            ) : null;
                          })}
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </DialogContent>
                
                <DialogActions>
                  <Button onClick={handleCloseDialog}>Close</Button>
                </DialogActions>
              </Dialog>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}; 