export type SkillCategory = 'Push' | 'Pull' | 'Legs' | 'Core';

export type SkillStatus = 'locked' | 'unlocked' | 'in-progress' | 'completed';

export interface SkillRequirement {
  sets: number;
  reps: number;
  description?: string;
}

export interface Skill {
  id: string;
  title: string;
  description: string;
  category: SkillCategory;
  requirements: SkillRequirement;
  prerequisites: string[];
  status: SkillStatus;
  videoUrl?: string;
  imageUrl?: string;
  formTips?: string[];
  level: number;
  position: {
    x: number;
    y: number;
  };
}

export interface SkillProgress {
  skillId: string;
  currentSets: number;
  currentReps: number;
  lastUpdated: string; // ISO date string
  completed: boolean;
} 