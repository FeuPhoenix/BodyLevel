-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS bodylevel;

-- Use the database
USE bodylevel;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id VARCHAR(36) PRIMARY KEY,
  display_name VARCHAR(100),
  bio TEXT,
  avatar_url VARCHAR(255),
  theme_preference ENUM('light', 'dark') DEFAULT 'light',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  category ENUM('Push', 'Pull', 'Legs', 'Core') NOT NULL,
  level INT NOT NULL,
  requirements_sets INT NOT NULL,
  requirements_reps INT NOT NULL,
  requirements_description TEXT,
  video_url VARCHAR(255),
  image_url VARCHAR(255),
  position_x FLOAT NOT NULL,
  position_y FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create skill_prerequisites table
CREATE TABLE IF NOT EXISTS skill_prerequisites (
  skill_id VARCHAR(36) NOT NULL,
  prerequisite_id VARCHAR(36) NOT NULL,
  PRIMARY KEY (skill_id, prerequisite_id),
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
  FOREIGN KEY (prerequisite_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- Create user_skill_progress table
CREATE TABLE IF NOT EXISTS user_skill_progress (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  skill_id VARCHAR(36) NOT NULL,
  status ENUM('locked', 'unlocked', 'in-progress', 'completed') DEFAULT 'locked',
  current_sets INT DEFAULT 0,
  current_reps INT DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
  UNIQUE KEY user_skill_unique (user_id, skill_id)
);

-- Insert some sample skills data
INSERT INTO skills (id, title, description, category, level, requirements_sets, requirements_reps, requirements_description, position_x, position_y)
VALUES
  ('1', 'Push-up', 'Basic push-up exercise', 'Push', 1, 3, 10, 'Complete 3 sets of 10 push-ups', 100, 100),
  ('2', 'Pull-up', 'Basic pull-up exercise', 'Pull', 2, 3, 8, 'Complete 3 sets of 8 pull-ups', 300, 100),
  ('3', 'Squat', 'Basic squat exercise', 'Legs', 1, 3, 15, 'Complete 3 sets of 15 squats', 100, 300),
  ('4', 'Plank', 'Core stabilization exercise', 'Core', 1, 3, 30, 'Hold plank for 30 seconds, 3 times', 300, 300);

-- Set up skill prerequisites
INSERT INTO skill_prerequisites (skill_id, prerequisite_id)
VALUES
  ('2', '1'); -- Pull-up requires Push-up 