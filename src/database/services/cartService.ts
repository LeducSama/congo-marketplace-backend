import getDatabase from '../database.js';
import { ProductService } from './productService.js';
import type { CartItem } from '../../types/index.js';

const db = getDatabase();

export class CartService {
  // Get cart items for a user
  static getCartItems(userId: string): CartItem[] {
    const query = `
      SELECT ci.id, ci.quantity, ci.created_at, ci.updated_at, p.id as product_id
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ? AND p.is_active = 1
      ORDER BY ci.created_at DESC
    `;

    const rows = db.prepare(query).all(userId) as any[];
    
    return rows.map(row => {
      const product = ProductService.getProductById(row.product_id.toString());
      if (!product) {
        // If product is not found, remove it from cart
        this.removeFromCart(userId, row.product_id.toString());
        return null;
      }

      return {
        id: row.id.toString(),
        product: product,
        quantity: row.quantity
      };
    }).filter(item => item !== null) as CartItem[];
  }

  // Add item to cart
  static addToCart(userId: string, productId: string, quantity: number = 1): boolean {
    try {
      // Check if item already exists in cart
      const existingQuery = `
        SELECT id, quantity FROM cart_items 
        WHERE user_id = ? AND product_id = ?
      `;
      
      const existing = db.prepare(existingQuery).get(userId, productId) as any;

      if (existing) {
        // Update quantity if item exists
        const updateQuery = `
          UPDATE cart_items 
          SET quantity = quantity + ?, updated_at = CURRENT_TIMESTAMP 
          WHERE id = ?
        `;
        db.prepare(updateQuery).run(quantity, existing.id);
      } else {
        // Insert new item
        const insertQuery = `
          INSERT INTO cart_items (user_id, product_id, quantity)
          VALUES (?, ?, ?)
        `;
        db.prepare(insertQuery).run(userId, productId, quantity);
      }

      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  }

  // Update cart item quantity
  static updateCartItemQuantity(userId: string, cartItemId: string, quantity: number): boolean {
    try {
      if (quantity <= 0) {
        return this.removeCartItem(userId, cartItemId);
      }

      const query = `
        UPDATE cart_items 
        SET quantity = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ? AND user_id = ?
      `;
      
      const result = db.prepare(query).run(quantity, cartItemId, userId);
      return result.changes > 0;
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      return false;
    }
  }

  // Remove specific cart item
  static removeCartItem(userId: string, cartItemId: string): boolean {
    try {
      const query = `
        DELETE FROM cart_items 
        WHERE id = ? AND user_id = ?
      `;
      
      const result = db.prepare(query).run(cartItemId, userId);
      return result.changes > 0;
    } catch (error) {
      console.error('Error removing cart item:', error);
      return false;
    }
  }

  // Remove product from cart
  static removeFromCart(userId: string, productId: string): boolean {
    try {
      const query = `
        DELETE FROM cart_items 
        WHERE user_id = ? AND product_id = ?
      `;
      
      const result = db.prepare(query).run(userId, productId);
      return result.changes > 0;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return false;
    }
  }

  // Clear entire cart for user
  static clearCart(userId: string): boolean {
    try {
      const query = `DELETE FROM cart_items WHERE user_id = ?`;
      db.prepare(query).run(userId);
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    }
  }

  // Get cart item count for user
  static getCartItemCount(userId: string): number {
    const query = `
      SELECT COALESCE(SUM(quantity), 0) as total_count
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ? AND p.is_active = 1
    `;

    const result = db.prepare(query).get(userId) as any;
    return result.total_count || 0;
  }

  // Get cart total
  static getCartTotal(userId: string): { subtotal: number; itemCount: number } {
    const query = `
      SELECT 
        COALESCE(SUM(p.price * ci.quantity), 0) as subtotal,
        COALESCE(SUM(ci.quantity), 0) as item_count
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ? AND p.is_active = 1
    `;

    const result = db.prepare(query).get(userId) as any;
    return {
      subtotal: result.subtotal || 0,
      itemCount: result.item_count || 0
    };
  }
}