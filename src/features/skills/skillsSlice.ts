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

// Check for custom skills in localStorage
const loadCustomSkills = (): Skill[] => {
  try {
    const mockSkills = localStorage.getItem('mockSkills');
    if (!mockSkills) return initialSkills;
    
    const parsedMockSkills = JSON.parse(mockSkills);
    
    // If no mock skills, return initial skills
    if (!parsedMockSkills || parsedMockSkills.length === 0) return initialSkills;
    
    // Convert admin format skills to application format
    const convertedSkills = parsedMockSkills.map((mockSkill: any) => {
      // Parse requirements from string format (e.g. "3 sets of 10 reps")
      let requirements = { sets: 3, reps: 10, description: mockSkill.requirements };
      
      try {
        const reqMatch = mockSkill.requirements.match(/(\d+)\s*sets\s*of\s*(\d+)\s*reps/i);
        if (reqMatch && reqMatch.length >= 3) {
          requirements = {
            sets: parseInt(reqMatch[1], 10),
            reps: parseInt(reqMatch[2], 10),
            description: mockSkill.requirements
          };
        }
      } catch (e) {
        console.error("Failed to parse requirements:", e);
      }
      
      // Create a proper skill object
      return {
        id: mockSkill.id,
        title: mockSkill.title,
        description: mockSkill.description || `${mockSkill.title} exercise`,
        category: mockSkill.category,
        level: mockSkill.level,
        requirements,
        prerequisites: mockSkill.prerequisites || [],
        status: (mockSkill.status === 'active' ? 'unlocked' : 'locked') as SkillStatus,
        position: { x: 0, y: 0 } // Default position
      } as Skill;
    });
    
    console.log('Loaded custom skills from localStorage:', convertedSkills.length);
    return convertedSkills;
  } catch (error) {
    console.error('Error loading custom skills:', error);
    return initialSkills;
  }
};

const skillsToUse = loadCustomSkills();
const savedProgress = loadProgressFromStorage();

const initialState = {
  skills: initializeSkills(skillsToUse, savedProgress),
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
    // Add the missing fetchSkills action
    fetchSkillsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSkillsSuccess: (state) => {
      state.loading = false;
    },
    fetchSkillsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
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
      state.skills = initializeSkills(state.skills, {});
      localStorage.removeItem('bodyLevelProgress');
    },
    
    importProgress: (state, action: PayloadAction<Record<string, SkillProgress>>) => {
      state.progress = action.payload;
      state.skills = initializeSkills(state.skills, action.payload);
      localStorage.setItem('bodyLevelProgress', JSON.stringify(action.payload));
    },
    
    // New action to update skills from admin panel
    syncAdminSkills: (state) => {
      // Load skills from the admin panel (localStorage)
      const updatedSkills = loadCustomSkills();
      
      // Keep existing progress but apply it to the new skills
      state.skills = initializeSkills(updatedSkills, state.progress);
    },
    
    // New action to update a single skill from admin panel
    updateSkill: (state, action: PayloadAction<Skill>) => {
      const updatedSkill = action.payload;
      const index = state.skills.findIndex(s => s.id === updatedSkill.id);
      
      if (index !== -1) {
        // Update the skill
        state.skills[index] = {
          ...updatedSkill,
          status: state.skills[index].status, // Keep the existing status
        };
      } else {
        // Add new skill
        state.skills.push({
          ...updatedSkill,
          status: updatedSkill.prerequisites.length === 0 ? 'unlocked' : 'locked'
        });
      }
    },
    
    // New action to delete a skill
    deleteSkill: (state, action: PayloadAction<string>) => {
      const skillId = action.payload;
      state.skills = state.skills.filter(s => s.id !== skillId);
      
      // Remove any progress for this skill
      if (state.progress[skillId]) {
        delete state.progress[skillId];
        localStorage.setItem('bodyLevelProgress', JSON.stringify(state.progress));
      }
    }
  }
});

export const { 
  fetchSkillsStart,
  fetchSkillsSuccess,
  fetchSkillsFailure,
  updateSkillProgress, 
  resetProgress, 
  importProgress, 
  syncAdminSkills,
  updateSkill,
  deleteSkill
} = skillsSlice.actions;

// Create a thunk function for fetchSkills
export const fetchSkills = () => async (dispatch: any) => {
  try {
    dispatch(fetchSkillsStart());
    // In a real app, you would fetch skills from an API here
    // For now, we'll just mark it as successful since skills are loaded from local storage
    dispatch(fetchSkillsSuccess());
  } catch (error) {
    dispatch(fetchSkillsFailure(error instanceof Error ? error.message : 'An unknown error occurred'));
  }
};

export default skillsSlice.reducer; 