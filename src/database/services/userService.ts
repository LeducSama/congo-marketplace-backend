import getDatabase from '../database.js';
import type { User } from '../../types/index.js';

const db = getDatabase();

export class UserService {
  // Get user by ID
  static getUserById(id: string): User | null {
    const query = `
      SELECT * FROM users 
      WHERE id = ? AND is_active = 1
    `;

    const row = db.prepare(query).get(id) as any;
    if (!row) return null;

    return {
      id: row.id.toString(),
      name: row.name,
      email: row.email,
      avatar: row.avatar,
      role: row.role as 'buyer' | 'vendor' | 'admin',
      createdAt: new Date(row.created_at)
    };
  }

  // Get user by email
  static getUserByEmail(email: string): User | null {
    const query = `
      SELECT * FROM users 
      WHERE email = ? AND is_active = 1
    `;

    const row = db.prepare(query).get(email) as any;
    if (!row) return null;

    return {
      id: row.id.toString(),
      name: row.name,
      email: row.email,
      avatar: row.avatar,
      role: row.role as 'buyer' | 'vendor' | 'admin',
      createdAt: new Date(row.created_at)
    };
  }

  // Create new user
  static createUser(userData: {
    name: string;
    email: string;
    passwordHash: string;
    phone?: string;
    address?: string;
    avatar?: string;
    role?: 'buyer' | 'vendor' | 'admin';
  }): string | null {
    try {
      const query = `
        INSERT INTO users (name, email, password_hash, phone, address, avatar, role)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const result = db.prepare(query).run(
        userData.name,
        userData.email,
        userData.passwordHash,
        userData.phone || null,
        userData.address || null,
        userData.avatar || null,
        userData.role || 'buyer'
      );

      return result.lastInsertRowid.toString();
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  }

  // Update user profile
  static updateUserProfile(userId: string, updates: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    avatar?: string;
  }): boolean {
    try {
      const fields = [];
      const values = [];

      if (updates.name !== undefined) {
        fields.push('name = ?');
        values.push(updates.name);
      }
      if (updates.email !== undefined) {
        fields.push('email = ?');
        values.push(updates.email);
      }
      if (updates.phone !== undefined) {
        fields.push('phone = ?');
        values.push(updates.phone);
      }
      if (updates.address !== undefined) {
        fields.push('address = ?');
        values.push(updates.address);
      }
      if (updates.avatar !== undefined) {
        fields.push('avatar = ?');
        values.push(updates.avatar);
      }

      if (fields.length === 0) return false;

      fields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(userId);

      const query = `
        UPDATE users 
        SET ${fields.join(', ')}
        WHERE id = ? AND is_active = 1
      `;

      const result = db.prepare(query).run(...values);
      return result.changes > 0;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return false;
    }
  }

  // Verify user password (for authentication)
  static verifyUserPassword(email: string, passwordHash: string): User | null {
    const query = `
      SELECT * FROM users 
      WHERE email = ? AND password_hash = ? AND is_active = 1
    `;

    const row = db.prepare(query).get(email, passwordHash) as any;
    if (!row) return null;

    return {
      id: row.id.toString(),
      name: row.name,
      email: row.email,
      avatar: row.avatar,
      role: row.role as 'buyer' | 'vendor' | 'admin',
      createdAt: new Date(row.created_at)
    };
  }

  // Deactivate user account
  static deactivateUser(userId: string): boolean {
    try {
      const query = `
        UPDATE users 
        SET is_active = 0, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `;

      const result = db.prepare(query).run(userId);
      return result.changes > 0;
    } catch (error) {
      console.error('Error deactivating user:', error);
      return false;
    }
  }

  // Get user statistics
  static getUserStats(userId: string): {
    totalOrders: number;
    totalSpent: number;
    wishlistItems: number;
    cartItems: number;
  } {
    const ordersQuery = `
      SELECT COUNT(*) as total_orders, COALESCE(SUM(total_amount), 0) as total_spent
      FROM orders 
      WHERE user_id = ?
    `;

    const wishlistQuery = `
      SELECT COUNT(*) as wishlist_count
      FROM wishlist w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ? AND p.is_active = 1
    `;

    const cartQuery = `
      SELECT COALESCE(SUM(quantity), 0) as cart_count
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ? AND p.is_active = 1
    `;

    const orderStats = db.prepare(ordersQuery).get(userId) as any;
    const wishlistStats = db.prepare(wishlistQuery).get(userId) as any;
    const cartStats = db.prepare(cartQuery).get(userId) as any;

    return {
      totalOrders: orderStats.total_orders || 0,
      totalSpent: orderStats.total_spent || 0,
      wishlistItems: wishlistStats.wishlist_count || 0,
      cartItems: cartStats.cart_count || 0
    };
  }
}