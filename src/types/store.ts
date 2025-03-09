import { Skill, SkillProgress } from './skill';
import { ThemeConfig } from './theme';

export interface SkillsState {
  skills: Skill[];
  progress: Record<string, SkillProgress>;
  loading: boolean;
  error: string | null;
}

export interface ThemeState {
  theme: ThemeConfig;
}

export interface RootState {
  skills: SkillsState;
  theme: ThemeState;
} 