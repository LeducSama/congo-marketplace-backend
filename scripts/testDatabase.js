import Database from 'better-sqlite3';

// Test the database connection and queries
const dbPath = 'marketplace.db';
const db = new Database(dbPath);

console.log('🔍 Testing database connection and queries...\n');

try {
  // Test 1: Check if tables exist
  console.log('📋 Checking database tables:');
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  tables.forEach(table => console.log(`   ✓ ${table.name}`));
  console.log();

  // Test 2: Count records in each main table
  console.log('📊 Record counts:');
  const counts = {
    users: db.prepare("SELECT COUNT(*) as count FROM users").get().count,
    vendors: db.prepare("SELECT COUNT(*) as count FROM vendors").get().count,
    categories: db.prepare("SELECT COUNT(*) as count FROM categories").get().count,
    products: db.prepare("SELECT COUNT(*) as count FROM products").get().count,
    product_images: db.prepare("SELECT COUNT(*) as count FROM product_images").get().count,
    product_tags: db.prepare("SELECT COUNT(*) as count FROM product_tags").get().count,
    cart_items: db.prepare("SELECT COUNT(*) as count FROM cart_items").get().count,
    wishlist: db.prepare("SELECT COUNT(*) as count FROM wishlist").get().count,
    vendor_statuses: db.prepare("SELECT COUNT(*) as count FROM vendor_statuses").get().count
  };

  Object.entries(counts).forEach(([table, count]) => {
    console.log(`   ${table}: ${count} records`);
  });
  console.log();

  // Test 3: Sample product query with joins
  console.log('🛍️  Sample products (with vendor info):');
  const products = db.prepare(`
    SELECT 
      p.id, p.title, p.price, 
      v.name as vendor_name, 
      c.name as category_name
    FROM products p
    JOIN vendors v ON p.vendor_id = v.id
    JOIN categories c ON p.category_id = c.id
    LIMIT 5
  `).all();

  products.forEach(product => {
    console.log(`   📦 ${product.title} - $${product.price} (${product.vendor_name} / ${product.category_name})`);
  });
  console.log();

  // Test 4: Cart items for demo user
  console.log('🛒 Cart items for user ID 1:');
  const cartItems = db.prepare(`
    SELECT 
      ci.quantity,
      p.title,
      p.price,
      (ci.quantity * p.price) as total
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = 1
  `).all();

  if (cartItems.length > 0) {
    cartItems.forEach(item => {
      console.log(`   🛍️  ${item.quantity}x ${item.title} - $${item.total.toFixed(2)}`);
    });
    const cartTotal = cartItems.reduce((sum, item) => sum + item.total, 0);
    console.log(`   💰 Total: $${cartTotal.toFixed(2)}`);
  } else {
    console.log('   (No items in cart)');
  }
  console.log();

  // Test 5: Wishlist for demo user
  console.log('❤️  Wishlist for user ID 1:');
  const wishlistItems = db.prepare(`
    SELECT p.title, p.price
    FROM wishlist w
    JOIN products p ON w.product_id = p.id
    WHERE w.user_id = 1
  `).all();

  if (wishlistItems.length > 0) {
    wishlistItems.forEach(item => {
      console.log(`   💝 ${item.title} - $${item.price}`);
    });
  } else {
    console.log('   (No items in wishlist)');
  }
  console.log();

  // Test 6: Vendor statuses
  console.log('📱 Active vendor statuses:');
  const statuses = db.prepare(`
    SELECT 
      v.name as vendor_name,
      vs.content,
      vs.likes_count,
      vs.created_at
    FROM vendor_statuses vs
    JOIN vendors v ON vs.vendor_id = v.id
    WHERE vs.is_active = 1
    ORDER BY vs.created_at DESC
    LIMIT 3
  `).all();

  statuses.forEach(status => {
    console.log(`   📢 ${status.vendor_name}: ${status.content.substring(0, 50)}... (${status.likes_count} likes)`);
  });

  console.log('\n✅ Database test completed successfully!');
  console.log('💾 Database file: marketplace.db');
  console.log('🔌 Ready for frontend integration');

} catch (error) {
  console.error('❌ Database test failed:', error);
} finally {
  db.close();
}