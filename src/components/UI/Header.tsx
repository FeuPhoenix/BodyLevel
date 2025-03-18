import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  SwipeableDrawer,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  useMediaQuery,
  useTheme,
  alpha,
  Badge,
  Divider,
  Fade,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  Dashboard,
  Person,
  Home,
  FitnessCenterRounded,
  KeyboardArrowRight,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { logout } from '../../features/auth/authSlice';

export const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const location = useLocation();
  
  // Check if the user is an admin
  const isAdmin = user?.role === 'admin';

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scrolling to change AppBar appearance
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleCloseUserMenu();
  };

  // Check if a route is active
  const isActive = (path: string) => location.pathname === path;

  // Get badge count (for notifications, can be implemented later)
  const getBadgeCount = () => {
    return 0; // Placeholder for future notification system
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{
        background: scrolled 
          ? `linear-gradient(145deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})` 
          : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.15)' : 'none',
        transition: 'all 0.3s ease-in-out',
        color: scrolled ? '#fff' : theme.palette.text.primary,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ py: 0.5, position: 'relative' }}>
          {/* Logo for larger screens */}
          <Box 
            component={RouterLink} 
            to="/"
            sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              textDecoration: 'none',
              color: 'inherit',
              alignItems: 'center',
              transition: 'transform 0.3s ease',
              position: 'relative',
              zIndex: 2,
              '&:hover': {
                transform: 'scale(1.05)',
              }
            }}
          >
            <FitnessCenterRounded sx={{ mr: 1, fontSize: 28 }} />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: 'inherit',
                letterSpacing: '0.05em',
                background: scrolled ? 'none' : `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: scrolled ? 'none' : 'text',
                WebkitTextFillColor: scrolled ? 'inherit' : 'transparent',
              }}
            >
              BodyLevel
            </Typography>
          </Box>

          {/* Mobile menu icon - only show on mobile */}
          <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              onClick={handleDrawerToggle}
              color="inherit"
              sx={{
                background: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  background: alpha(theme.palette.primary.main, 0.2),
                },
                borderRadius: 2,
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Logo for mobile */}
          <Box 
            component={RouterLink} 
            to="/"
            sx={{ 
              flexGrow: 1, 
              display: { xs: 'flex', md: 'none' },
              textDecoration: 'none',
              color: 'inherit',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FitnessCenterRounded sx={{ mr: 1, fontSize: 24 }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'inherit',
                letterSpacing: '0.05em',
                background: scrolled ? 'none' : `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: scrolled ? 'none' : 'text',
                WebkitTextFillColor: scrolled ? 'inherit' : 'transparent',
              }}
            >
              BodyLevel
            </Typography>
          </Box>

          {/* Desktop navigation */}
          <Box 
            sx={{ 
              flexGrow: 1, 
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'auto',
              zIndex: 1
            }}
          >
            {isAuthenticated && (
              <>
                <Button
                  component={RouterLink}
                  to="/skills"
                  sx={{
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    position: 'relative',
                    color: isActive('/skills') ? theme.palette.primary.contrastText : 'inherit',
                    backgroundColor: isActive('/skills') 
                      ? alpha(theme.palette.primary.main, 0.9)
                      : 'transparent',
                    '&:hover': {
                      backgroundColor: isActive('/skills')
                        ? alpha(theme.palette.primary.main, 0.8)
                        : alpha(theme.palette.primary.main, 0.1),
                    },
                    overflow: 'hidden',
                    transition: 'all 0.3s ease-in-out',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      width: isActive('/skills') ? '100%' : '0%',
                      height: '3px',
                      backgroundColor: theme.palette.secondary.main,
                      transform: 'translateX(-50%)',
                      transition: 'width 0.3s ease-in-out',
                    },
                    '&:hover::after': {
                      width: '80%',
                    },
                  }}
                >
                  Skills
                </Button>
                <Button
                  component={RouterLink}
                  to="/profile"
                  sx={{
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    position: 'relative',
                    color: isActive('/profile') ? theme.palette.primary.contrastText : 'inherit',
                    backgroundColor: isActive('/profile') 
                      ? alpha(theme.palette.primary.main, 0.9)
                      : 'transparent',
                    '&:hover': {
                      backgroundColor: isActive('/profile')
                        ? alpha(theme.palette.primary.main, 0.8)
                        : alpha(theme.palette.primary.main, 0.1),
                    },
                    overflow: 'hidden',
                    transition: 'all 0.3s ease-in-out',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      width: isActive('/profile') ? '100%' : '0%',
                      height: '3px',
                      backgroundColor: theme.palette.secondary.main,
                      transform: 'translateX(-50%)',
                      transition: 'width 0.3s ease-in-out',
                    },
                    '&:hover::after': {
                      width: '80%',
                    },
                  }}
                >
                  Profile
                </Button>
                {isAdmin && (
                  <Button
                    component={RouterLink}
                    to="/admin"
                    sx={{
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      position: 'relative',
                      color: isActive('/admin') ? theme.palette.primary.contrastText : 'inherit',
                      backgroundColor: isActive('/admin') 
                        ? alpha(theme.palette.primary.main, 0.9)
                        : 'transparent',
                      '&:hover': {
                        backgroundColor: isActive('/admin')
                          ? alpha(theme.palette.primary.main, 0.8)
                          : alpha(theme.palette.primary.main, 0.1),
                      },
                      overflow: 'hidden',
                      transition: 'all 0.3s ease-in-out',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        width: isActive('/admin') ? '100%' : '0%',
                        height: '3px',
                        backgroundColor: theme.palette.secondary.main,
                        transform: 'translateX(-50%)',
                        transition: 'width 0.3s ease-in-out',
                      },
                      '&:hover::after': {
                        width: '80%',
                      },
                    }}
                  >
                    Admin
                  </Button>
                )}
              </>
            )}
          </Box>

          {/* User menu */}
          <Box sx={{ flexGrow: 0, ml: 'auto', position: 'relative', zIndex: 2 }}>
            {isAuthenticated ? (
              <>
                <Tooltip title="Account settings">
                  <IconButton 
                    onClick={handleOpenUserMenu} 
                    sx={{ 
                      p: 0.5,
                      border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        border: `2px solid ${theme.palette.primary.main}`,
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={getBadgeCount()}
                      color="secondary"
                    >
                      <Avatar 
                        alt={user?.username || 'User'} 
                        sx={{ 
                          bgcolor: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                          width: 40,
                          height: 40,
                          fontWeight: 'bold',
                        }}
                      >
                        {user?.username?.[0] || <Person />}
                      </Avatar>
                    </Badge>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ 
                    mt: '45px',
                    '& .MuiPaper-root': {
                      borderRadius: 2,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      overflow: 'visible',
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  TransitionComponent={Fade}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {user?.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {user?.email}
                    </Typography>
                  </Box>

                  <Divider />

                  <MenuItem 
                    component={RouterLink} 
                    to="/"
                    onClick={handleCloseUserMenu}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      my: 0.5,
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      },
                      '&:hover .MuiListItemIcon-root': {
                        color: theme.palette.primary.main,
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40, transition: 'all 0.2s' }}>
                      <Home fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                  </MenuItem>
                  <MenuItem 
                    component={RouterLink} 
                    to="/profile"
                    onClick={handleCloseUserMenu}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      my: 0.5,
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      },
                      '&:hover .MuiListItemIcon-root': {
                        color: theme.palette.primary.main,
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40, transition: 'all 0.2s' }}>
                      <Person fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                  </MenuItem>
                  {isAdmin && (
                    <MenuItem 
                      component={RouterLink} 
                      to="/admin"
                      onClick={handleCloseUserMenu}
                      sx={{
                        borderRadius: 1,
                        mx: 1,
                        my: 0.5,
                        transition: 'all 0.2s',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        },
                        '&:hover .MuiListItemIcon-root': {
                          color: theme.palette.primary.main,
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40, transition: 'all 0.2s' }}>
                        <Dashboard fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Admin Dashboard" />
                    </MenuItem>
                  )}

                  <Divider />

                  <MenuItem 
                    onClick={handleLogout}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      my: 0.5,
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                      },
                      '&:hover .MuiListItemIcon-root': {
                        color: theme.palette.error.main,
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40, transition: 'all 0.2s' }}>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                component={RouterLink}
                to="/dev-login"
                variant="contained"
                sx={{ 
                  borderRadius: 8,
                  px: 3, 
                  py: 1,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.6)}`,
                    transform: 'translateY(-2px)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile drawer - conditionally render based on isMobile */}
      <SwipeableDrawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        onOpen={() => setMobileOpen(true)}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            borderRadius: '0 16px 16px 0',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          },
        }}
      >
        <Box 
          sx={{ 
            p: 3, 
            display: 'flex', 
            alignItems: 'center',
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            background: `linear-gradient(145deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            color: 'white',
            borderRadius: '0 16px 0 0',
          }}
        >
          <FitnessCenterRounded sx={{ mr: 1, fontSize: 24 }} />
          <Typography variant="h6" fontWeight="bold">
            BodyLevel
          </Typography>
        </Box>

        {isAuthenticated && (
          <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar 
                sx={{ 
                  mr: 2, 
                  width: 50, 
                  height: 50,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                }}
              >
                {user?.username?.[0] || <Person />}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {user?.username}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 160 }}>
                  {user?.email}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        <List sx={{ pt: 1, pb: 2, px: 1 }}>
          <ListItemButton 
            component={RouterLink} 
            to="/" 
            onClick={handleDrawerToggle}
            sx={{
              borderRadius: 2,
              mb: 1,
              backgroundColor: isActive('/') ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            <ListItemIcon 
              sx={{ 
                minWidth: 40, 
                color: isActive('/') ? theme.palette.primary.main : 'inherit' 
              }}
            >
              <Home />
            </ListItemIcon>
            <ListItemText 
              primary="Home" 
              primaryTypographyProps={{ 
                fontWeight: isActive('/') ? 'bold' : 'regular'
              }}
            />
            {isActive('/') && (
              <Box 
                sx={{ 
                  width: 4, 
                  height: 36, 
                  bgcolor: theme.palette.primary.main,
                  borderRadius: 2,
                  ml: 1,
                }}
              />
            )}
          </ListItemButton>
          
          {isAuthenticated && (
            <>
              <ListItemButton 
                component={RouterLink} 
                to="/profile" 
                onClick={handleDrawerToggle}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  backgroundColor: isActive('/profile') ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    minWidth: 40, 
                    color: isActive('/profile') ? theme.palette.primary.main : 'inherit' 
                  }}
                >
                  <Person />
                </ListItemIcon>
                <ListItemText 
                  primary="Profile" 
                  primaryTypographyProps={{ 
                    fontWeight: isActive('/profile') ? 'bold' : 'regular'
                  }}
                />
                {isActive('/profile') && (
                  <Box 
                    sx={{ 
                      width: 4, 
                      height: 36, 
                      bgcolor: theme.palette.primary.main,
                      borderRadius: 2,
                      ml: 1,
                    }}
                  />
                )}
              </ListItemButton>
              
              <ListItemButton 
                component={RouterLink} 
                to="/skills" 
                onClick={handleDrawerToggle}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  backgroundColor: isActive('/skills') ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    minWidth: 40, 
                    color: isActive('/skills') ? theme.palette.primary.main : 'inherit' 
                  }}
                >
                  <FitnessCenterRounded />
                </ListItemIcon>
                <ListItemText 
                  primary="Skills" 
                  primaryTypographyProps={{ 
                    fontWeight: isActive('/skills') ? 'bold' : 'regular'
                  }}
                />
                {isActive('/skills') && (
                  <Box 
                    sx={{ 
                      width: 4, 
                      height: 36, 
                      bgcolor: theme.palette.primary.main,
                      borderRadius: 2,
                      ml: 1,
                    }}
                  />
                )}
              </ListItemButton>
              
              {isAdmin && (
                <ListItemButton 
                  component={RouterLink} 
                  to="/admin" 
                  onClick={handleDrawerToggle}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    backgroundColor: isActive('/admin') ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      minWidth: 40, 
                      color: isActive('/admin') ? theme.palette.primary.main : 'inherit' 
                    }}
                  >
                    <Dashboard />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Admin Dashboard" 
                    primaryTypographyProps={{ 
                      fontWeight: isActive('/admin') ? 'bold' : 'regular'
                    }}
                  />
                  {isActive('/admin') && (
                    <Box 
                      sx={{ 
                        width: 4, 
                        height: 36, 
                        bgcolor: theme.palette.primary.main,
                        borderRadius: 2,
                        ml: 1,
                      }}
                    />
                  )}
                </ListItemButton>
              )}
              
              <Divider sx={{ my: 2 }} />
              
              <ListItemButton 
                onClick={() => {
                  handleLogout();
                  handleDrawerToggle();
                }}
                sx={{
                  borderRadius: 2,
                  color: theme.palette.error.main,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: theme.palette.error.main }}>
                  <Logout />
                </ListItemIcon>
                <ListItemText primary="Logout" />
                <KeyboardArrowRight color="action" />
              </ListItemButton>
            </>
          )}
          
          {!isAuthenticated && (
            <ListItemButton 
              component={RouterLink} 
              to="/dev-login" 
              onClick={handleDrawerToggle}
              sx={{
                borderRadius: 2,
                mb: 1,
                backgroundColor: isActive('/dev-login') ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              <ListItemIcon 
                sx={{ 
                  minWidth: 40, 
                  color: isActive('/dev-login') ? theme.palette.primary.main : 'inherit' 
                }}
              >
                <Person />
              </ListItemIcon>
              <ListItemText 
                primary="Login" 
                primaryTypographyProps={{ 
                  fontWeight: isActive('/dev-login') ? 'bold' : 'regular'
                }}
              />
              {isActive('/dev-login') && (
                <Box 
                  sx={{ 
                    width: 4, 
                    height: 36, 
                    bgcolor: theme.palette.primary.main,
                    borderRadius: 2,
                    ml: 1,
                  }}
                />
              )}
            </ListItemButton>
          )}
        </List>
      </SwipeableDrawer>
    </AppBar>
  );
}; 