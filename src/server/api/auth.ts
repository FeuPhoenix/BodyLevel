import express from 'express';
import authService from '../services/authService.js';

const router = express.Router();

/**
 * Register a new user
 * POST /api/auth/register
 */
router.post('/register', async (req, res) => {
  try {
    const { email, username, password, display_name } = req.body;
    
    // Validate input
    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Email, username, and password are required' });
    }
    
    // Register user
    const user = await authService.registerUser({
      email,
      username,
      password,
      display_name
    });
    
    res.status(201).json({ user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Login user
 * POST /api/auth/login
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Login user
    const result = await authService.loginUser(email, password);
    
    // Set token in cookie
    res.cookie('auth_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.json({
      user: result.user,
      profile: result.profile
    });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

/**
 * Get current user
 * GET /api/auth/me
 */
router.get('/me', async (req, res) => {
  try {
    // Get token from cookie or authorization header
    const token = req.cookies.auth_token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      // Return a 401 status but with a cleaner response
      // This reduces noise in the browser console
      return res.status(401).json({ 
        authenticated: false,
        message: 'Not authenticated' 
      });
    }
    
    // Verify token
    const userId = await authService.verifyToken(token);
    
    // Get user
    const user = await authService.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get user profile
    const profile = await authService.getUserProfile(userId);
    
    res.json({ user, profile });
  } catch (error: any) {
    // Return a 401 status but with a cleaner response
    return res.status(401).json({ 
      authenticated: false,
      message: 'Not authenticated' 
    });
  }
});

/**
 * Update user profile
 * PUT /api/auth/profile
 */
router.put('/profile', async (req, res) => {
  try {
    // Get token from cookie or authorization header
    const token = req.cookies.auth_token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Verify token
    const userId = await authService.verifyToken(token);
    
    // Update profile
    const { display_name, bio, avatar_url, theme_preference } = req.body;
    
    const updatedProfile = await authService.updateUserProfile(userId, {
      display_name,
      bio,
      avatar_url,
      theme_preference
    });
    
    res.json({ profile: updatedProfile });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Logout user
 * POST /api/auth/logout
 */
router.post('/logout', async (req, res) => {
  try {
    // Get token from cookie or authorization header
    const token = req.cookies.auth_token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(200).json({ message: 'Already logged out' });
    }
    
    // Logout user
    await authService.logoutUser(token);
    
    // Clear cookie
    res.clearCookie('auth_token');
    
    res.json({ message: 'Logged out successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router; 