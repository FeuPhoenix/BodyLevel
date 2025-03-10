import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/db.js';

// Types
export interface User {
  id: string;
  email: string;
  username: string;
  role: 'user' | 'admin';
}

export interface UserWithPassword extends User {
  password_hash: string;
}

export interface UserProfile {
  user_id: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  theme_preference: 'light' | 'dark';
}

export interface RegisterUserData {
  email: string;
  username: string;
  password: string;
  display_name?: string;
}

export interface LoginResult {
  user: User;
  token: string;
  profile: UserProfile;
}

// Constants
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d';
const SALT_ROUNDS = 10;

/**
 * Register a new user
 * @param userData User registration data
 * @returns Newly created user
 */
export async function registerUser(userData: RegisterUserData): Promise<User> {
  try {
    // Check if user already exists
    const existingUser = await db.queryOne<UserWithPassword>(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [userData.email, userData.username]
    );
    
    if (existingUser) {
      if (existingUser.email === userData.email) {
        throw new Error('Email already in use');
      } else {
        throw new Error('Username already taken');
      }
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(userData.password, SALT_ROUNDS);
    
    // Create user ID
    const userId = uuidv4();
    
    // Set default role to 'user'
    // For demo purposes, make the first user an admin
    let role = 'user';
    try {
      const countResult = await db.query('SELECT COUNT(*) as count FROM users', []);
      const isFirstUser = countResult.length > 0 && countResult[0].count === 0;
      role = isFirstUser ? 'admin' : 'user';
    } catch (error) {
      console.error('Error checking user count:', error);
      // Default to user role if there's an error
      role = 'user';
    }
    
    // Insert user
    await db.insert('users', {
      id: userId,
      email: userData.email,
      username: userData.username,
      password_hash: passwordHash,
      role
    });
    
    // Create user profile
    await db.insert('user_profiles', {
      user_id: userId,
      display_name: userData.display_name || userData.username,
      theme_preference: 'light'
    });
    
    // Return user without password
    return {
      id: userId,
      email: userData.email,
      username: userData.username,
      role
    };
  } catch (error) {
    console.error('User registration error:', error);
    throw error;
  }
}

/**
 * Login a user
 * @param email User email
 * @param password User password
 * @returns Login result with user data and token
 */
export async function loginUser(email: string, password: string): Promise<LoginResult> {
  try {
    // Find user by email
    const user = await db.queryOne<UserWithPassword>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }
    
    // Get user profile
    const profile = await db.queryOne<UserProfile>(
      'SELECT * FROM user_profiles WHERE user_id = ?',
      [user.id]
    );
    
    if (!profile) {
      throw new Error('User profile not found');
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    // Store session
    const sessionId = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
    
    await db.insert('user_sessions', {
      id: sessionId,
      user_id: user.id,
      token,
      expires_at: expiresAt
    });
    
    // Return user data and token
    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      },
      token,
      profile
    };
  } catch (error) {
    console.error('User login error:', error);
    throw error;
  }
}

/**
 * Verify a JWT token
 * @param token JWT token
 * @returns User ID if token is valid
 */
export async function verifyToken(token: string): Promise<string> {
  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    // Check if session exists
    const session = await db.queryOne(
      'SELECT * FROM user_sessions WHERE token = ? AND expires_at > NOW()',
      [token]
    );
    
    if (!session) {
      throw new Error('Invalid or expired session');
    }
    
    return decoded.userId;
  } catch (error) {
    console.error('Token verification error:', error);
    throw new Error('Invalid token');
  }
}

/**
 * Get user by ID
 * @param userId User ID
 * @returns User data
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const user = await db.queryOne<User>(
      'SELECT id, email, username, role FROM users WHERE id = ?',
      [userId]
    );
    
    return user;
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
}

/**
 * Get user profile by user ID
 * @param userId User ID
 * @returns User profile
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const profile = await db.queryOne<UserProfile>(
      'SELECT * FROM user_profiles WHERE user_id = ?',
      [userId]
    );
    
    return profile;
  } catch (error) {
    console.error('Get user profile error:', error);
    throw error;
  }
}

/**
 * Update user profile
 * @param userId User ID
 * @param profileData Profile data to update
 * @returns Updated profile
 */
export async function updateUserProfile(
  userId: string,
  profileData: Partial<UserProfile>
): Promise<UserProfile | null> {
  try {
    // Remove user_id from update data
    const { user_id, ...updateData } = profileData;
    
    // Update profile
    await db.update(
      'user_profiles',
      updateData,
      'user_id = ?',
      [userId]
    );
    
    // Get updated profile
    return await getUserProfile(userId);
  } catch (error) {
    console.error('Update user profile error:', error);
    throw error;
  }
}

/**
 * Logout user by invalidating session
 * @param token JWT token
 * @returns True if logout successful
 */
export async function logoutUser(token: string): Promise<boolean> {
  try {
    // Delete session
    const affectedRows = await db.remove(
      'user_sessions',
      'token = ?',
      [token]
    );
    
    return affectedRows > 0;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

export default {
  registerUser,
  loginUser,
  verifyToken,
  getUserById,
  getUserProfile,
  updateUserProfile,
  logoutUser
}; 