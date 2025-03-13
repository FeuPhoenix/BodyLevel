import { useState } from 'react';
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
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  Person,
  AdminPanelSettings,
} from '@mui/icons-material';

// Mock data for users
const mockUsers = [
  {
    id: 1,
    username: 'john_doe',
    email: 'john@example.com',
    role: 'user',
    status: 'active',
    lastLogin: '2024-03-20',
  },
  {
    id: 2,
    username: 'jane_smith',
    email: 'jane@example.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-03-19',
  },
  // Add more mock users as needed
];

export const UserManagement = () => {
  const theme = useTheme();
  const [users] = useState(mockUsers);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUser(null);
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
          onClick={() => {
            setSelectedUser({});
            setDialogOpen(true);
          }}
        >
          Add User
        </Button>
      </Box>

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
                  <IconButton size="small" color="error">
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedUser?.id ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Username"
              fullWidth
              defaultValue={selectedUser?.username}
            />
            <TextField
              label="Email"
              fullWidth
              defaultValue={selectedUser?.email}
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                label="Role"
                defaultValue={selectedUser?.role || 'user'}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                defaultValue={selectedUser?.status || 'active'}
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
          <Button variant="contained" color="primary">
            {selectedUser?.id ? 'Save Changes' : 'Add User'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 