import getDatabase from '../database.js';

const db = getDatabase();

export function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // Start transaction
    const transaction = db.transaction(() => {
      // Clear existing data (in reverse order due to foreign keys)
      db.exec(`
        DELETE FROM status_likes;
        DELETE FROM vendor_followers;
        DELETE FROM product_reviews;
        DELETE FROM vendor_statuses;
        DELETE FROM order_items;
        DELETE FROM orders;
        DELETE FROM wishlist;
        DELETE FROM cart_items;
        DELETE FROM product_tags;
        DELETE FROM product_images;
        DELETE FROM products;
        DELETE FROM vendors;
        DELETE FROM categories;
        DELETE FROM users;
      `);

      // Reset auto-increment counters
      db.exec(`
        DELETE FROM sqlite_sequence WHERE name IN (
          'users', 'vendors', 'categories', 'products', 'product_images', 
          'product_tags', 'cart_items', 'wishlist', 'orders', 'order_items',
          'vendor_statuses', 'status_likes', 'vendor_followers', 'product_reviews'
        );
      `);

      // Seed Users
      const insertUser = db.prepare(`
        INSERT INTO users (name, email, password_hash, phone, address, avatar, role)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      const users = [
        ['John Doe', 'john@example.com', 'hashed_password_1', '+1 (555) 123-4567', '123 Main St, New York, NY 10001', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150', 'buyer'],
        ['TechCorp Owner', 'owner@techcorp.com', 'hashed_password_2', '+1 (555) 234-5678', '456 Tech Ave, San Francisco, CA 94102', 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=150', 'vendor'],
        ['Fashion Forward Owner', 'owner@fashionforward.com', 'hashed_password_3', '+1 (555) 345-6789', '789 Fashion Blvd, Los Angeles, CA 90210', 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=150', 'vendor'],
        ['Green Living Owner', 'owner@greenliving.com', 'hashed_password_4', '+1 (555) 456-7890', '321 Eco St, Portland, OR 97201', 'https://images.pexels.com/photos/3184297/pexels-photo-3184297.jpeg?auto=compress&cs=tinysrgb&w=150', 'vendor'],
        ['Sports Zone Owner', 'owner@sportszone.com', 'hashed_password_5', '+1 (555) 567-8901', '654 Sports Way, Chicago, IL 60601', 'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=150', 'vendor'],
        ['Admin User', 'admin@marketplace.com', 'hashed_password_admin', '+1 (555) 000-0000', '1 Admin Plaza, Admin City, AC 00000', null, 'admin']
      ];

      users.forEach(user => insertUser.run(...user));

      // Seed Categories
      const insertCategory = db.prepare(`
        INSERT INTO categories (name, icon, color, description)
        VALUES (?, ?, ?, ?)
      `);

      const categories = [
        ['Electronics', 'Smartphone', 'bg-blue-100 text-blue-600', 'Latest gadgets and electronics'],
        ['Fashion', 'Shirt', 'bg-pink-100 text-pink-600', 'Trendy clothing and accessories'],
        ['Home & Garden', 'Home', 'bg-green-100 text-green-600', 'Home improvement and garden supplies'],
        ['Sports', 'Dumbbell', 'bg-orange-100 text-orange-600', 'Sports equipment and fitness gear'],
        ['Books', 'Book', 'bg-purple-100 text-purple-600', 'Books and educational materials'],
        ['Beauty', 'Sparkles', 'bg-red-100 text-red-600', 'Beauty and personal care products']
      ];

      categories.forEach(category => insertCategory.run(...category));

      // Seed Vendors
      const insertVendor = db.prepare(`
        INSERT INTO vendors (user_id, name, description, avatar, banner, rating, total_sales, followers, is_verified)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const vendors = [
        [2, 'TechCorp Store', 'Premium electronics and gadgets', 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=150', 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800', 4.8, 15420, 2340, 1],
        [3, 'Fashion Forward', 'Trendy clothing and accessories', 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=150', null, 4.6, 8900, 1890, 1],
        [4, 'Green Living', 'Eco-friendly home and garden products', 'https://images.pexels.com/photos/3184297/pexels-photo-3184297.jpeg?auto=compress&cs=tinysrgb&w=150', null, 4.9, 12100, 3100, 1],
        [5, 'Sports Zone', 'Athletic gear and equipment', 'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=150', null, 4.7, 9800, 1560, 0]
      ];

      vendors.forEach(vendor => insertVendor.run(...vendor));

      // Seed Products
      const insertProduct = db.prepare(`
        INSERT INTO products (vendor_id, category_id, title, description, price, original_price, stock, rating, reviews_count, is_trending)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const products = [
        [1, 1, 'Wireless Earbuds Pro', 'Premium noise-cancelling wireless earbuds with 24h battery life', 149.99, 199.99, 45, 4.7, 234, 1],
        [2, 2, 'Vintage Denim Jacket', 'Classic denim jacket with modern fit and premium quality', 89.99, null, 12, 4.5, 156, 1],
        [3, 3, 'Smart Plant Monitor', 'IoT device to monitor your plants health and watering needs', 59.99, null, 28, 4.8, 89, 0],
        [1, 1, 'Gaming Mechanical Keyboard', 'RGB backlit mechanical keyboard for gaming enthusiasts', 129.99, 159.99, 67, 4.9, 312, 1],
        [2, 2, 'Silk Scarf Collection', 'Luxury silk scarves with unique patterns and premium quality', 45.99, null, 23, 4.6, 78, 0],
        [3, 3, 'Bamboo Cutting Board Set', 'Sustainable bamboo cutting boards in various sizes', 34.99, null, 89, 4.7, 145, 1],
        [4, 4, 'Professional Yoga Mat', 'Non-slip yoga mat perfect for all types of workouts', 79.99, 99.99, 34, 4.8, 201, 1],
        [1, 1, 'Wireless Charging Pad', 'Fast wireless charging for all compatible devices', 39.99, 49.99, 156, 4.5, 89, 0],
        [2, 2, 'Designer Sunglasses', 'UV protection with stylish frame design', 119.99, 149.99, 78, 4.6, 134, 0],
        [3, 3, 'Organic Herb Garden Kit', 'Complete kit to grow herbs at home', 24.99, null, 45, 4.9, 67, 1]
      ];

      products.forEach(product => insertProduct.run(...product));

      // Seed Product Images
      const insertProductImage = db.prepare(`
        INSERT INTO product_images (product_id, image_url, is_primary, sort_order)
        VALUES (?, ?, ?, ?)
      `);

      const productImages = [
        [1, 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400', 1, 0],
        [1, 'https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=400', 0, 1],
        [2, 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400', 1, 0],
        [3, 'https://images.pexels.com/photos/1400375/pexels-photo-1400375.jpeg?auto=compress&cs=tinysrgb&w=400', 1, 0],
        [4, 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=400', 1, 0],
        [5, 'https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg?auto=compress&cs=tinysrgb&w=400', 1, 0],
        [6, 'https://images.pexels.com/photos/1346347/pexels-photo-1346347.jpeg?auto=compress&cs=tinysrgb&w=400', 1, 0],
        [7, 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400', 1, 0],
        [8, 'https://images.pexels.com/photos/4062289/pexels-photo-4062289.jpeg?auto=compress&cs=tinysrgb&w=400', 1, 0],
        [9, 'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=400', 1, 0],
        [10, 'https://images.pexels.com/photos/1415823/pexels-photo-1415823.jpeg?auto=compress&cs=tinysrgb&w=400', 1, 0]
      ];

      productImages.forEach(image => insertProductImage.run(...image));

      // Seed Product Tags
      const insertProductTag = db.prepare(`
        INSERT INTO product_tags (product_id, tag)
        VALUES (?, ?)
      `);

      const productTags = [
        [1, 'wireless'], [1, 'audio'], [1, 'premium'],
        [2, 'denim'], [2, 'vintage'], [2, 'casual'],
        [3, 'smart'], [3, 'plants'], [3, 'iot'],
        [4, 'gaming'], [4, 'mechanical'], [4, 'rgb'],
        [5, 'silk'], [5, 'luxury'], [5, 'accessories'],
        [6, 'bamboo'], [6, 'sustainable'], [6, 'kitchen'],
        [7, 'yoga'], [7, 'fitness'], [7, 'non-slip'],
        [8, 'wireless'], [8, 'charging'], [8, 'fast'],
        [9, 'sunglasses'], [9, 'designer'], [9, 'uv-protection'],
        [10, 'organic'], [10, 'herbs'], [10, 'garden']
      ];

      productTags.forEach(tag => insertProductTag.run(...tag));

      // Seed Vendor Statuses
      const insertVendorStatus = db.prepare(`
        INSERT INTO vendor_statuses (vendor_id, content, image_url, likes_count, expires_at)
        VALUES (?, ?, ?, ?, datetime('now', '+24 hours'))
      `);

      const vendorStatuses = [
        [1, 'Just launched our new wireless earbuds collection! 🎧 Premium sound quality meets sleek design. Limited time offer - 25% off!', 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400', 124],
        [3, 'Sustainability meets style! Check out our latest eco-friendly home collection 🌱 Every purchase plants a tree!', 'https://images.pexels.com/photos/1400375/pexels-photo-1400375.jpeg?auto=compress&cs=tinysrgb&w=400', 89],
        [2, 'Fashion week inspiration! Our vintage collection is now live ✨ Timeless pieces for the modern wardrobe.', null, 156],
        [1, 'Behind the scenes: Testing our new gaming keyboards! 🎮 RGB lighting that adapts to your gameplay.', 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=400', 203]
      ];

      vendorStatuses.forEach(status => insertVendorStatus.run(...status));

      // Seed some sample cart items and wishlist for demo user
      const insertCartItem = db.prepare(`
        INSERT INTO cart_items (user_id, product_id, quantity)
        VALUES (?, ?, ?)
      `);

      const cartItems = [
        [1, 1, 1],
        [1, 4, 2]
      ];

      cartItems.forEach(item => insertCartItem.run(...item));

      const insertWishlistItem = db.prepare(`
        INSERT INTO wishlist (user_id, product_id)
        VALUES (?, ?)
      `);

      const wishlistItems = [
        [1, 2],
        [1, 3],
        [1, 5]
      ];

      wishlistItems.forEach(item => insertWishlistItem.run(...item));

      // Seed some vendor followers
      const insertVendorFollower = db.prepare(`
        INSERT INTO vendor_followers (vendor_id, user_id)
        VALUES (?, ?)
      `);

      const vendorFollowers = [
        [1, 1],
        [3, 1]
      ];

      vendorFollowers.forEach(follower => insertVendorFollower.run(...follower));

      // Seed some product reviews
      const insertProductReview = db.prepare(`
        INSERT INTO product_reviews (product_id, user_id, rating, review_text, is_verified_purchase)
        VALUES (?, ?, ?, ?, ?)
      `);

      const productReviews = [
        [1, 1, 5, 'Amazing sound quality! Best earbuds I\'ve ever owned.', 1],
        [4, 1, 5, 'Perfect for gaming, the RGB lighting is fantastic.', 1]
      ];

      productReviews.forEach(review => insertProductReview.run(...review));
    });

    // Execute transaction
    transaction();

    console.log('✅ Database seeded successfully!');
    console.log('📊 Seeded data:');
    console.log('   - 6 users (including 4 vendors and 1 admin)');
    console.log('   - 6 categories');
    console.log('   - 4 vendors');
    console.log('   - 10 products');
    console.log('   - 11 product images');
    console.log('   - 30 product tags');
    console.log('   - 4 vendor statuses');
    console.log('   - Sample cart and wishlist items');
    console.log('   - Sample vendor followers and reviews');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}