import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useTheme,
  Snackbar,
  Alert,
  AlertProps,
  DialogContentText,
  SelectChangeEvent,
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  Person,
  AdminPanelSettings,
} from '@mui/icons-material';
import { User } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setAuthenticated } from '../../features/auth/authSlice';

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
}

export const UserManagement = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<AdminUser> & { password?: string }>({
    username: '',
    email: '',
    role: 'user',
    status: 'active',
    password: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: AlertProps['severity'];
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Load users from localStorage
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    try {
      // Try to load users from localStorage
      const storedUsers = localStorage.getItem('mockUsers');
      
      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers);
        // Format users for admin display
        const adminUsers: AdminUser[] = parsedUsers.map((user: any) => ({
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          status: user.status || 'active',
          lastLogin: user.lastLogin || 'Never',
        }));
        setUsers(adminUsers);
      } else {
        // Initialize with some default users if none exist
        const defaultUsers = [
          {
            id: 'user_1',
            username: 'admin',
            email: 'admin@example.com',
            role: 'admin',
            status: 'active',
            lastLogin: new Date().toISOString().split('T')[0],
            password: 'admin123',
          },
          {
            id: 'user_2',
            username: 'user',
            email: 'user@example.com',
            role: 'user',
            status: 'active',
            lastLogin: new Date().toISOString().split('T')[0],
            password: 'user123',
          },
        ];
        
        // Save to localStorage (with passwords for login)
        localStorage.setItem('mockUsers', JSON.stringify(defaultUsers));
        
        // Display without passwords
        setUsers(defaultUsers.map(user => ({
          ...user,
          password: undefined,
        })));
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    if (!formData.username || formData.username.trim() === '') {
      errors.username = 'Username is required';
      isValid = false;
    }

    if (!formData.email || formData.email.trim() === '') {
      errors.email = 'Email is required';
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
        isValid = false;
      }
    }

    // Password is required for new users
    if (!selectedUser?.id && (!formData.password || formData.password.trim() === '')) {
      errors.password = 'Password is required for new users';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user);
    setFormData({...user});
    setFormErrors({});
    setDialogOpen(true);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setFormData({
      username: '',
      email: '',
      role: 'user',
      status: 'active',
      password: '',
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUser(null);
    setFormData({});
    setFormErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (e: SelectChangeEvent<'user' | 'admin'>) => {
    setFormData(prev => ({
      ...prev,
      role: e.target.value as 'user' | 'admin'
    }));
  };

  const handleStatusChange = (e: SelectChangeEvent<'active' | 'inactive' | 'suspended'>) => {
    setFormData(prev => ({
      ...prev,
      status: e.target.value as 'active' | 'inactive' | 'suspended'
    }));
  };

  const handleSaveUser = () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Get current users
      let currentUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
      
      if (selectedUser?.id) {
        // Edit existing user
        currentUsers = currentUsers.map((user: AdminUser) => {
          if (user.id === selectedUser.id) {
            const updatedUser = {
              ...user,
              username: formData.username,
              email: formData.email,
              role: formData.role,
              status: formData.status,
            };
            
            // Only update password if provided
            if (formData.password) {
              updatedUser.password = formData.password;
            }
            
            return updatedUser;
          }
          return user;
        });
        
        setNotification({
          open: true,
          message: 'User updated successfully',
          severity: 'success',
        });
      } else {
        // Add new user
        const newUser = {
          id: `user_${Date.now()}`,
          username: formData.username,
          email: formData.email,
          role: formData.role,
          status: formData.status,
          lastLogin: 'Never',
          password: formData.password,
        };
        
        currentUsers.push(newUser);
        
        setNotification({
          open: true,
          message: 'User added successfully',
          severity: 'success',
        });
      }
      
      // Save updated users to localStorage
      localStorage.setItem('mockUsers', JSON.stringify(currentUsers));
      
      // Update current user if they were modified
      const authState = JSON.parse(localStorage.getItem('authState') || '{}');
      if (authState.user && selectedUser?.id === authState.user.id) {
        // Find the updated user
        const updatedUser = currentUsers.find((user: AdminUser) => user.id === selectedUser.id);
        
        if (updatedUser) {
          // Update the auth state with the new user info
          const { password, ...userData } = updatedUser;
          authState.user = userData;
          
          // Save updated auth state
          localStorage.setItem('authState', JSON.stringify(authState));
          
          // Update Redux state
          dispatch(setAuthenticated({
            user: userData, 
            profile: authState.profile
          }));
        }
      }
      
      // Reload users and close dialog
      loadUsers();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving user:', error);
      setNotification({
        open: true,
        message: 'Error saving user',
        severity: 'error',
      });
    }
  };

  const handleDeleteClick = (user: AdminUser) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteUser = () => {
    try {
      if (selectedUser?.id) {
        // Get current users
        const currentUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
        
        // Filter out the deleted user
        const updatedUsers = currentUsers.filter((user: AdminUser) => user.id !== selectedUser.id);
        
        // Save updated users to localStorage
        localStorage.setItem('mockUsers', JSON.stringify(updatedUsers));
        
        // Check if deleted user is the current user
        const authState = JSON.parse(localStorage.getItem('authState') || '{}');
        if (authState.user && selectedUser.id === authState.user.id) {
          // If current user was deleted, we should log them out
          localStorage.removeItem('authState');
          // We'd normally navigate to login here
        }
        
        setNotification({
          open: true,
          message: 'User deleted successfully',
          severity: 'success',
        });
        
        // Update state
        setUsers(updatedUsers.map(user => ({
          ...user,
          password: undefined,
        })));
      }
      
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      setNotification({
        open: true,
        message: 'Error deleting user',
        severity: 'error',
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        color: theme.palette.text.primary
      }}>
        <Typography variant="h6" fontWeight="bold">
          User Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddUser}
        >
          Add User
        </Button>
      </Box>

      {users.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No users found. Add your first user by clicking the "Add User" button.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Login</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {user.role === 'admin' ? (
                        <AdminPanelSettings color="primary" />
                      ) : (
                        <Person />
                      )}
                      {user.username}
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      color={user.role === 'admin' ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.status}
                      color={user.status === 'active' ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleEditUser(user)}
                      sx={{ mr: 1 }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDeleteClick(user)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit User Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedUser?.id ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Username"
              name="username"
              fullWidth
              value={formData.username || ''}
              onChange={handleInputChange}
              error={!!formErrors.username}
              helperText={formErrors.username}
              required
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              value={formData.email || ''}
              onChange={handleInputChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
              required
            />
            <TextField
              label={selectedUser?.id ? "Password (leave blank to keep current)" : "Password"}
              name="password"
              type="password"
              fullWidth
              value={formData.password || ''}
              onChange={handleInputChange}
              error={!!formErrors.password}
              helperText={formErrors.password}
              required={!selectedUser?.id}
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                label="Role"
                name="role"
                value={formData.role || 'user'}
                onChange={handleRoleChange}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                name="status"
                value={formData.status || 'active'}
                onChange={handleStatusChange}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSaveUser}>
            {selectedUser?.id ? 'Save Changes' : 'Add User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the user "{selectedUser?.username}"?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteUser}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}; 