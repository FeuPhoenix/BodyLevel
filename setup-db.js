import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
  console.log('Setting up database...');
  
  // Create connection without database name first
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true // Allow multiple SQL statements
  });
  
  try {
    // Read SQL file
    const sqlFilePath = path.join(__dirname, 'setup-database.sql');
    const sqlScript = await fs.readFile(sqlFilePath, 'utf8');
    
    // Execute SQL script
    console.log('Executing SQL script...');
    await connection.query(sqlScript);
    
    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await connection.end();
  }
}

setupDatabase(); 