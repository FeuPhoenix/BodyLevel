import { IconButton, useTheme as useMuiTheme } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';

interface ThemeToggleProps {
  toggleTheme: () => void;
  mode: 'light' | 'dark';
}

export const ThemeToggle = ({ toggleTheme, mode }: ThemeToggleProps) => {
  return (
    <IconButton onClick={toggleTheme} color="inherit" aria-label="toggle theme">
      {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
}; 