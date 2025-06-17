import getDatabase from '../database.js';
import { ProductService } from './productService.js';
import type { Product } from '../../types/index.js';

const db = getDatabase();

export class WishlistService {
  // Get wishlist items for a user
  static getWishlistItems(userId: string): Product[] {
    const query = `
      SELECT p.id as product_id
      FROM wishlist w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ? AND p.is_active = 1
      ORDER BY w.created_at DESC
    `;

    const rows = db.prepare(query).all(userId) as any[];
    
    return rows.map(row => {
      return ProductService.getProductById(row.product_id.toString());
    }).filter(product => product !== null) as Product[];
  }

  // Get wishlist product IDs for a user (for checking if product is in wishlist)
  static getWishlistProductIds(userId: string): string[] {
    const query = `
      SELECT p.id as product_id
      FROM wishlist w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ? AND p.is_active = 1
    `;

    const rows = db.prepare(query).all(userId) as any[];
    return rows.map(row => row.product_id.toString());
  }

  // Add item to wishlist
  static addToWishlist(userId: string, productId: string): boolean {
    try {
      const query = `
        INSERT OR IGNORE INTO wishlist (user_id, product_id)
        VALUES (?, ?)
      `;
      
      const result = db.prepare(query).run(userId, productId);
      return result.changes > 0;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return false;
    }
  }

  // Remove item from wishlist
  static removeFromWishlist(userId: string, productId: string): boolean {
    try {
      const query = `
        DELETE FROM wishlist 
        WHERE user_id = ? AND product_id = ?
      `;
      
      const result = db.prepare(query).run(userId, productId);
      return result.changes > 0;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return false;
    }
  }

  // Toggle item in wishlist (add if not exists, remove if exists)
  static toggleWishlistItem(userId: string, productId: string): boolean {
    try {
      // Check if item exists
      const checkQuery = `
        SELECT id FROM wishlist 
        WHERE user_id = ? AND product_id = ?
      `;
      
      const existing = db.prepare(checkQuery).get(userId, productId);

      if (existing) {
        return this.removeFromWishlist(userId, productId);
      } else {
        return this.addToWishlist(userId, productId);
      }
    } catch (error) {
      console.error('Error toggling wishlist item:', error);
      return false;
    }
  }

  // Check if product is in user's wishlist
  static isInWishlist(userId: string, productId: string): boolean {
    const query = `
      SELECT id FROM wishlist 
      WHERE user_id = ? AND product_id = ?
    `;
    
    const result = db.prepare(query).get(userId, productId);
    return !!result;
  }

  // Clear entire wishlist for user
  static clearWishlist(userId: string): boolean {
    try {
      const query = `DELETE FROM wishlist WHERE user_id = ?`;
      db.prepare(query).run(userId);
      return true;
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      return false;
    }
  }

  // Get wishlist item count for user
  static getWishlistItemCount(userId: string): number {
    const query = `
      SELECT COUNT(*) as count
      FROM wishlist w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ? AND p.is_active = 1
    `;

    const result = db.prepare(query).get(userId) as any;
    return result.count || 0;
  }

  // Get wishlist statistics
  static getWishlistStats(userId: string): { 
    itemCount: number; 
    totalValue: number; 
    potentialSavings: number; 
  } {
    const query = `
      SELECT 
        COUNT(*) as item_count,
        COALESCE(SUM(p.price), 0) as total_value,
        COALESCE(SUM(CASE WHEN p.original_price IS NOT NULL THEN p.original_price - p.price ELSE 0 END), 0) as potential_savings
      FROM wishlist w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ? AND p.is_active = 1
    `;

    const result = db.prepare(query).get(userId) as any;
    return {
      itemCount: result.item_count || 0,
      totalValue: result.total_value || 0,
      potentialSavings: result.potential_savings || 0
    };
  }
}