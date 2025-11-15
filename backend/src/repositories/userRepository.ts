import db from '../config/database';
import { User, UserWithPassword, CreateUserDto, UpdateUserDto } from '../models/user';
import { hashPassword } from '../utils/password';

const mapUser = (row: any): User => ({
  id: row.id,
  email: row.email,
  name: row.name,
  avatarUrl: row.avatar_url,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at)
});

const mapUserWithPassword = (row: any): UserWithPassword => ({
  ...mapUser(row),
  passwordHash: row.password_hash
});

export class UserRepository {
  async findById(id: string): Promise<User | null> {
    const result = db.query(
      `SELECT id, email, name, avatar_url, created_at, updated_at
       FROM users WHERE id = ?`,
      [id]
    );
    return result.rows[0] ? mapUser(result.rows[0]) : null;
  }

  async findByEmail(email: string): Promise<UserWithPassword | null> {
    const result = db.query(
      `SELECT id, email, password_hash, name, avatar_url, created_at, updated_at
       FROM users WHERE email = ?`,
      [email]
    );
    return result.rows[0] ? mapUserWithPassword(result.rows[0]) : null;
  }

  async findByEmailPublic(email: string): Promise<User | null> {
    const result = db.query(
      `SELECT id, email, name, avatar_url, created_at, updated_at
       FROM users WHERE email = ?`,
      [email]
    );
    return result.rows[0] ? mapUser(result.rows[0]) : null;
  }

  async create(userData: CreateUserDto): Promise<User> {
    const passwordHash = await hashPassword(userData.password);
    const id = this.generateId();
    
    db.query(
      `INSERT INTO users (id, email, password_hash, name, avatar_url)
       VALUES (?, ?, ?, ?, ?)`,
      [id, userData.email, passwordHash, userData.name, userData.avatarUrl || null]
    );
    
    return this.findById(id) as Promise<User>;
  }

  async createFromOAuth(userData: CreateOAuthUserDto): Promise<User> {
    const id = this.generateId();
    
    db.query(
      `INSERT INTO users (id, email, password_hash, name, avatar_url)
       VALUES (?, ?, ?, ?, ?)`,
      [id, userData.email, 'oauth_' + userData.provider, userData.name, userData.avatarUrl || null]
    );
    
    return this.findById(id) as Promise<User>;
  }

  private generateId(): string {
    return Array.from({ length: 32 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }

  async update(id: string, userData: UpdateUserDto): Promise<User | null> {
    const fields: string[] = [];
    const values: any[] = [];

    if (userData.name !== undefined) {
      fields.push(`name = ?`);
      values.push(userData.name);
    }

    if (userData.avatarUrl !== undefined) {
      fields.push(`avatar_url = ?`);
      values.push(userData.avatarUrl);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    db.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = db.query('DELETE FROM users WHERE id = ?', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  async findAll(): Promise<User[]> {
    const result = db.query(
      `SELECT id, email, name, avatar_url, created_at, updated_at
       FROM users ORDER BY created_at DESC`
    );
    return result.rows.map(mapUser);
  }

  async searchByEmail(searchTerm: string): Promise<User[]> {
    const result = db.query(
      `SELECT id, email, name, avatar_url, created_at, updated_at
       FROM users WHERE email LIKE ? OR name LIKE ?
       ORDER BY name ASC LIMIT 20`,
      [`%${searchTerm}%`, `%${searchTerm}%`]
    );
    return result.rows.map(mapUser);
  }
}

export default new UserRepository();
