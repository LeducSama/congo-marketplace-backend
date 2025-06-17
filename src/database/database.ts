import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database connection
let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    // Create database file in project root
    const dbPath = join(process.cwd(), 'marketplace.db');
    db = new Database(dbPath);
    
    // Enable foreign key constraints
    db.pragma('foreign_keys = ON');
    
    // Initialize database with schema
    initializeDatabase();
  }
  
  return db;
}

function initializeDatabase() {
  if (!db) return;
  
  try {
    // Read and execute schema
    const schemaPath = join(__dirname, 'schemas', 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');
    
    // Split by statements and execute each one
    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        db.exec(statement + ';');
      }
    }
    
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}

// Graceful shutdown
process.on('exit', closeDatabase);
process.on('SIGINT', () => {
  closeDatabase();
  process.exit(0);
});
process.on('SIGTERM', () => {
  closeDatabase();
  process.exit(0);
});

export default getDatabase;