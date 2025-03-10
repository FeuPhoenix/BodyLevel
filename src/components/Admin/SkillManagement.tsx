import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Typography,
  IconButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputAdornment,
  Grid,
  FormControlLabel,
  Switch,
  Autocomplete,
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  Search,
  FitnessCenter,
  Category,
  EmojiEvents,
} from '@mui/icons-material';

// Mock skill data
const mockSkills = Array.from({ length: 40 }, (_, i) => {
  const categories = ['Push', 'Pull', 'Legs', 'Core', 'Flexibility'];
  const difficulties = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
  
  return {
    id: i + 1,
    name: `Skill ${i + 1}`,
    category,
    difficulty,
    xpValue: Math.floor(Math.random() * 500) + 100,
    level: Math.floor(Math.random() * 5) + 1,
    prerequisites: i > 5 ? [Math.floor(Math.random() * i)] : [],
    isActive: Math.random() > 0.2,
    description: `This is a ${difficulty.toLowerCase()} ${category.toLowerCase()} skill that helps improve strength and technique.`,
  };
});

interface Skill {
  id: number;
  name: string;
  category: string;
  difficulty: string;
  xpValue: number;
  level: number;
  prerequisites: number[];
  isActive: boolean;
  description: string;
}

export const SkillManagement = () => {
  const [skills, setSkills] = useState<Skill[]>(mockSkills);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editFormData, setEditFormData] = useState<Skill | null>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newSkill, setNewSkill] = useState<Partial<Skill>>({
    name: '',
    category: '',
    difficulty: 'Beginner',
    xpValue: 100,
    level: 1,
    prerequisites: [],
    isActive: true,
    description: '',
  });

  // Categories and difficulties
  const categories = ['Push', 'Pull', 'Legs', 'Core', 'Flexibility'];
  const difficulties = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  // Handle category filter
  const handleCategoryFilter = (event: SelectChangeEvent) => {
    setFilterCategory(event.target.value);
    setPage(0);
  };

  // Handle difficulty filter
  const handleDifficultyFilter = (event: SelectChangeEvent) => {
    setFilterDifficulty(event.target.value);
    setPage(0);
  };

  // Open delete dialog
  const handleOpenDeleteDialog = (skill: Skill) => {
    setSelectedSkill(skill);
    setOpenDeleteDialog(true);
  };

  // Close delete dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedSkill(null);
  };

  // Delete skill
  const handleDeleteSkill = () => {
    if (selectedSkill) {
      setSkills(skills.filter(skill => skill.id !== selectedSkill.id));
      handleCloseDeleteDialog();
    }
  };

  // Open edit dialog
  const handleOpenEditDialog = (skill: Skill) => {
    setSelectedSkill(skill);
    setEditFormData({ ...skill });
    setOpenEditDialog(true);
  };

  // Close edit dialog
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedSkill(null);
    setEditFormData(null);
  };

  // Handle edit form change
  const handleEditFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editFormData) {
      const { name, value } = event.target;
      setEditFormData({
        ...editFormData,
        [name]: name === 'xpValue' || name === 'level' ? Number(value) : value,
      });
    }
  };

  // Handle edit form select change
  const handleEditFormSelectChange = (event: SelectChangeEvent) => {
    if (editFormData) {
      setEditFormData({
        ...editFormData,
        [event.target.name]: event.target.value,
      });
    }
  };

  // Handle edit form switch change
  const handleEditFormSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editFormData) {
      setEditFormData({
        ...editFormData,
        [event.target.name]: event.target.checked,
      });
    }
  };

  // Handle prerequisites change
  const handlePrerequisitesChange = (event: any, newValue: number[]) => {
    if (editFormData) {
      setEditFormData({
        ...editFormData,
        prerequisites: newValue,
      });
    }
  };

  // Save edited skill
  const handleSaveSkill = () => {
    if (editFormData && selectedSkill) {
      setSkills(skills.map(skill => (skill.id === selectedSkill.id ? editFormData : skill)));
      handleCloseEditDialog();
    }
  };

  // Open add dialog
  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  // Close add dialog
  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setNewSkill({
      name: '',
      category: '',
      difficulty: 'Beginner',
      xpValue: 100,
      level: 1,
      prerequisites: [],
      isActive: true,
      description: '',
    });
  };

  // Handle new skill form change
  const handleNewSkillChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewSkill({
      ...newSkill,
      [name]: name === 'xpValue' || name === 'level' ? Number(value) : value,
    });
  };

  // Handle new skill select change
  const handleNewSkillSelectChange = (event: SelectChangeEvent) => {
    setNewSkill({
      ...newSkill,
      [event.target.name]: event.target.value,
    });
  };

  // Handle new skill switch change
  const handleNewSkillSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewSkill({
      ...newSkill,
      [event.target.name]: event.target.checked,
    });
  };

  // Handle new skill prerequisites change
  const handleNewSkillPrerequisitesChange = (event: any, newValue: number[]) => {
    setNewSkill({
      ...newSkill,
      prerequisites: newValue,
    });
  };

  // Add new skill
  const handleAddSkill = () => {
    const newId = Math.max(...skills.map(skill => skill.id)) + 1;
    const skillToAdd = {
      ...newSkill,
      id: newId,
    } as Skill;
    
    setSkills([...skills, skillToAdd]);
    handleCloseAddDialog();
  };

  // Filter skills based on search term and filters
  const filteredSkills = skills.filter(skill => {
    const matchesSearch = 
      skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || skill.category === filterCategory;
    const matchesDifficulty = filterDifficulty === 'all' || skill.difficulty === filterDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Get current page skills
  const currentSkills = filteredSkills.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Get skill name by id
  const getSkillNameById = (id: number) => {
    const skill = skills.find(s => s.id === id);
    return skill ? skill.name : 'Unknown';
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight="bold">
          Skill Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleOpenAddDialog}
          sx={{ borderRadius: 2 }}
        >
          Add New Skill
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search skills..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ minWidth: 250, flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="category-filter-label">Category</InputLabel>
          <Select
            labelId="category-filter-label"
            id="category-filter"
            value={filterCategory}
            label="Category"
            onChange={handleCategoryFilter}
          >
            <MenuItem value="all">All Categories</MenuItem>
            {categories.map(category => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="difficulty-filter-label">Difficulty</InputLabel>
          <Select
            labelId="difficulty-filter-label"
            id="difficulty-filter"
            value={filterDifficulty}
            label="Difficulty"
            onChange={handleDifficultyFilter}
          >
            <MenuItem value="all">All Difficulties</MenuItem>
            {difficulties.map(difficulty => (
              <MenuItem key={difficulty} value={difficulty}>{difficulty}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Skills Table */}
      <TableContainer component={Paper} sx={{ mb: 2, borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="skills table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Difficulty</TableCell>
              <TableCell>XP Value</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Prerequisites</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentSkills.map((skill) => (
              <TableRow key={skill.id} hover>
                <TableCell>{skill.id}</TableCell>
                <TableCell>{skill.name}</TableCell>
                <TableCell>
                  <Chip
                    icon={<Category fontSize="small" />}
                    label={skill.category}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    icon={<FitnessCenter fontSize="small" />}
                    label={skill.difficulty}
                    size="small"
                    color={
                      skill.difficulty === 'Beginner' ? 'success' :
                      skill.difficulty === 'Intermediate' ? 'info' :
                      skill.difficulty === 'Advanced' ? 'warning' : 'error'
                    }
                  />
                </TableCell>
                <TableCell>{skill.xpValue}</TableCell>
                <TableCell>{skill.level}</TableCell>
                <TableCell>
                  {skill.prerequisites.length > 0 ? (
                    skill.prerequisites.map(prereqId => (
                      <Chip
                        key={prereqId}
                        label={getSkillNameById(prereqId)}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">None</Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={skill.isActive ? 'Active' : 'Inactive'}
                    color={skill.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleOpenEditDialog(skill)}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDeleteDialog(skill)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredSkills.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete skill "{selectedSkill?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteSkill} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Skill Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Skill</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Skill Name"
                fullWidth
                value={editFormData?.name || ''}
                onChange={handleEditFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="edit-category-label">Category</InputLabel>
                <Select
                  labelId="edit-category-label"
                  id="edit-category"
                  name="category"
                  value={editFormData?.category || ''}
                  label="Category"
                  onChange={handleEditFormSelectChange}
                >
                  {categories.map(category => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="edit-difficulty-label">Difficulty</InputLabel>
                <Select
                  labelId="edit-difficulty-label"
                  id="edit-difficulty"
                  name="difficulty"
                  value={editFormData?.difficulty || ''}
                  label="Difficulty"
                  onChange={handleEditFormSelectChange}
                >
                  {difficulties.map(difficulty => (
                    <MenuItem key={difficulty} value={difficulty}>{difficulty}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="xpValue"
                label="XP Value"
                type="number"
                fullWidth
                value={editFormData?.xpValue || ''}
                onChange={handleEditFormChange}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="level"
                label="Level"
                type="number"
                fullWidth
                value={editFormData?.level || ''}
                onChange={handleEditFormChange}
                InputProps={{ inputProps: { min: 1, max: 5 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editFormData?.isActive || false}
                    onChange={handleEditFormSwitchChange}
                    name="isActive"
                    color="primary"
                  />
                }
                label="Active"
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                id="prerequisites"
                options={skills.filter(s => s.id !== editFormData?.id).map(s => s.id)}
                getOptionLabel={(option) => getSkillNameById(option)}
                value={editFormData?.prerequisites || []}
                onChange={handlePrerequisitesChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Prerequisites"
                    placeholder="Select prerequisites"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={editFormData?.description || ''}
                onChange={handleEditFormChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleSaveSkill} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Skill Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Skill</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Skill Name"
                fullWidth
                value={newSkill.name}
                onChange={handleNewSkillChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="new-category-label">Category</InputLabel>
                <Select
                  labelId="new-category-label"
                  id="new-category"
                  name="category"
                  value={newSkill.category}
                  label="Category"
                  onChange={handleNewSkillSelectChange}
                >
                  {categories.map(category => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="new-difficulty-label">Difficulty</InputLabel>
                <Select
                  labelId="new-difficulty-label"
                  id="new-difficulty"
                  name="difficulty"
                  value={newSkill.difficulty}
                  label="Difficulty"
                  onChange={handleNewSkillSelectChange}
                >
                  {difficulties.map(difficulty => (
                    <MenuItem key={difficulty} value={difficulty}>{difficulty}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="xpValue"
                label="XP Value"
                type="number"
                fullWidth
                value={newSkill.xpValue}
                onChange={handleNewSkillChange}
                InputProps={{ inputProps: { min: 1 } }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="level"
                label="Level"
                type="number"
                fullWidth
                value={newSkill.level}
                onChange={handleNewSkillChange}
                InputProps={{ inputProps: { min: 1, max: 5 } }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={newSkill.isActive}
                    onChange={handleNewSkillSwitchChange}
                    name="isActive"
                    color="primary"
                  />
                }
                label="Active"
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                id="new-prerequisites"
                options={skills.map(s => s.id)}
                getOptionLabel={(option) => getSkillNameById(option)}
                value={newSkill.prerequisites}
                onChange={handleNewSkillPrerequisitesChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Prerequisites"
                    placeholder="Select prerequisites"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={newSkill.description}
                onChange={handleNewSkillChange}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button 
            onClick={handleAddSkill} 
            color="primary" 
            variant="contained"
            disabled={!newSkill.name || !newSkill.category || !newSkill.description}
          >
            Add Skill
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 