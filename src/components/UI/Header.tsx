import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  useTheme, 
  Container,
  Avatar,
  Badge,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  ListItemButton,
  Chip,
  SwipeableDrawer
} from '@mui/material';
import { Link as RouterLink, useNavigate, Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { ProgressReset } from './ProgressReset';
import { useAppSelector } from '../../hooks';
import { useAuth } from '../../hooks/useAuth';
import { 
  FitnessCenterRounded, 
  EmojiEvents, 
  Whatshot,
  AccountCircle,
  Logout,
  Person,
  Menu as MenuIcon,
  Dashboard,
  Settings,
  Home,
  AdminPanelSettings,
  Psychology,
  ArrowBack,
  Close
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { slideInLeft, slideInRight } from '../../utils/animationVariants';

export const Header: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const skills = useAppSelector(state => state.skills.skills);
  const { isAuthenticated, user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // Calculate total XP and level
  const completedSkills = skills.filter(skill => skill.status === 'completed');
  const totalXP = completedSkills.reduce((total, skill) => total + (skill.level * 100), 0);
  const level = Math.floor(totalXP / 500) + 1;

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    if (isMobile) {
      // On mobile, just open the drawer instead of the menu
      toggleMobileMenu();
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    setMobileMenuOpen(false);
    logout();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // Get current path to show back button on Skills page
  const currentPath = location.pathname;
  const isSkillsPage = currentPath === '/skills';
  const isAdminPage = currentPath === '/admin';
  const isProfilePage = currentPath === '/profile';
  
  // Determine if we should show a back button
  const shouldShowBackButton = isSkillsPage || isAdminPage || isProfilePage;
  
  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(90deg, #121212 0%, #1E1E1E 100%)'
          : 'linear-gradient(90deg, #FFFFFF 0%, #F5F5F5 100%)',
        borderBottom: `1px solid ${theme.palette.divider}`,
        zIndex: theme.zIndex.drawer + 1
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ py: 1, px: { xs: 1, sm: 2 } }}>
          {/* Mobile menu button */}
          {isMobile && isAuthenticated && !shouldShowBackButton && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleMobileMenu}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          {/* Back button for special pages */}
          {shouldShowBackButton && (
            <IconButton
              color="inherit"
              aria-label="back to home"
              edge="start"
              component={Link}
              to="/"
              sx={{ mr: 1 }}
            >
              <ArrowBack />
            </IconButton>
          )}
          
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            animate="show"
          >
            <Box 
              component={Link} 
              to="/" 
              display="flex" 
              alignItems="center"
              sx={{ textDecoration: 'none' }}
              onClick={() => {
                handleMenuClose();
                setMobileMenuOpen(false);
              }}
            >
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
                  mr: 2,
                  fontSize: { xs: '1.2rem', sm: '1.5rem' }
                }}
              >
                BodyLevel
              </Typography>
            </Box>
          </motion.div>
          
          {/* Navigation Links for Desktop */}
          {isAuthenticated && !isMobile && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                component={Link}
                to="/"
                startIcon={<Home />}
                sx={{ 
                  color: theme.palette.text.primary,
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
                  bgcolor: currentPath === '/' ? 'rgba(0,0,0,0.08)' : 'transparent',
                }}
              >
                Home
              </Button>
              
              <Button 
                component={Link}
                to="/skills"
                startIcon={<Psychology />}
                sx={{ 
                  color: theme.palette.text.primary,
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
                  bgcolor: isSkillsPage ? 'rgba(0,0,0,0.08)' : 'transparent',
                }}
              >
                Skills
              </Button>
              
              {isAdmin && (
                <Button 
                  component={Link}
                  to="/admin"
                  startIcon={<AdminPanelSettings />}
                  sx={{ 
                    color: theme.palette.text.primary,
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
                    bgcolor: isAdminPage ? 'rgba(0,0,0,0.08)' : 'transparent',
                  }}
                >
                  Admin
                </Button>
              )}
            </Box>
          )}
          
          <Box sx={{ flexGrow: 1 }} />
          
          <motion.div
            variants={slideInRight}
            initial="hidden"
            animate="show"
          >
            <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 2 }}>
              {isAuthenticated && !isMobile && (
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
              )}
              
              {isAuthenticated && !isMobile && (
                <>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <ThemeToggle />
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <ProgressReset />
                  </motion.div>
                </>
              )}

              {isAuthenticated && (
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Tooltip title="Account">
                    <IconButton
                      size="large"
                      edge="end"
                      aria-label="account of current user"
                      aria-haspopup="true"
                      onClick={handleProfileMenuOpen}
                      color="inherit"
                    >
                      <AccountCircle />
                    </IconButton>
                  </Tooltip>
                  {!isMobile && (
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                      PaperProps={{
                        elevation: 3,
                        sx: { minWidth: 200 }
                      }}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                      <Box sx={{ px: 2, py: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {user?.username}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user?.email}
                        </Typography>
                        {isAdmin && (
                          <Chip 
                            label="Admin" 
                            size="small" 
                            color="secondary" 
                            sx={{ mt: 1 }} 
                          />
                        )}
                      </Box>
                      <Divider />
                      <MenuItem component={Link} to="/" onClick={handleMenuClose}>
                        <Home fontSize="small" sx={{ mr: 1 }} />
                        Home
                      </MenuItem>
                      <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                        <Person fontSize="small" sx={{ mr: 1 }} />
                        Profile Dashboard
                      </MenuItem>
                      <MenuItem component={Link} to="/skills" onClick={handleMenuClose}>
                        <Psychology fontSize="small" sx={{ mr: 1 }} />
                        Skills Tree
                      </MenuItem>
                      {isAdmin && (
                        <MenuItem component={Link} to="/admin" onClick={handleMenuClose}>
                          <AdminPanelSettings fontSize="small" sx={{ mr: 1 }} />
                          Admin Dashboard
                        </MenuItem>
                      )}
                      <Divider />
                      <MenuItem onClick={handleLogout}>
                        <Logout fontSize="small" sx={{ mr: 1 }} />
                        Logout
                      </MenuItem>
                    </Menu>
                  )}
                </motion.div>
              )}
            </Box>
          </motion.div>
        </Toolbar>
      </Container>
      
      {/* Mobile Drawer - Improved with SwipeableDrawer */}
      <SwipeableDrawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        onOpen={() => setMobileMenuOpen(true)}
        sx={{
          '& .MuiDrawer-paper': {
            width: '85%',
            maxWidth: 300,
          }
        }}
      >
        <Box
          sx={{ width: '100%' }}
          role="presentation"
        >
          <Box sx={{ 
            p: 2, 
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}>
            <IconButton 
              sx={{ position: 'absolute', top: 8, right: 8 }}
              onClick={toggleMobileMenu}
            >
              <Close />
            </IconButton>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                sx={{ 
                  bgcolor: theme.palette.primary.main,
                  width: 40,
                  height: 40,
                  mr: 1.5,
                }}
              >
                <FitnessCenterRounded />
              </Avatar>
              <Typography variant="h6" fontWeight="bold">BodyLevel</Typography>
            </Box>
            
            <Box display="flex" alignItems="center" mt={1}>
              <EmojiEvents fontSize="small" sx={{ color: theme.palette.primary.main, mr: 1 }} />
              <Typography variant="body2">
                Level {level} • {totalXP} XP
              </Typography>
            </Box>
            
            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {user?.username}
              </Typography>
              {isAdmin && (
                <Chip 
                  label="Admin" 
                  size="small" 
                  color="secondary" 
                  sx={{ height: 20, fontSize: '0.7rem' }} 
                />
              )}
            </Box>
            
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
          
          <List sx={{ pt: 0 }}>
            <ListItemButton 
              component={Link} 
              to="/" 
              onClick={toggleMobileMenu}
              selected={currentPath === '/'}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'rgba(0, 0, 0, 0.08)',
                }
              }}
            >
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
            
            <ListItemButton 
              component={Link} 
              to="/profile" 
              onClick={toggleMobileMenu}
              selected={isProfilePage}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'rgba(0, 0, 0, 0.08)',
                }
              }}
            >
              <ListItemIcon>
                <Dashboard />
              </ListItemIcon>
              <ListItemText primary="Profile Dashboard" />
            </ListItemButton>
            
            <ListItemButton 
              component={Link} 
              to="/skills" 
              onClick={toggleMobileMenu}
              selected={isSkillsPage}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'rgba(0, 0, 0, 0.08)',
                }
              }}
            >
              <ListItemIcon>
                <Psychology />
              </ListItemIcon>
              <ListItemText primary="Skills Tree" />
            </ListItemButton>
            
            {isAdmin && (
              <ListItemButton 
                component={Link} 
                to="/admin" 
                onClick={toggleMobileMenu}
                selected={isAdminPage}
                sx={{
                  '&.Mui-selected': {
                    bgcolor: 'rgba(0, 0, 0, 0.08)',
                  }
                }}
              >
                <ListItemIcon>
                  <AdminPanelSettings />
                </ListItemIcon>
                <ListItemText primary="Admin Dashboard" />
              </ListItemButton>
            )}
            
            <ListItemButton>
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
            
            <Divider sx={{ my: 1 }} />
            
            <ListItem>
              <ThemeToggle />
              <ListItemText primary="Toggle Theme" sx={{ ml: 2 }} />
            </ListItem>
            
            <ListItem>
              <ProgressReset />
              <ListItemText primary="Reset Progress" sx={{ ml: 2 }} />
            </ListItem>
            
            <Divider sx={{ my: 1 }} />
            
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </Box>
      </SwipeableDrawer>
    </AppBar>
  );
}; 