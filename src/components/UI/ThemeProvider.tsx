import React from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useAppSelector } from '../../hooks';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const themeConfig = useAppSelector(state => state.theme.theme);
  
  const theme = createTheme({
    palette: {
      mode: themeConfig.mode,
      primary: {
        main: themeConfig.primaryColor,
      },
      secondary: {
        main: themeConfig.secondaryColor,
      },
      background: {
        default: themeConfig.backgroundColor,
        paper: themeConfig.cardBackgroundColor,
      },
      text: {
        primary: themeConfig.textColor,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: themeConfig.backgroundColor,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: themeConfig.primaryColor,
              borderRadius: '4px',
            },
          },
        },
      },
    },
  });

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}; 