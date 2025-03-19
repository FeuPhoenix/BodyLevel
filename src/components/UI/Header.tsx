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
  useTheme,
  alpha,
  Divider,
  Fade,
} from '@mui/material';
import { 
  Menu as MenuIcon,
  Logout,
  Dashboard,
  Person,
  Home,
  FitnessCenterRounded, 
  KeyboardArrowRight,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { logout } from '../../features/auth/authSlice';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  toggleTheme: () => void;
  mode: 'light' | 'dark';
}

export default function Header({ toggleTheme, mode }: HeaderProps) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const location = useLocation();
  
  // Check if the user is an admin
  const isAdmin = user?.role === 'admin';

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    setAnchorElUser(null);
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={scrolled ? 4 : 0}
      sx={{ 
        backgroundColor: scrolled 
          ? alpha(theme.palette.background.paper, 0.9)
          : theme.palette.background.paper,
        backdropFilter: 'blur(8px)',
        transition: 'all 0.3s',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo - visible on all screen sizes */}
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              fontWeight: 800,
              color: theme.palette.primary.main,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            <FitnessCenterRounded sx={{ mr: 1 }} />
            BODYLEVEL
          </Typography>

          {/* Mobile menu icon */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={() => setMobileOpen(true)}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Navigation - desktop */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'center',
              alignItems: 'center',
              gap: 3,
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'auto',
              zIndex: 1,
            }}
          >
            {isAuthenticated && (
              <>
                <Button
                  component={RouterLink}
                  to="/"
                  sx={{
                    color: location.pathname === '/' ? theme.palette.primary.main : 'text.primary',
                    fontWeight: location.pathname === '/' ? 700 : 500,
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  Home
                </Button>
                
                <Button
                  component={RouterLink}
                  to="/skills"
                  sx={{
                    color: location.pathname === '/skills' ? theme.palette.primary.main : 'text.primary',
                    fontWeight: location.pathname === '/skills' ? 700 : 500,
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  Skills
                </Button>
                
                <Button
                  component={RouterLink}
                  to="/profile"
                  sx={{
                    color: location.pathname === '/profile' ? theme.palette.primary.main : 'text.primary',
                    fontWeight: location.pathname === '/profile' ? 700 : 500,
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
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
                      color: location.pathname === '/admin' ? theme.palette.primary.main : 'text.primary',
                      fontWeight: location.pathname === '/admin' ? 700 : 500,
                      textTransform: 'none',
                      fontSize: '1rem',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                      },
                    }}
                  >
                    Admin
                  </Button>
                )}
              </>
            )}
          </Box>

          {/* Right side - user menu or login button */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 1, sm: 2 },
            ml: 'auto',
            flexShrink: 0,
            position: 'relative',
            zIndex: 2
          }}>
            {/* Theme Toggle Button */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ThemeToggle toggleTheme={toggleTheme} mode={mode} />
            </Box>

            {isAuthenticated ? (
              <Tooltip title="Open settings">
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{
                    p: 0,
                    border: `2px solid ${theme.palette.primary.main}`,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                >
                  <Avatar
                    alt={user?.username || 'User'}
                    sx={{ width: 32, height: 32 }}
                  >
                    {user?.username?.[0] || <Person />}
                  </Avatar>
                </IconButton>
              </Tooltip>
            ) : (
              <Button
                component={RouterLink}
                to="/dev-login"
                variant="contained"
                sx={{
                  textTransform: 'none',
                  borderRadius: '8px',
                  py: 0.5,
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  px: { xs: 1.5, sm: 2 },
                }}
              >
                Login
              </Button>
            )}

            {/* User menu */}
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
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile drawer */}
      <SwipeableDrawer
        anchor="left"
        open={mobileOpen}
        onOpen={() => setMobileOpen(true)}
        onClose={() => setMobileOpen(false)}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            width: 280,
            backgroundColor: theme.palette.background.paper,
            backgroundImage: 'none',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <FitnessCenterRounded sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                textDecoration: 'none',
                fontWeight: 700,
                color: theme.palette.primary.main,
              }}
              onClick={() => setMobileOpen(false)}
            >
              BODYLEVEL
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Navigation Links */}
          <List>
            {isAuthenticated ? (
              <>
                <ListItemButton
                  component={RouterLink}
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    backgroundColor: location.pathname === '/' ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                  }}
                >
                  <ListItemIcon>
                    <Home color={location.pathname === '/' ? 'primary' : 'inherit'} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Home"
                    primaryTypographyProps={{
                      fontWeight: location.pathname === '/' ? 700 : 400,
                      color: location.pathname === '/' ? 'primary' : 'inherit',
                    }}
                  />
                  {location.pathname === '/' && <KeyboardArrowRight color="primary" />}
                </ListItemButton>

                <ListItemButton
                  component={RouterLink}
                  to="/skills"
                  onClick={() => setMobileOpen(false)}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    backgroundColor: location.pathname === '/skills' ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                  }}
                >
                  <ListItemIcon>
                    <FitnessCenterRounded color={location.pathname === '/skills' ? 'primary' : 'inherit'} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Skills"
                    primaryTypographyProps={{
                      fontWeight: location.pathname === '/skills' ? 700 : 400,
                      color: location.pathname === '/skills' ? 'primary' : 'inherit',
                    }}
                  />
                  {location.pathname === '/skills' && <KeyboardArrowRight color="primary" />}
                </ListItemButton>

                <ListItemButton
                  component={RouterLink}
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    backgroundColor: location.pathname === '/profile' ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                  }}
                >
                  <ListItemIcon>
                    <Person color={location.pathname === '/profile' ? 'primary' : 'inherit'} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Profile"
                    primaryTypographyProps={{
                      fontWeight: location.pathname === '/profile' ? 700 : 400,
                      color: location.pathname === '/profile' ? 'primary' : 'inherit',
                    }}
                  />
                  {location.pathname === '/profile' && <KeyboardArrowRight color="primary" />}
                </ListItemButton>

                {isAdmin && (
                  <ListItemButton
                    component={RouterLink}
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      backgroundColor: location.pathname === '/admin' ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                    }}
                  >
                    <ListItemIcon>
                      <Dashboard color={location.pathname === '/admin' ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Admin Dashboard"
                      primaryTypographyProps={{
                        fontWeight: location.pathname === '/admin' ? 700 : 400,
                        color: location.pathname === '/admin' ? 'primary' : 'inherit',
                      }}
                    />
                    {location.pathname === '/admin' && <KeyboardArrowRight color="primary" />}
                  </ListItemButton>
                )}
              </>
            ) : (
              <ListItemButton
                component={RouterLink}
                to="/dev-login"
                onClick={() => setMobileOpen(false)}
                sx={{
                  borderRadius: 2,
                  bgcolor: theme.palette.primary.main,
                  color: 'white',
                  mb: 1,
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                  },
                }}
              >
                <ListItemText primary="Login" />
              </ListItemButton>
            )}
          </List>

          <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Theme Toggle in Mobile Menu */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              mb: 2,
              p: 1,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            }}>
              <Typography variant="body2" sx={{ mr: 1 }}>
                {mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </Typography>
              <ThemeToggle toggleTheme={toggleTheme} mode={mode} />
            </Box>

            {isAuthenticated && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<Logout />}
                onClick={() => {
                  dispatch(logout());
                  setMobileOpen(false);
                }}
                fullWidth
                sx={{ borderRadius: 2 }}
              >
                Logout
              </Button>
            )}
          </Box>
        </Box>
      </SwipeableDrawer>
    </AppBar>
  );
} 