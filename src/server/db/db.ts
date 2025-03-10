import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bodylevel',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

/**
 * Execute a SQL query with parameters
 * @param sql SQL query string
 * @param params Query parameters
 * @returns Query result
 */
export async function query<T>(sql: string, params?: any[]): Promise<T> {
  try {
    const [results] = await pool.execute(sql, params);
    return results as T;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Get a single row from a query
 * @param sql SQL query string
 * @param params Query parameters
 * @returns Single row or null if not found
 */
export async function queryOne<T>(sql: string, params?: any[]): Promise<T | null> {
  try {
    const results = await query<T[]>(sql, params);
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error('Database queryOne error:', error);
    throw error;
  }
}

/**
 * Insert a record and return the inserted ID
 * @param table Table name
 * @param data Object with column names and values
 * @returns Inserted ID
 */
export async function insert(table: string, data: Record<string, any>): Promise<string> {
  try {
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);
    
    const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
    const result = await query<mysql.ResultSetHeader>(sql, values);
    
    return result.insertId?.toString() || '';
  } catch (error) {
    console.error('Database insert error:', error);
    throw error;
  }
}

/**
 * Update a record
 * @param table Table name
 * @param data Object with column names and values to update
 * @param whereClause WHERE clause
 * @param whereParams Parameters for WHERE clause
 * @returns Number of affected rows
 */
export async function update(
  table: string, 
  data: Record<string, any>, 
  whereClause: string, 
  whereParams: any[]
): Promise<number> {
  try {
    const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(data), ...whereParams];
    
    const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
    const result = await query<mysql.ResultSetHeader>(sql, values);
    
    return result.affectedRows || 0;
  } catch (error) {
    console.error('Database update error:', error);
    throw error;
  }
}

/**
 * Delete a record
 * @param table Table name
 * @param whereClause WHERE clause
 * @param whereParams Parameters for WHERE clause
 * @returns Number of affected rows
 */
export async function remove(
  table: string,
  whereClause: string,
  whereParams: any[]
): Promise<number> {
  try {
    const sql = `DELETE FROM ${table} WHERE ${whereClause}`;
    const result = await query<mysql.ResultSetHeader>(sql, whereParams);
    
    return result.affectedRows || 0;
  } catch (error) {
    console.error('Database delete error:', error);
    throw error;
  }
}

/**
 * Check if the database connection is working
 * @returns True if connected, false otherwise
 */
export async function testConnection(): Promise<boolean> {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
}

export default {
  query,
  queryOne,
  insert,
  update,
  remove,
  testConnection
}; 