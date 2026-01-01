import fs from 'fs';
import path from 'path';

const dbDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dbDir, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize empty users file if it doesn't exist
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify([], null, 2));
  console.log('✅ Database initialized at:', dbPath);
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  department: string;
  yearOrPosition: string;
  summary?: string;
  skills: string[];
  projects: string[];
  publications?: string[];
  image?: string;
  location?: string;
  createdAt?: string;
  updatedAt?: string;
}

function readUsers(): User[] {
  try {
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data) || [];
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
}

function writeUsers(users: User[]): void {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error writing users file:', error);
    throw error;
  }
}

export async function allAsync<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  try {
    const users = readUsers();
    return users as T[];
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
}

export async function getAsync<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
  try {
    const users = readUsers();
    const id = params[0];
    const user = users.find(u => u.id === id);
    return user as T | undefined;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

export async function runAsync(sql: string, params: any[] = []): Promise<void> {
  try {
    const users = readUsers();
    
    if (sql.includes('DELETE')) {
      const id = params[0];
      const index = users.findIndex(u => u.id === id);
      if (index >= 0) {
        users.splice(index, 1);
        writeUsers(users);
      }
    } else if (sql.includes('UPDATE')) {
      const id = params[params.length - 1];
      const index = users.findIndex(u => u.id === id);
      
      if (index >= 0) {
        const user = users[index];
        user.name = params[0];
        user.email = params[1];
        user.phone = params[2];
        user.role = params[3];
        user.department = params[4];
        user.yearOrPosition = params[5];
        user.summary = params[6];
        
        try {
          user.skills = JSON.parse(params[7] || '[]');
        } catch {
          user.skills = [];
        }
        
        try {
          user.projects = JSON.parse(params[8] || '[]');
        } catch {
          user.projects = [];
        }
        
        try {
          user.publications = JSON.parse(params[9] || '[]');
        } catch {
          user.publications = [];
        }
        
        user.image = params[10];
        user.location = params[11];
        user.updatedAt = new Date().toISOString();
        
        writeUsers(users);
      }
    } else if (sql.includes('INSERT')) {
      const newUser: User = {
        id: params[0],
        name: params[1],
        email: params[2],
        phone: params[3] || undefined,
        role: params[4],
        department: params[5],
        yearOrPosition: params[6],
        summary: params[7] || undefined,
        skills: JSON.parse(params[8] || '[]'),
        projects: JSON.parse(params[9] || '[]'),
        publications: JSON.parse(params[10] || '[]'),
        image: params[11] || undefined,
        location: params[12] || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      users.push(newUser);
      writeUsers(users);
    }
  } catch (error) {
    console.error('Error running operation:', error);
    throw error;
  }
}

console.log('📁 Database: users.json in data/ directory');