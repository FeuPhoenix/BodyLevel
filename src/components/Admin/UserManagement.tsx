import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  Snackbar,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person,
  AdminPanelSettings,
} from '@mui/icons-material';
import type { SelectChangeEvent } from '@mui/material';

// Define the AdminUser interface with specific types
interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: string;
  password?: string;
}

export const UserManagement = () => {
  const theme = useTheme();
  
  // State for users with strict typing
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<AdminUser>>({
    username: '',
    email: '',
    role: 'user',
    status: 'active',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Load mock users from localStorage on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    try {
      // Try to load from localStorage
      const savedUsers = localStorage.getItem('mockUsers');
      
      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers);
        
        // Ensure the parsed data conforms to the AdminUser type
        const typedUsers: AdminUser[] = parsedUsers.map((user: any) => ({
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role as 'user' | 'admin',
          status: user.status as 'active' | 'inactive' | 'suspended',
          lastLogin: user.lastLogin,
          // Don't include password in the loaded data for security
        }));
        
        setUsers(typedUsers);
      } else {
        // Create mock data if none exists
        const mockUsers: AdminUser[] = [
          {
            id: 'user1',
            username: 'john_doe',
            email: 'john@example.com',
            role: 'user',
            status: 'active',
            lastLogin: '2023-04-15T10:30:00',
          },
          {
            id: 'user2',
            username: 'jane_smith',
            email: 'jane@example.com',
            role: 'user',
            status: 'inactive',
            lastLogin: '2023-04-10T15:45:00',
          },
          {
            id: 'admin1',
            username: 'admin_user',
            email: 'admin@example.com',
            role: 'admin',
            status: 'active',
            lastLogin: '2023-04-16T08:15:00',
          },
        ];
        
        setUsers(mockUsers);
        localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setErrorMessage('Failed to load users');
    }
  };

  const handleOpenDialog = (user?: AdminUser) => {
    if (user) {
      // Edit mode - don't include password for security
      setSelectedUser(user);
      setFormData({
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    } else {
      // Create mode
      setSelectedUser(null);
      setFormData({
        username: '',
        email: '',
        role: 'user',
        status: 'active',
      });
    }
    setFormErrors({});
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDeleteDialogOpen(false);
    setFormErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleRoleChange = (e: SelectChangeEvent<'user' | 'admin'>) => {
    setFormData((prev) => ({ ...prev, role: e.target.value as 'user' | 'admin' }));
  };

  const handleStatusChange = (e: SelectChangeEvent<'active' | 'inactive' | 'suspended'>) => {
    setFormData((prev) => ({ ...prev, status: e.target.value as 'active' | 'inactive' | 'suspended' }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.username) {
      errors.username = 'Username is required';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    
    // When creating a new user, password is required
    if (!selectedUser && !formData.password) {
      errors.password = 'Password is required for new users';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    try {
      if (selectedUser) {
        // Update existing user
        const updatedUsers = users.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                username: formData.username || user.username,
                email: formData.email || user.email,
                role: formData.role || user.role,
                status: formData.status || user.status,
                ...(formData.password ? { password: formData.password } : {}),
              }
            : user
        );
        
        setUsers(updatedUsers);
        localStorage.setItem('mockUsers', JSON.stringify(updatedUsers));
        setSuccessMessage('User updated successfully');
      } else {
        // Create new user
        const newUser: AdminUser = {
          id: `user${Date.now()}`,
          username: formData.username!,
          email: formData.email!,
          role: formData.role!,
          status: formData.status!,
          lastLogin: new Date().toISOString(),
          password: formData.password,
        };
        
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        localStorage.setItem('mockUsers', JSON.stringify(updatedUsers));
        setSuccessMessage('User created successfully');
      }
      
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving user:', error);
      setErrorMessage('Failed to save user');
    }
  };

  const handleDeleteClick = (user: AdminUser) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedUser) return;
    
    try {
      const updatedUsers = users.filter((user) => user.id !== selectedUser.id);
      setUsers(updatedUsers);
      localStorage.setItem('mockUsers', JSON.stringify(updatedUsers));
      setSuccessMessage('User deleted successfully');
      handleCloseDialog();
    } catch (error) {
      console.error('Error deleting user:', error);
      setErrorMessage('Failed to delete user');
    }
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
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
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
                      onClick={() => handleOpenDialog(user)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDeleteClick(user)}
                    >
                      <DeleteIcon fontSize="small" />
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
          <Button variant="contained" color="primary" onClick={handleSubmit}>
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
          <Button variant="contained" color="error" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar 
        open={!!successMessage || !!errorMessage} 
        autoHideDuration={6000} 
        onClose={() => {
          setSuccessMessage('');
          setErrorMessage('');
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => {
            setSuccessMessage('');
            setErrorMessage('');
          }} 
          severity={!!errorMessage ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {successMessage || errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}; 