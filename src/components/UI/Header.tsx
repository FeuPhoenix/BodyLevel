import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  Dashboard,
  Person,
  Settings,
  Home,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { logout } from '../../features/auth/authSlice';

export const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo for larger screens */}
          <Box 
            component={RouterLink} 
            to="/"
            sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              textDecoration: 'none',
              color: 'inherit',
              alignItems: 'center'
            }}
          >
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                fontWeight: 700,
                color: 'inherit',
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
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleDrawerToggle}
              color="inherit"
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
              color: 'inherit'
            }}
          >
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontWeight: 700,
                color: 'inherit',
              }}
            >
              BodyLevel {isMobile ? 'Mobile' : ''}
            </Typography>
          </Box>

          {/* Desktop navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {isAuthenticated && (
              <>
                <Button
                  component={RouterLink}
                  to="/skills"
                  sx={{ my: 2, color: 'inherit', display: 'block' }}
                >
                  Skills
                </Button>
                <Button
                  component={RouterLink}
                  to="/profile"
                  sx={{ my: 2, color: 'inherit', display: 'block' }}
                >
                  Profile
                </Button>
              </>
            )}
          </Box>

          {/* User menu */}
          <Box sx={{ flexGrow: 0 }}>
            {isAuthenticated ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={user?.username || 'User'}>
                      {user?.username?.[0] || <Person />}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
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
                >
                  <MenuItem 
                    component={RouterLink} 
                    to="/"
                    onClick={handleCloseUserMenu}
                  >
                    <ListItemIcon>
                      <Home fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                  </MenuItem>
                  <MenuItem 
                    component={RouterLink} 
                    to="/profile"
                    onClick={handleCloseUserMenu}
                  >
                    <ListItemIcon>
                      <Person fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                  </MenuItem>
                  <MenuItem 
                    component={RouterLink} 
                    to="/admin"
                    onClick={handleCloseUserMenu}
                  >
                    <ListItemIcon>
                      <Dashboard fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Admin Dashboard" />
                  </MenuItem>
                  <MenuItem 
                    component={RouterLink} 
                    to="/user-profile"
                    onClick={handleCloseUserMenu}
                  >
                    <ListItemIcon>
                      <Settings fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Settings" />
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
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
                variant="outlined"
                sx={{ my: 1 }}
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
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            BodyLevel {isMobile ? '(Mobile)' : ''}
          </Typography>
        </Box>
        <List>
          <ListItemButton component={RouterLink} to="/" onClick={handleDrawerToggle}>
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
          
          {isAuthenticated && (
            <>
              <ListItemButton component={RouterLink} to="/profile" onClick={handleDrawerToggle}>
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton>
              
              <ListItemButton component={RouterLink} to="/skills" onClick={handleDrawerToggle}>
                <ListItemIcon>
                  <AccountCircle />
                </ListItemIcon>
                <ListItemText primary="Skills" />
              </ListItemButton>
              
              <ListItemButton component={RouterLink} to="/admin" onClick={handleDrawerToggle}>
                <ListItemIcon>
                  <Dashboard />
                </ListItemIcon>
                <ListItemText primary="Admin Dashboard" />
              </ListItemButton>
              
              <ListItemButton component={RouterLink} to="/user-profile" onClick={handleDrawerToggle}>
                <ListItemIcon>
                  <Settings />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItemButton>
              
              <ListItemButton onClick={() => {
                handleLogout();
                handleDrawerToggle();
              }}>
                <ListItemIcon>
                  <Logout />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </>
          )}
          
          {!isAuthenticated && (
            <ListItemButton component={RouterLink} to="/dev-login" onClick={handleDrawerToggle}>
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItemButton>
          )}
        </List>
      </SwipeableDrawer>
    </AppBar>
  );
}; 