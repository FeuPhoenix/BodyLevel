import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip
} from '@mui/material';
import { RestartAlt } from '@mui/icons-material';
import { useAppDispatch } from '../../hooks';
import { resetProgress } from '../../features/skills/skillsSlice';

export const ProgressReset: React.FC = () => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  
  const handleOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  const handleReset = () => {
    dispatch(resetProgress());
    setOpen(false);
  };
  
  return (
    <>
      <Tooltip title="Reset All Progress">
        <IconButton onClick={handleOpen} color="inherit">
          <RestartAlt />
        </IconButton>
      </Tooltip>
      
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="reset-dialog-title"
        aria-describedby="reset-dialog-description"
      >
        <DialogTitle id="reset-dialog-title">
          Reset All Progress
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="reset-dialog-description">
            Are you sure you want to reset all your progress? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleReset} color="error" variant="contained">
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}; 