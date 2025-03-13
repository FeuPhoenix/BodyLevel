import { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../hooks';
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
} from '@mui/material';
import {
  FitnessCenterRounded,
  LockOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  Close,
  ArrowForward,
  ArrowBack,
} from '@mui/icons-material';

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

  // Render the skill tree
  return (
    <Box sx={{ mt: 2, mb: 8, position: 'relative', height: 'calc(100vh - 150px)' }}>
      <Paper 
        elevation={2} 
        sx={{ 
          p: { xs: 1, sm: 3 }, 
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 2,
          height: '100%',
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mb: 2, 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1
        }}>
          <Typography variant="h5" fontWeight="bold">
            Skill Tree
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<ArrowBack />}
              onClick={handleForceNavigateHome}
              sx={{ mr: 1 }}
            >
              Back to Home
            </Button>
            <Button 
              variant="outlined" 
              size="small" 
              onClick={handleResetView}
            >
              Reset View
            </Button>
          </Box>
        </Box>

        {/* Emergency message */}
        <Box sx={{ 
          mb: 2, 
          p: 1, 
          bgcolor: 'info.light', 
          color: 'info.contrastText',
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Typography variant="body2">
            If you get stuck, click the home button or press ESC to return to home.
          </Typography>
        </Box>

        {/* Category Legend */}
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 1, 
          mb: 2,
          overflowX: 'auto',
          pb: 1
        }}>
          {Object.keys(CATEGORY_COLORS).map(category => (
            <Chip
              key={category}
              label={category}
              sx={{
                bgcolor: CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS],
                color: 'white',
                fontWeight: 'bold',
              }}
            />
          ))}
        </Box>

        {/* Loading indicator if data is not ready */}
        {(Object.keys(nodePositions).length === 0 || Object.keys(organizedSkills).length === 0) && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '50%' 
          }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ ml: 2 }}>
              Loading skill tree...
            </Typography>
          </Box>
        )}

        {/* Skill Tree Container */}
        {Object.keys(nodePositions).length > 0 && (
          <Box 
            ref={containerRef}
            sx={{ 
              position: 'relative', 
              width: '100%', 
              height: 'calc(100% - 120px)',
              overflow: 'hidden',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 1,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)',
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
            onWheel={(e) => {
              e.preventDefault();
              const delta = e.deltaY > 0 ? -0.1 : 0.1;
              setZoomLevel(prev => Math.max(0.5, Math.min(2, prev + delta)));
            }}
            onMouseDown={(e) => {
              if (e.button === 0) { // Left mouse button
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
            onTouchStart={(e) => {
              e.preventDefault();
              setIsDragging(true);
              setDragStart({ 
                x: e.touches[0].clientX, 
                y: e.touches[0].clientY 
              });
            }}
            onTouchMove={(e) => {
              if (isDragging) {
                const dx = e.touches[0].clientX - dragStart.x;
                const dy = e.touches[0].clientY - dragStart.y;
                setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
                setDragStart({ 
                  x: e.touches[0].clientX, 
                  y: e.touches[0].clientY 
                });
              }
            }}
            onTouchEnd={() => setIsDragging(false)}
          >
            {/* SVG for skill tree */}
            <svg
              ref={svgRef}
              width="100%"
              height="100%"
              viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
              style={{
                transform: `scale(${zoomLevel}) translate(${pan.x}px, ${pan.y}px)`,
                transformOrigin: '0 0',
                transition: isDragging ? 'none' : 'transform 0.1s ease-out',
              }}
            >
              {/* Category Labels */}
              {Object.keys(organizedSkills).map((category) => (
                <g key={`category-${category}`}>
                  <text
                    x={categoryTitlePositions[category] || 0}
                    y={80}
                    textAnchor="middle"
                    fill={theme.palette.text.primary}
                    fontWeight="bold"
                    fontSize="18"
                  >
                    {category}
                  </text>
                  <line
                    x1={categoryTitlePositions[category] - 100 || 0}
                    y1={90}
                    x2={categoryTitlePositions[category] + 100 || 0}
                    y2={90}
                    stroke={CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS]}
                    strokeWidth="3"
                  />
                </g>
              ))}

              {/* Level Labels */}
              {(() => {
                // Find the maximum level across all categories
                const maxLevel = Math.max(
                  ...Object.values(organizedSkills).flatMap(category => 
                    Object.keys(category).map(Number)
                  ), 0
                );
                
                // Create level labels
                return Array.from({ length: maxLevel }, (_, i) => i + 1).map(level => (
                  <text
                    key={`level-${level}`}
                    x={20}
                    y={level * VERTICAL_SPACING + 150}
                    textAnchor="start"
                    fill={theme.palette.text.secondary}
                    fontSize="14"
                    fontWeight="bold"
                  >
                    Level {level}
                  </text>
                ));
              })()}

              {/* Connections between skills */}
              {connections.map((connection, index) => {
                // Calculate control points for curved lines
                const dx = connection.toX - connection.fromX;
                const dy = connection.toY - connection.fromY;
                const controlX = connection.fromX + dx / 2;
                const controlY = connection.fromY + dy / 2;
                
                return (
                  <g key={`connection-${index}`}>
                    <path
                      d={`M ${connection.fromX} ${connection.fromY} Q ${controlX} ${controlY} ${connection.toX} ${connection.toY}`}
                      fill="none"
                      stroke={theme.palette.divider}
                      strokeWidth="2"
                      strokeDasharray="none"
                      markerEnd="url(#arrowhead)"
                    />
                    <defs>
                      <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                      >
                        <polygon
                          points="0 0, 10 3.5, 0 7"
                          fill={theme.palette.divider}
                        />
                      </marker>
                    </defs>
                  </g>
                );
              })}

              {/* Skill nodes */}
              {skills.map(skill => {
                const position = nodePositions[skill.id];
                if (!position) return null;
                
                const categoryColor = CATEGORY_COLORS[skill.category as keyof typeof CATEGORY_COLORS];
                
                return (
                  <g
                    key={`skill-${skill.id}`}
                    transform={`translate(${position.x}, ${position.y})`}
                    onClick={() => handleSkillClick(skill)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Node background */}
                    <rect
                      x="0"
                      y="0"
                      width={NODE_SIZE}
                      height={NODE_SIZE}
                      rx="10"
                      ry="10"
                      fill={theme.palette.background.paper}
                      stroke={categoryColor}
                      strokeWidth="3"
                      filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.2))"
                    />
                    
                    {/* Status indicator */}
                    {skill.status === 'completed' && (
                      <circle
                        cx={NODE_SIZE - 10}
                        cy="10"
                        r="8"
                        fill="#4caf50"
                      />
                    )}
                    {skill.status === 'in-progress' && (
                      <circle
                        cx={NODE_SIZE - 10}
                        cy="10"
                        r="8"
                        fill="#ff9800"
                      />
                    )}
                    {skill.status === 'locked' && (
                      <circle
                        cx={NODE_SIZE - 10}
                        cy="10"
                        r="8"
                        fill="#f44336"
                      />
                    )}
                    
                    {/* Skill icon */}
                    <svg
                      x={(NODE_SIZE - 40) / 2}
                      y={(NODE_SIZE - 40) / 2 - 15}
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                    >
                      {skill.status === 'locked' ? (
                        <LockOutlined style={{ width: '100%', height: '100%', color: '#aaa' }} />
                      ) : skill.status === 'completed' ? (
                        <CheckCircleOutlined style={{ width: '100%', height: '100%', color: '#4caf50' }} />
                      ) : (
                        <FitnessCenterRounded style={{ width: '100%', height: '100%', color: categoryColor }} />
                      )}
                    </svg>
                    
                    {/* Background for text to ensure readability */}
                    <rect
                      x="5"
                      y={NODE_SIZE - 35}
                      width={NODE_SIZE - 10}
                      height="30"
                      rx="4"
                      ry="4"
                      fill={theme.palette.background.paper}
                      opacity="0.8"
                    />
                    
                    {/* Skill name */}
                    <text
                      x={NODE_SIZE / 2}
                      y={NODE_SIZE - 20}
                      textAnchor="middle"
                      fill={theme.palette.text.primary}
                      fontSize="11"
                      fontWeight="bold"
                      style={{
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        maxWidth: `${NODE_SIZE - 10}px`,
                      }}
                    >
                      {skill.title.length > 12 ? `${skill.title.substring(0, 10)}...` : skill.title}
                    </text>
                    
                    {/* Level indicator */}
                    <text
                      x={NODE_SIZE / 2}
                      y={NODE_SIZE - 5}
                      textAnchor="middle"
                      fill={theme.palette.text.secondary}
                      fontSize="10"
                    >
                      Level {skill.level}
                    </text>
                  </g>
                );
              })}
            </svg>
          </Box>
        )}

        {/* Zoom level indicator */}
        <Box 
          sx={{ 
            position: 'absolute', 
            bottom: 20, 
            left: 20,
            bgcolor: 'background.paper',
            p: 1,
            borderRadius: 1,
            boxShadow: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexWrap: 'wrap',
            maxWidth: { xs: '120px', sm: 'auto' }
          }}
        >
          <Typography variant="body2" fontWeight="bold">
            Zoom: {Math.round(zoomLevel * 100)}%
          </Typography>
          <Slider
            value={zoomLevel * 100}
            min={50}
            max={200}
            step={10}
            onChange={(_, value) => setZoomLevel(Number(value) / 100)}
            sx={{ width: { xs: '100%', sm: 100 }, ml: { xs: 0, sm: 1 } }}
            size="small"
          />
        </Box>
      </Paper>

      {/* Skill detail dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        {selectedSkill && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight="bold">
                  {selectedSkill.title}
                </Typography>
                <IconButton onClick={handleCloseDialog} size="small">
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={selectedSkill.category}
                      sx={{
                        bgcolor: CATEGORY_COLORS[selectedSkill.category as keyof typeof CATEGORY_COLORS],
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    />
                    <Chip
                      label={`Level ${selectedSkill.level}`}
                      variant="outlined"
                      size="small"
                    />
                    <Chip
                      label={selectedSkill.status}
                      color={
                        selectedSkill.status === 'completed'
                          ? 'success'
                          : selectedSkill.status === 'in-progress'
                          ? 'warning'
                          : 'error'
                      }
                      size="small"
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="body1" paragraph>
                    {selectedSkill.description}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Requirements
                  </Typography>
                  <Typography variant="body2">
                    {selectedSkill.requirements_sets} sets of {selectedSkill.requirements_reps} reps
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {selectedSkill.requirements_description}
                  </Typography>
                </Grid>
                
                {selectedSkill.prerequisites?.length > 0 && (
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Prerequisites
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedSkill.prerequisites.map((prereqId: string) => {
                        const prereq = skills.find(s => s.id === prereqId);
                        return prereq ? (
                          <Chip
                            key={prereq.id}
                            label={prereq.title}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        ) : null;
                      })}
                    </Box>
                  </Grid>
                )}
                
                {selectedSkill.video_url && (
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                    <Button
                      variant="outlined"
                      startIcon={<PlayCircleOutlined />}
                      fullWidth
                    >
                      Watch Tutorial Video
                    </Button>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              {selectedSkill.status !== 'completed' && (
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<ArrowForward />}
                  disabled={selectedSkill.status === 'locked'}
                >
                  {selectedSkill.status === 'locked'
                    ? 'Locked'
                    : selectedSkill.status === 'in-progress'
                    ? 'Continue Training'
                    : 'Start Training'}
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}; 