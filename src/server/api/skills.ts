import express from 'express';
import authService from '../services/authService.js';
import skillProgressService from '../services/skillProgressService.js';

const router = express.Router();

// Authentication middleware
const authenticate = async (req: any, res: any, next: any) => {
  try {
    // Get token from cookie or authorization header
    const token = req.cookies.auth_token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Verify token
    const userId = await authService.verifyToken(token);
    
    // Add user ID to request
    req.userId = userId;
    
    next();
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

/**
 * Get all skills with user progress
 * GET /api/skills
 */
router.get('/', authenticate, async (req: any, res) => {
  try {
    const skills = await skillProgressService.getUserSkills(req.userId);
    res.json({ skills });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Get skill progress for a specific skill
 * GET /api/skills/:skillId/progress
 */
router.get('/:skillId/progress', authenticate, async (req: any, res) => {
  try {
    const { skillId } = req.params;
    
    const progress = await skillProgressService.getSkillProgress(req.userId, skillId);
    
    if (!progress) {
      return res.status(404).json({ error: 'Skill progress not found' });
    }
    
    res.json({ progress });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Update skill progress
 * PUT /api/skills/:skillId/progress
 */
router.put('/:skillId/progress', authenticate, async (req: any, res) => {
  try {
    const { skillId } = req.params;
    const { sets, reps } = req.body;
    
    // Validate input
    if (sets === undefined && reps === undefined) {
      return res.status(400).json({ error: 'Sets or reps are required' });
    }
    
    const progress = await skillProgressService.updateSkillProgress(req.userId, skillId, {
      sets,
      reps
    });
    
    res.json({ progress });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Get user total XP
 * GET /api/skills/xp
 */
router.get('/xp', authenticate, async (req: any, res) => {
  try {
    const totalXP = await skillProgressService.getUserTotalXP(req.userId);
    res.json({ totalXP });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Get user level
 * GET /api/skills/level
 */
router.get('/level', authenticate, async (req: any, res) => {
  try {
    const level = await skillProgressService.getUserLevel(req.userId);
    res.json({ level });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router; 