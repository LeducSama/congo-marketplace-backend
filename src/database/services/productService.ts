import getDatabase from '../database.js';
import type { Product, Vendor, Category } from '../../types/index.js';

const db = getDatabase();

export class ProductService {
  // Get all products with vendor and category information
  static getAllProducts(): Product[] {
    const query = `
      SELECT 
        p.*,
        c.name as category_name,
        c.icon as category_icon,
        c.color as category_color,
        v.name as vendor_name,
        v.description as vendor_description,
        v.avatar as vendor_avatar,
        v.banner as vendor_banner,
        v.rating as vendor_rating,
        v.total_sales as vendor_total_sales,
        v.followers as vendor_followers,
        v.is_verified as vendor_is_verified
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN vendors v ON p.vendor_id = v.id
      WHERE p.is_active = 1 AND v.is_active = 1 AND c.is_active = 1
      ORDER BY p.created_at DESC
    `;

    const rows = db.prepare(query).all() as any[];
    return rows.map(row => this.mapRowToProduct(row));
  }

  // Get product by ID
  static getProductById(id: string): Product | null {
    const query = `
      SELECT 
        p.*,
        c.name as category_name,
        c.icon as category_icon,
        c.color as category_color,
        v.name as vendor_name,
        v.description as vendor_description,
        v.avatar as vendor_avatar,
        v.banner as vendor_banner,
        v.rating as vendor_rating,
        v.total_sales as vendor_total_sales,
        v.followers as vendor_followers,
        v.is_verified as vendor_is_verified
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN vendors v ON p.vendor_id = v.id
      WHERE p.id = ? AND p.is_active = 1 AND v.is_active = 1 AND c.is_active = 1
    `;

    const row = db.prepare(query).get(id) as any;
    return row ? this.mapRowToProduct(row) : null;
  }

  // Get products by category
  static getProductsByCategory(categoryName: string): Product[] {
    const query = `
      SELECT 
        p.*,
        c.name as category_name,
        c.icon as category_icon,
        c.color as category_color,
        v.name as vendor_name,
        v.description as vendor_description,
        v.avatar as vendor_avatar,
        v.banner as vendor_banner,
        v.rating as vendor_rating,
        v.total_sales as vendor_total_sales,
        v.followers as vendor_followers,
        v.is_verified as vendor_is_verified
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN vendors v ON p.vendor_id = v.id
      WHERE c.name = ? AND p.is_active = 1 AND v.is_active = 1 AND c.is_active = 1
      ORDER BY p.created_at DESC
    `;

    const rows = db.prepare(query).all(categoryName) as any[];
    return rows.map(row => this.mapRowToProduct(row));
  }

  // Search products
  static searchProducts(searchQuery: string): Product[] {
    const query = `
      SELECT DISTINCT
        p.*,
        c.name as category_name,
        c.icon as category_icon,
        c.color as category_color,
        v.name as vendor_name,
        v.description as vendor_description,
        v.avatar as vendor_avatar,
        v.banner as vendor_banner,
        v.rating as vendor_rating,
        v.total_sales as vendor_total_sales,
        v.followers as vendor_followers,
        v.is_verified as vendor_is_verified
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN vendors v ON p.vendor_id = v.id
      LEFT JOIN product_tags pt ON p.id = pt.product_id
      WHERE (
        p.title LIKE ? OR 
        p.description LIKE ? OR 
        c.name LIKE ? OR 
        v.name LIKE ? OR
        pt.tag LIKE ?
      ) AND p.is_active = 1 AND v.is_active = 1 AND c.is_active = 1
      ORDER BY p.created_at DESC
    `;

    const searchTerm = `%${searchQuery}%`;
    const rows = db.prepare(query).all(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm) as any[];
    return rows.map(row => this.mapRowToProduct(row));
  }

  // Get trending products
  static getTrendingProducts(): Product[] {
    const query = `
      SELECT 
        p.*,
        c.name as category_name,
        c.icon as category_icon,
        c.color as category_color,
        v.name as vendor_name,
        v.description as vendor_description,
        v.avatar as vendor_avatar,
        v.banner as vendor_banner,
        v.rating as vendor_rating,
        v.total_sales as vendor_total_sales,
        v.followers as vendor_followers,
        v.is_verified as vendor_is_verified
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN vendors v ON p.vendor_id = v.id
      WHERE p.is_trending = 1 AND p.is_active = 1 AND v.is_active = 1 AND c.is_active = 1
      ORDER BY p.created_at DESC
    `;

    const rows = db.prepare(query).all() as any[];
    return rows.map(row => this.mapRowToProduct(row));
  }

  // Get product images
  static getProductImages(productId: string): string[] {
    const query = `
      SELECT image_url 
      FROM product_images 
      WHERE product_id = ? 
      ORDER BY is_primary DESC, sort_order ASC
    `;

    const rows = db.prepare(query).all(productId) as any[];
    return rows.map(row => row.image_url);
  }

  // Get product tags
  static getProductTags(productId: string): string[] {
    const query = `
      SELECT tag 
      FROM product_tags 
      WHERE product_id = ?
    `;

    const rows = db.prepare(query).all(productId) as any[];
    return rows.map(row => row.tag);
  }

  // Helper method to map database row to Product object
  private static mapRowToProduct(row: any): Product {
    const images = this.getProductImages(row.id.toString());
    const tags = this.getProductTags(row.id.toString());

    return {
      id: row.id.toString(),
      title: row.title,
      description: row.description,
      price: row.price,
      originalPrice: row.original_price,
      images: images.length > 0 ? images : ['https://via.placeholder.com/400x400?text=No+Image'],
      category: row.category_name,
      vendorId: row.vendor_id.toString(),
      vendor: {
        id: row.vendor_id.toString(),
        name: row.vendor_name,
        description: row.vendor_description,
        avatar: row.vendor_avatar,
        banner: row.vendor_banner,
        rating: row.vendor_rating,
        totalSales: row.vendor_total_sales,
        followers: row.vendor_followers,
        isFollowed: false, // This would be determined based on current user
        hasActiveStatus: false, // This would be determined by checking active statuses
        createdAt: new Date(row.created_at)
      },
      rating: row.rating,
      reviews: row.reviews_count,
      stock: row.stock,
      tags: tags,
      isTrending: Boolean(row.is_trending),
      createdAt: new Date(row.created_at)
    };
  }
}

export class CategoryService {
  static getAllCategories(): Category[] {
    const query = `
      SELECT * FROM categories 
      WHERE is_active = 1 
      ORDER BY name
    `;

    const rows = db.prepare(query).all() as any[];
    return rows.map(row => ({
      id: row.id.toString(),
      name: row.name,
      icon: row.icon,
      color: row.color
    }));
  }
}

export class VendorService {
  static getAllVendors(): Vendor[] {
    const query = `
      SELECT * FROM vendors 
      WHERE is_active = 1 
      ORDER BY rating DESC, total_sales DESC
    `;

    const rows = db.prepare(query).all() as any[];
    return rows.map(row => ({
      id: row.id.toString(),
      name: row.name,
      description: row.description,
      avatar: row.avatar,
      banner: row.banner,
      rating: row.rating,
      totalSales: row.total_sales,
      followers: row.followers,
      isFollowed: false, // This would be determined based on current user
      hasActiveStatus: false, // This would be determined by checking active statuses
      createdAt: new Date(row.created_at)
    }));
  }

  static getVendorById(id: string): Vendor | null {
    const query = `
      SELECT * FROM vendors 
      WHERE id = ? AND is_active = 1
    `;

    const row = db.prepare(query).get(id) as any;
    if (!row) return null;

    return {
      id: row.id.toString(),
      name: row.name,
      description: row.description,
      avatar: row.avatar,
      banner: row.banner,
      rating: row.rating,
      totalSales: row.total_sales,
      followers: row.followers,
      isFollowed: false, // This would be determined based on current user
      hasActiveStatus: false, // This would be determined by checking active statuses
      createdAt: new Date(row.created_at)
    };
  }
}