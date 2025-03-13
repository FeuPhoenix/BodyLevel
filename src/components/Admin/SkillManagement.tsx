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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  FitnessCenterRounded,
} from '@mui/icons-material';

// Mock data for skills
const mockSkills = [
  {
    id: 1,
    title: 'Push-ups',
    category: 'Push',
    level: 1,
    status: 'active',
    requirements: '3 sets of 10 reps',
  },
  {
    id: 2,
    title: 'Pull-ups',
    category: 'Pull',
    level: 2,
    status: 'active',
    requirements: '3 sets of 5 reps',
  },
  // Add more mock skills as needed
];

export const SkillManagement = () => {
  const theme = useTheme();
  const [skills] = useState(mockSkills);
  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleEditSkill = (skill: any) => {
    setSelectedSkill(skill);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedSkill(null);
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
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => {
            setSelectedSkill({});
            setDialogOpen(true);
          }}
        >
          Add Skill
        </Button>
      </Box>

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
                    color="primary"
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
          {selectedSkill?.id ? 'Edit Skill' : 'Add New Skill'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Title"
              fullWidth
              defaultValue={selectedSkill?.title}
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                defaultValue={selectedSkill?.category || 'Push'}
              >
                <MenuItem value="Push">Push</MenuItem>
                <MenuItem value="Pull">Pull</MenuItem>
                <MenuItem value="Legs">Legs</MenuItem>
                <MenuItem value="Core">Core</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Level"
              type="number"
              fullWidth
              defaultValue={selectedSkill?.level || 1}
              InputProps={{ inputProps: { min: 1 } }}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                defaultValue={selectedSkill?.status || 'active'}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Requirements"
              fullWidth
              multiline
              rows={3}
              defaultValue={selectedSkill?.requirements}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" color="primary">
            {selectedSkill?.id ? 'Save Changes' : 'Add Skill'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 