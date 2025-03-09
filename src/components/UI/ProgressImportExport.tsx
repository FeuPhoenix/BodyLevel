import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
  Box,
  Typography,
  Alert
} from '@mui/material';
import { FileUpload, FileDownload } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { importProgress } from '../../features/skills/skillsSlice';
import { SkillProgress } from '../../types';

export const ProgressImportExport: React.FC = () => {
  const dispatch = useAppDispatch();
  const progress = useAppSelector(state => state.skills.progress);
  
  const [importOpen, setImportOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [importData, setImportData] = useState('');
  const [importError, setImportError] = useState('');
  
  const handleImportOpen = () => {
    setImportOpen(true);
    setImportData('');
    setImportError('');
  };
  
  const handleImportClose = () => {
    setImportOpen(false);
  };
  
  const handleExportOpen = () => {
    setExportOpen(true);
  };
  
  const handleExportClose = () => {
    setExportOpen(false);
  };
  
  const handleImport = () => {
    try {
      const parsedData = JSON.parse(importData);
      
      // Validate the imported data
      if (typeof parsedData !== 'object') {
        throw new Error('Invalid data format');
      }
      
      // Check if the data has the correct structure
      Object.values(parsedData).forEach((item: any) => {
        if (!item.skillId || typeof item.currentSets !== 'number' || typeof item.currentReps !== 'number') {
          throw new Error('Invalid progress data structure');
        }
      });
      
      dispatch(importProgress(parsedData as Record<string, SkillProgress>));
      setImportOpen(false);
    } catch (error) {
      setImportError('Invalid JSON data. Please check your format and try again.');
    }
  };
  
  const handleCopyToClipboard = () => {
    const exportData = JSON.stringify(progress, null, 2);
    navigator.clipboard.writeText(exportData);
  };
  
  return (
    <>
      <Tooltip title="Import Progress">
        <IconButton onClick={handleImportOpen} color="inherit">
          <FileUpload />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Export Progress">
        <IconButton onClick={handleExportOpen} color="inherit">
          <FileDownload />
        </IconButton>
      </Tooltip>
      
      {/* Import Dialog */}
      <Dialog
        open={importOpen}
        onClose={handleImportClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Import Progress</DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph>
            Paste your previously exported progress data below:
          </Typography>
          
          {importError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {importError}
            </Alert>
          )}
          
          <TextField
            multiline
            rows={10}
            fullWidth
            variant="outlined"
            value={importData}
            onChange={(e) => setImportData(e.target.value)}
            placeholder="Paste your JSON progress data here..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleImportClose}>Cancel</Button>
          <Button 
            onClick={handleImport} 
            variant="contained" 
            color="primary"
            disabled={!importData.trim()}
          >
            Import
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Export Dialog */}
      <Dialog
        open={exportOpen}
        onClose={handleExportClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Export Progress</DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph>
            Copy the data below to save your progress:
          </Typography>
          
          <TextField
            multiline
            rows={10}
            fullWidth
            variant="outlined"
            value={JSON.stringify(progress, null, 2)}
            InputProps={{
              readOnly: true,
            }}
          />
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleCopyToClipboard}
              startIcon={<FileDownload />}
            >
              Copy to Clipboard
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleExportClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}; 