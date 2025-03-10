import { v4 as uuidv4 } from 'uuid';
import db from '../db/db.js';

// Types
export interface Skill {
  id: string;
  title: string;
  description: string;
  category: 'Push' | 'Pull' | 'Legs' | 'Core';
  level: number;
  requirements_sets: number;
  requirements_reps: number;
  requirements_description: string;
  video_url?: string;
  image_url?: string;
  position_x: number;
  position_y: number;
}

export interface SkillWithStatus extends Skill {
  status: 'locked' | 'unlocked' | 'in-progress' | 'completed';
  current_sets: number;
  current_reps: number;
  completed: boolean;
}

export interface SkillProgress {
  id: string;
  user_id: string;
  skill_id: string;
  status: 'locked' | 'unlocked' | 'in-progress' | 'completed';
  current_sets: number;
  current_reps: number;
  completed: boolean;
  last_updated: string;
}

export interface UpdateProgressData {
  sets?: number;
  reps?: number;
}

/**
 * Get all skills with user progress
 * @param userId User ID
 * @returns Array of skills with user progress
 */
export async function getUserSkills(userId: string): Promise<SkillWithStatus[]> {
  try {
    const sql = `
      SELECT 
        s.*, 
        COALESCE(usp.status, 'locked') as status,
        COALESCE(usp.current_sets, 0) as current_sets,
        COALESCE(usp.current_reps, 0) as current_reps,
        COALESCE(usp.completed, FALSE) as completed
      FROM 
        skills s
      LEFT JOIN 
        user_skill_progress usp ON s.id = usp.skill_id AND usp.user_id = ?
      ORDER BY 
        s.category, s.level
    `;
    
    const skills = await db.query<SkillWithStatus[]>(sql, [userId]);
    
    // Process skills to determine which ones should be unlocked
    const processedSkills = await processSkillStatuses(userId, skills);
    
    return processedSkills;
  } catch (error) {
    console.error('Get user skills error:', error);
    throw error;
  }
}

/**
 * Process skill statuses to determine which ones should be unlocked
 * @param userId User ID
 * @param skills Array of skills with current status
 * @returns Processed skills with updated statuses
 */
async function processSkillStatuses(userId: string, skills: SkillWithStatus[]): Promise<SkillWithStatus[]> {
  try {
    // Get all skill prerequisites
    const prerequisites = await db.query<{ skill_id: string, prerequisite_id: string }[]>(
      'SELECT skill_id, prerequisite_id FROM skill_prerequisites'
    );
    
    // Create a map of skill IDs to their prerequisites
    const skillPrerequisites: Record<string, string[]> = {};
    prerequisites.forEach(prereq => {
      if (!skillPrerequisites[prereq.skill_id]) {
        skillPrerequisites[prereq.skill_id] = [];
      }
      skillPrerequisites[prereq.skill_id].push(prereq.prerequisite_id);
    });
    
    // Create a map of skill IDs to skills
    const skillMap: Record<string, SkillWithStatus> = {};
    skills.forEach(skill => {
      skillMap[skill.id] = { ...skill };
    });
    
    // Process each skill
    const processedSkills = skills.map(skill => {
      const processedSkill = { ...skill };
      
      // If skill is already completed or in progress, keep its status
      if (processedSkill.status === 'completed' || processedSkill.status === 'in-progress') {
        return processedSkill;
      }
      
      // Check if skill has prerequisites
      const prereqIds = skillPrerequisites[skill.id] || [];
      
      // If no prerequisites, skill should be unlocked
      if (prereqIds.length === 0) {
        if (processedSkill.status === 'locked') {
          processedSkill.status = 'unlocked';
          // Update in database
          updateSkillStatus(userId, skill.id, 'unlocked');
        }
        return processedSkill;
      }
      
      // Check if all prerequisites are completed
      const allPrereqsCompleted = prereqIds.every(prereqId => {
        const prereq = skillMap[prereqId];
        return prereq && prereq.status === 'completed';
      });
      
      // If all prerequisites are completed, skill should be unlocked
      if (allPrereqsCompleted && processedSkill.status === 'locked') {
        processedSkill.status = 'unlocked';
        // Update in database
        updateSkillStatus(userId, skill.id, 'unlocked');
      }
      
      return processedSkill;
    });
    
    return processedSkills;
  } catch (error) {
    console.error('Process skill statuses error:', error);
    throw error;
  }
}

/**
 * Update skill status in database
 * @param userId User ID
 * @param skillId Skill ID
 * @param status New status
 */
async function updateSkillStatus(
  userId: string,
  skillId: string,
  status: 'locked' | 'unlocked' | 'in-progress' | 'completed'
): Promise<void> {
  try {
    // Check if progress record exists
    const existingProgress = await db.queryOne<SkillProgress>(
      'SELECT * FROM user_skill_progress WHERE user_id = ? AND skill_id = ?',
      [userId, skillId]
    );
    
    if (existingProgress) {
      // Update existing record
      await db.update(
        'user_skill_progress',
        { status },
        'user_id = ? AND skill_id = ?',
        [userId, skillId]
      );
    } else {
      // Create new record
      await db.insert('user_skill_progress', {
        id: uuidv4(),
        user_id: userId,
        skill_id: skillId,
        status,
        current_sets: 0,
        current_reps: 0,
        completed: false
      });
    }
  } catch (error) {
    console.error('Update skill status error:', error);
    throw error;
  }
}

/**
 * Get skill progress for a specific skill
 * @param userId User ID
 * @param skillId Skill ID
 * @returns Skill progress
 */
export async function getSkillProgress(
  userId: string,
  skillId: string
): Promise<SkillProgress | null> {
  try {
    return await db.queryOne<SkillProgress>(
      'SELECT * FROM user_skill_progress WHERE user_id = ? AND skill_id = ?',
      [userId, skillId]
    );
  } catch (error) {
    console.error('Get skill progress error:', error);
    throw error;
  }
}

/**
 * Update skill progress
 * @param userId User ID
 * @param skillId Skill ID
 * @param progressData Progress data to update
 * @returns Updated skill progress
 */
export async function updateSkillProgress(
  userId: string,
  skillId: string,
  progressData: UpdateProgressData
): Promise<SkillProgress | null> {
  try {
    // Get skill requirements
    const skill = await db.queryOne<Skill>(
      'SELECT * FROM skills WHERE id = ?',
      [skillId]
    );
    
    if (!skill) {
      throw new Error('Skill not found');
    }
    
    // Get current progress
    let progress = await getSkillProgress(userId, skillId);
    
    // If no progress record exists, create one
    if (!progress) {
      const progressId = uuidv4();
      await db.insert('user_skill_progress', {
        id: progressId,
        user_id: userId,
        skill_id: skillId,
        status: 'in-progress',
        current_sets: progressData.sets || 0,
        current_reps: progressData.reps || 0,
        completed: false
      });
      
      progress = await getSkillProgress(userId, skillId);
    } else {
      // Update progress
      const updateData: Record<string, any> = {
        status: 'in-progress',
        last_updated: new Date()
      };
      
      if (progressData.sets !== undefined) {
        updateData.current_sets = progressData.sets;
      }
      
      if (progressData.reps !== undefined) {
        updateData.current_reps = progressData.reps;
      }
      
      // Check if skill is completed
      const isCompleted = (
        (progressData.sets !== undefined ? progressData.sets : progress.current_sets) >= skill.requirements_sets &&
        (progressData.reps !== undefined ? progressData.reps : progress.current_reps) >= skill.requirements_reps
      );
      
      if (isCompleted) {
        updateData.status = 'completed';
        updateData.completed = true;
        
        // Add XP for completing the skill
        const xpAmount = skill.level * 100;
        await addUserXP(userId, skillId, xpAmount, 'Skill completed');
      }
      
      await db.update(
        'user_skill_progress',
        updateData,
        'user_id = ? AND skill_id = ?',
        [userId, skillId]
      );
      
      progress = await getSkillProgress(userId, skillId);
    }
    
    return progress;
  } catch (error) {
    console.error('Update skill progress error:', error);
    throw error;
  }
}

/**
 * Add XP to user
 * @param userId User ID
 * @param skillId Skill ID
 * @param amount XP amount
 * @param reason Reason for XP
 */
async function addUserXP(
  userId: string,
  skillId: string,
  amount: number,
  reason: string
): Promise<void> {
  try {
    await db.insert('user_xp_history', {
      id: uuidv4(),
      user_id: userId,
      skill_id: skillId,
      xp_amount: amount,
      reason
    });
  } catch (error) {
    console.error('Add user XP error:', error);
    throw error;
  }
}

/**
 * Get user total XP
 * @param userId User ID
 * @returns Total XP
 */
export async function getUserTotalXP(userId: string): Promise<number> {
  try {
    const result = await db.queryOne<{ total_xp: number }>(
      'SELECT SUM(xp_amount) as total_xp FROM user_xp_history WHERE user_id = ?',
      [userId]
    );
    
    return result?.total_xp || 0;
  } catch (error) {
    console.error('Get user total XP error:', error);
    throw error;
  }
}

/**
 * Get user level based on XP
 * @param userId User ID
 * @returns User level
 */
export async function getUserLevel(userId: string): Promise<number> {
  try {
    const totalXP = await getUserTotalXP(userId);
    // Level formula: 1 + floor(totalXP / 500)
    return 1 + Math.floor(totalXP / 500);
  } catch (error) {
    console.error('Get user level error:', error);
    throw error;
  }
}

export default {
  getUserSkills,
  getSkillProgress,
  updateSkillProgress,
  getUserTotalXP,
  getUserLevel
}; 