import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Skill, SkillProgress, SkillStatus } from '../../types';
import { initialSkills } from './initialSkills';

// Debug initial skills
console.log('Initial skills count:', initialSkills.length);
console.log('Initial skills categories:', [...new Set(initialSkills.map(skill => skill.category))]);

// Load progress from localStorage if available
const loadProgressFromStorage = (): Record<string, SkillProgress> => {
  try {
    const savedProgress = localStorage.getItem('bodyLevelProgress');
    return savedProgress ? JSON.parse(savedProgress) : {};
  } catch (error) {
    console.error('Failed to load progress from localStorage:', error);
    return {};
  }
};

// Initialize skills with saved progress
const initializeSkills = (skills: Skill[], progress: Record<string, SkillProgress>): Skill[] => {
  const initializedSkills = skills.map(skill => {
    // Set initial status based on prerequisites
    let status: SkillStatus = 'locked';
    
    // If no prerequisites, it's unlocked by default
    if (skill.prerequisites.length === 0) {
      status = 'unlocked';
    } 
    // Check if all prerequisites are completed
    else if (skill.prerequisites.every(preId => {
      const preProgress = progress[preId];
      return preProgress && preProgress.completed;
    })) {
      status = 'unlocked';
    }
    
    // Check if this skill has progress
    if (progress[skill.id]) {
      if (progress[skill.id].completed) {
        status = 'completed';
      } else {
        status = 'in-progress';
      }
    }
    
    return {
      ...skill,
      status
    };
  });
  
  // Debug initialized skills
  console.log('Initialized skills count:', initializedSkills.length);
  console.log('Initialized skills categories:', [...new Set(initializedSkills.map(skill => skill.category))]);
  
  return initializedSkills;
};

const savedProgress = loadProgressFromStorage();

const initialState = {
  skills: initializeSkills(initialSkills, savedProgress),
  progress: savedProgress,
  loading: false,
  error: null as string | null,
};

// Debug initial state
console.log('Redux initial state - skills count:', initialState.skills.length);
console.log('Redux initial state - skills categories:', [...new Set(initialState.skills.map(skill => skill.category))]);

const skillsSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {
    updateSkillProgress: (state, action: PayloadAction<{ skillId: string, sets: number, reps: number }>) => {
      const { skillId, sets, reps } = action.payload;
      const skill = state.skills.find(s => s.id === skillId);
      
      if (!skill) return;
      
      // Update or create progress entry
      state.progress[skillId] = {
        skillId,
        currentSets: sets,
        currentReps: reps,
        lastUpdated: new Date().toISOString(),
        completed: sets >= skill.requirements.sets && reps >= skill.requirements.reps
      };
      
      // Update skill status
      const skillIndex = state.skills.findIndex(s => s.id === skillId);
      if (skillIndex !== -1) {
        if (state.progress[skillId].completed) {
          state.skills[skillIndex].status = 'completed';
        } else {
          state.skills[skillIndex].status = 'in-progress';
        }
      }
      
      // Check if any locked skills should be unlocked
      state.skills.forEach((s, index) => {
        if (s.status === 'locked') {
          const allPrerequisitesCompleted = s.prerequisites.every(
            preId => state.progress[preId]?.completed
          );
          
          if (allPrerequisitesCompleted) {
            state.skills[index].status = 'unlocked';
          }
        }
      });
      
      // Save to localStorage
      localStorage.setItem('bodyLevelProgress', JSON.stringify(state.progress));
    },
    
    resetProgress: (state) => {
      state.progress = {};
      state.skills = initializeSkills(initialSkills, {});
      localStorage.removeItem('bodyLevelProgress');
    },
    
    importProgress: (state, action: PayloadAction<Record<string, SkillProgress>>) => {
      state.progress = action.payload;
      state.skills = initializeSkills(initialSkills, action.payload);
      localStorage.setItem('bodyLevelProgress', JSON.stringify(action.payload));
    }
  }
});

export const { updateSkillProgress, resetProgress, importProgress } = skillsSlice.actions;
export default skillsSlice.reducer; 