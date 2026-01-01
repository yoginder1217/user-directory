import { UserProfile } from "@/types";
import { runAsync, getAsync, allAsync } from "./database";

export async function getUsers(): Promise<UserProfile[]> {
  try {
    const users = await allAsync<any>(
      `SELECT * FROM users ORDER BY createdAt DESC`
    );
    // Skills, projects, publications are already arrays from database
    // Don't parse them again
    return users.map(u => ({
      ...u,
      skills: Array.isArray(u.skills) ? u.skills : [],
      projects: Array.isArray(u.projects) ? u.projects : [],
      publications: Array.isArray(u.publications) ? u.publications : []
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export async function addOrUpdateUser(user: UserProfile): Promise<UserProfile> {
  try {
    const existing = await getAsync<any>(
      `SELECT id FROM users WHERE id = ?`,
      [user.id]
    );

    // Skills, projects, publications are already arrays - store as JSON strings
    const skillsJson = JSON.stringify(user.skills || []);
    const projectsJson = JSON.stringify(user.projects || []);
    const publicationsJson = JSON.stringify(user.publications || []);

    if (existing) {
      // Update
      await runAsync(
        `UPDATE users SET 
          name = ?, 
          email = ?, 
          phone = ?, 
          role = ?, 
          department = ?, 
          yearOrPosition = ?, 
          summary = ?, 
          skills = ?, 
          projects = ?, 
          publications = ?, 
          image = ?, 
          location = ?,
          updatedAt = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [
          user.name,
          user.email,
          user.phone || null,
          user.role,
          user.department,
          user.yearOrPosition,
          user.summary || null,
          skillsJson,
          projectsJson,
          publicationsJson,
          user.image || null,
          user.location || null,
          user.id
        ]
      );
    } else {
      // Create
      await runAsync(
        `INSERT INTO users (
          id, name, email, phone, role, department, yearOrPosition,
          summary, skills, projects, publications, image, location
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user.id || `user_${Date.now()}`,
          user.name,
          user.email,
          user.phone || null,
          user.role,
          user.department,
          user.yearOrPosition,
          user.summary || null,
          skillsJson,
          projectsJson,
          publicationsJson,
          user.image || null,
          user.location || null
        ]
      );
    }

    return user;
  } catch (error) {
    console.error("Error saving user:", error);
    throw error;
  }
}

export async function getUserById(id: string): Promise<UserProfile | null> {
  try {
    const user = await getAsync<any>(
      `SELECT * FROM users WHERE id = ?`,
      [id]
    );
    
    if (!user) return null;
    
    return {
      ...user,
      skills: Array.isArray(user.skills) ? user.skills : [],
      projects: Array.isArray(user.projects) ? user.projects : [],
      publications: Array.isArray(user.publications) ? user.publications : []
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function deleteUser(id: string): Promise<boolean> {
  try {
    await runAsync(`DELETE FROM users WHERE id = ?`, [id]);
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    return false;
  }
}