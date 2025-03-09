export type ThemeMode = 'light' | 'dark';

export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  cardBackgroundColor: string;
  lockedColor: string;
  unlockedColor: string;
  inProgressColor: string;
  completedColor: string;
} 