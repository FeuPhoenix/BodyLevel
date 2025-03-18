import { useState, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  FitnessCenterRounded,
  Sync,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { Skill, SkillCategory } from '../../types';
import { initialSkills } from '../../features/skills/initialSkills';
import { syncAdminSkills, updateSkill, deleteSkill } from '../../features/skills/skillsSlice';

// Modified Skill interface for admin management
interface AdminSkill {
  id: string;
  title: string;
  category: SkillCategory;
  level: number;
  status: 'active' | 'inactive';
  requirements: string;
  description?: string;
  prerequisites?: string[];
}

interface FormErrors {
  title?: string;
  category?: string;
  level?: string;
  requirements?: string;
}

export const SkillManagement = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const reduxSkills = useAppSelector(state => state.skills.skills);
  const [skills, setSkills] = useState<AdminSkill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<Partial<AdminSkill> | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<AdminSkill>>({});
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

  // Load skills from localStorage and sync with Redux if needed
  useEffect(() => {
    loadSkills();
  }, [reduxSkills]);

  const loadSkills = () => {
    try {
      // Try to load skills from localStorage
      const storedSkills = localStorage.getItem('mockSkills');
      
      if (storedSkills) {
        setSkills(JSON.parse(storedSkills));
      } else {
        // Initialize with skills from initialSkills if none exist in localStorage
        const adminSkills: AdminSkill[] = initialSkills.map(skill => ({
          id: skill.id,
          title: skill.title,
          category: skill.category,
          level: skill.level,
          status: 'active',
          requirements: `${skill.requirements.sets} sets of ${skill.requirements.reps} reps`,
          description: skill.description,
          prerequisites: skill.prerequisites,
        }));
        
        localStorage.setItem('mockSkills', JSON.stringify(adminSkills));
        setSkills(adminSkills);
      }
    } catch (error) {
      console.error('Error loading skills:', error);
      setSkills([]);
    }
  };

  // Function to sync skills from Redux
  const syncWithReduxSkills = () => {
    try {
      const adminSkills: AdminSkill[] = reduxSkills.map(skill => ({
        id: skill.id,
        title: skill.title,
        category: skill.category,
        level: skill.level,
        status: skill.status === 'locked' ? 'inactive' : 'active',
        requirements: `${skill.requirements.sets} sets of ${skill.requirements.reps} reps`,
        description: skill.description,
        prerequisites: skill.prerequisites,
      }));
      
      localStorage.setItem('mockSkills', JSON.stringify(adminSkills));
      setSkills(adminSkills);
      
      setNotification({
        open: true,
        message: 'Skills synchronized successfully from application data',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error syncing skills:', error);
      setNotification({
        open: true,
        message: 'Error synchronizing skills',
        severity: 'error',
      });
    }
  };

  // Function to sync changes back to Redux
  const syncToRedux = () => {
    dispatch(syncAdminSkills());
    
    setNotification({
      open: true,
      message: 'Changes applied to the application successfully',
      severity: 'success',
    });
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    if (!formData.title || formData.title.trim() === '') {
      errors.title = 'Title is required';
      isValid = false;
    }

    if (!formData.category) {
      errors.category = 'Category is required';
      isValid = false;
    }

    if (!formData.level) {
      errors.level = 'Level is required';
      isValid = false;
    } else if (isNaN(Number(formData.level)) || Number(formData.level) < 1) {
      errors.level = 'Level must be a positive number';
      isValid = false;
    }

    if (!formData.requirements || formData.requirements.trim() === '') {
      errors.requirements = 'Requirements are required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleEditSkill = (skill: AdminSkill) => {
    setSelectedSkill(skill);
    setFormData({...skill});
    setFormErrors({});
    setDialogOpen(true);
  };

  const handleAddSkill = () => {
    setSelectedSkill(null);
    setFormData({
      title: '',
      category: 'Push',
      level: 1,
      status: 'active',
      requirements: '',
      description: '',
      prerequisites: [],
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedSkill(null);
    setFormData({});
    setFormErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: value,
    });
    
    // Clear the specific error when user types
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors({
        ...formErrors,
        [name as string]: undefined,
      });
    }
  };

  const handleSaveSkill = () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Get current skills
      let currentSkills = JSON.parse(localStorage.getItem('mockSkills') || '[]');
      let updatedSkill;
      
      if (selectedSkill?.id) {
        // Edit existing skill
        currentSkills = currentSkills.map((skill: AdminSkill) => {
          if (skill.id === selectedSkill.id) {
            updatedSkill = {
              ...skill,
              title: formData.title,
              category: formData.category,
              level: Number(formData.level),
              status: formData.status,
              requirements: formData.requirements,
              description: formData.description,
              prerequisites: formData.prerequisites || [],
            };
            return updatedSkill;
          }
          return skill;
        });
        
        setNotification({
          open: true,
          message: 'Skill updated successfully',
          severity: 'success',
        });
      } else {
        // Add new skill
        updatedSkill = {
          id: `skill_${Date.now()}`,
          title: formData.title,
          category: formData.category,
          level: Number(formData.level),
          status: formData.status,
          requirements: formData.requirements,
          description: formData.description,
          prerequisites: formData.prerequisites || [],
        };
        
        currentSkills.push(updatedSkill);
        
        setNotification({
          open: true,
          message: 'Skill added successfully',
          severity: 'success',
        });
      }
      
      // Save updated skills to localStorage
      localStorage.setItem('mockSkills', JSON.stringify(currentSkills));
      
      // Also update Redux store
      if (updatedSkill) {
        // Parse requirements from string format (e.g. "3 sets of 10 reps")
        let requirements = { sets: 3, reps: 10, description: updatedSkill.requirements };
        
        try {
          const reqMatch = updatedSkill.requirements.match(/(\d+)\s*sets\s*of\s*(\d+)\s*reps/i);
          if (reqMatch && reqMatch.length >= 3) {
            requirements = {
              sets: parseInt(reqMatch[1], 10),
              reps: parseInt(reqMatch[2], 10),
              description: updatedSkill.requirements
            };
          }
        } catch (e) {
          console.error("Failed to parse requirements:", e);
        }
        
        // Create a proper skill object for Redux
        const reduxSkill: Skill = {
          id: updatedSkill.id,
          title: updatedSkill.title,
          description: updatedSkill.description || `${updatedSkill.title} exercise`,
          category: updatedSkill.category,
          level: updatedSkill.level,
          requirements,
          prerequisites: updatedSkill.prerequisites || [],
          status: updatedSkill.status === 'active' ? 'unlocked' : 'locked',
          position: { x: 0, y: 0 } // Default position
        };
        
        // Dispatch to Redux
        dispatch(updateSkill(reduxSkill));
      }
      
      // Reload skills and close dialog
      setSkills(currentSkills);
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving skill:', error);
      setNotification({
        open: true,
        message: 'Error saving skill',
        severity: 'error',
      });
    }
  };

  const handleDeleteClick = (skill: AdminSkill) => {
    setSelectedSkill(skill);
    setDeleteDialogOpen(true);
  };

  const handleDeleteSkill = () => {
    try {
      if (selectedSkill?.id) {
        // Get current skills
        const currentSkills = JSON.parse(localStorage.getItem('mockSkills') || '[]');
        
        // Filter out the deleted skill
        const updatedSkills = currentSkills.filter((skill: AdminSkill) => skill.id !== selectedSkill.id);
        
        // Save updated skills to localStorage
        localStorage.setItem('mockSkills', JSON.stringify(updatedSkills));
        
        // Also update Redux store
        dispatch(deleteSkill(selectedSkill.id));
        
        setNotification({
          open: true,
          message: 'Skill deleted successfully',
          severity: 'success',
        });
        
        // Update state
        setSkills(updatedSkills);
      }
      
      setDeleteDialogOpen(false);
      setSelectedSkill(null);
    } catch (error) {
      console.error('Error deleting skill:', error);
      setNotification({
        open: true,
        message: 'Error deleting skill',
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

  const handleCategoryChange = (e: SelectChangeEvent<SkillCategory>) => {
    setFormData(prev => ({
      ...prev,
      category: e.target.value as SkillCategory
    }));
  };

  const handleStatusChange = (e: SelectChangeEvent<'active' | 'inactive'>) => {
    setFormData(prev => ({
      ...prev,
      status: e.target.value as 'active' | 'inactive'
    }));
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
          Skill Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Sync />}
            onClick={syncWithReduxSkills}
          >
            Import App Data
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={syncToRedux}
          >
            Apply Changes
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleAddSkill}
          >
            Add Skill
          </Button>
        </Box>
      </Box>

      {skills.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No skills found. Add your first skill by clicking the "Add Skill" button or sync with the application data.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Level</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Requirements</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {skills.map((skill) => (
                <TableRow key={skill.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FitnessCenterRounded color="primary" />
                      {skill.title}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={skill.category}
                      color={
                        skill.category === 'Push' ? 'error' :
                        skill.category === 'Pull' ? 'primary' :
                        skill.category === 'Legs' ? 'success' : 
                        'warning'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>Level {skill.level}</TableCell>
                  <TableCell>
                    <Chip
                      label={skill.status}
                      color={skill.status === 'active' ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{skill.requirements}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleEditSkill(skill)}
                      sx={{ mr: 1 }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDeleteClick(skill)}
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

      {/* Add/Edit Skill Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedSkill?.id ? 'Edit Skill' : 'Add New Skill'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Title"
              name="title"
              fullWidth
              value={formData.title || ''}
              onChange={handleInputChange}
              error={!!formErrors.title}
              helperText={formErrors.title}
              required
            />
            <FormControl fullWidth error={!!formErrors.category} required>
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                name="category"
                value={formData.category || 'Push'}
                onChange={handleCategoryChange}
              >
                <MenuItem value="Push">Push</MenuItem>
                <MenuItem value="Pull">Pull</MenuItem>
                <MenuItem value="Legs">Legs</MenuItem>
                <MenuItem value="Core">Core</MenuItem>
              </Select>
              {formErrors.category && (
                <Typography color="error" variant="caption" sx={{ mt: 1, ml: 2 }}>
                  {formErrors.category}
                </Typography>
              )}
            </FormControl>
            <TextField
              label="Level"
              name="level"
              type="number"
              fullWidth
              value={formData.level || ''}
              onChange={handleInputChange}
              error={!!formErrors.level}
              helperText={formErrors.level}
              InputProps={{ inputProps: { min: 1 } }}
              required
            />
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
              </Select>
            </FormControl>
            <TextField
              label="Requirements"
              name="requirements"
              fullWidth
              multiline
              rows={2}
              value={formData.requirements || ''}
              onChange={handleInputChange}
              error={!!formErrors.requirements}
              helperText={formErrors.requirements}
              required
            />
            <TextField
              label="Description"
              name="description"
              fullWidth
              multiline
              rows={3}
              value={formData.description || ''}
              onChange={handleInputChange}
              placeholder="Describe the skill in detail"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSaveSkill}>
            {selectedSkill?.id ? 'Save Changes' : 'Add Skill'}
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
            Are you sure you want to delete the skill "{selectedSkill?.title}"?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteSkill}>
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