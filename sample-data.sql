-- Sample data for Congo Marketplace
-- Run this in Supabase SQL Editor

-- Insert Categories
INSERT INTO categories (name, icon, color) VALUES
('Electronics', 'Smartphone', 'bg-blue-100 text-blue-600'),
('Fashion', 'Shirt', 'bg-pink-100 text-pink-600'),
('Home & Garden', 'Home', 'bg-green-100 text-green-600'),
('Sports', 'Dumbbell', 'bg-orange-100 text-orange-600'),
('Books', 'Book', 'bg-purple-100 text-purple-600'),
('Beauty', 'Sparkles', 'bg-red-100 text-red-600');

-- Insert Sample Users (vendors)
INSERT INTO users (name, email, password_hash, role, verified, avatar_url) VALUES
('TechCorp Electronics', 'vendor1@techcorp.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewIWlB5G6WOB1NFK', 'vendor', true, 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=150'),
('Fashion Forward', 'vendor2@fashion.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewIWlB5G6WOB1NFK', 'vendor', true, 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=150'),
('Green Living', 'vendor3@green.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewIWlB5G6WOB1NFK', 'vendor', true, 'https://images.pexels.com/photos/3184297/pexels-photo-3184297.jpeg?auto=compress&cs=tinysrgb&w=150');

-- Insert Vendors (get the user IDs and create vendor profiles)
WITH vendor_users AS (
  SELECT id, name FROM users WHERE role = 'vendor'
)
INSERT INTO vendors (user_id, name, description, rating, total_sales, followers)
SELECT 
  id,
  name,
  CASE 
    WHEN name = 'TechCorp Electronics' THEN 'Premium electronics and gadgets'
    WHEN name = 'Fashion Forward' THEN 'Trendy clothing and accessories'
    WHEN name = 'Green Living' THEN 'Eco-friendly home and garden products'
  END,
  CASE 
    WHEN name = 'TechCorp Electronics' THEN 4.8
    WHEN name = 'Fashion Forward' THEN 4.6
    WHEN name = 'Green Living' THEN 4.9
  END,
  CASE 
    WHEN name = 'TechCorp Electronics' THEN 15420
    WHEN name = 'Fashion Forward' THEN 8900
    WHEN name = 'Green Living' THEN 12100
  END,
  CASE 
    WHEN name = 'TechCorp Electronics' THEN 2340
    WHEN name = 'Fashion Forward' THEN 1890
    WHEN name = 'Green Living' THEN 3100
  END
FROM vendor_users;

-- Insert Sample Products
WITH electronics_category AS (SELECT id FROM categories WHERE name = 'Electronics' LIMIT 1),
     fashion_category AS (SELECT id FROM categories WHERE name = 'Fashion' LIMIT 1),
     home_category AS (SELECT id FROM categories WHERE name = 'Home & Garden' LIMIT 1),
     techcorp_vendor AS (SELECT id FROM vendors WHERE name = 'TechCorp Electronics' LIMIT 1),
     fashion_vendor AS (SELECT id FROM vendors WHERE name = 'Fashion Forward' LIMIT 1),
     green_vendor AS (SELECT id FROM vendors WHERE name = 'Green Living' LIMIT 1)
INSERT INTO products (title, description, price, original_price, category_id, vendor_id, stock, rating, review_count, is_trending) VALUES
('Wireless Earbuds Pro', 'Premium noise-cancelling wireless earbuds with 24h battery life', 149.99, 199.99, (SELECT id FROM electronics_category), (SELECT id FROM techcorp_vendor), 45, 4.7, 234, true),
('Gaming Mechanical Keyboard', 'RGB backlit mechanical keyboard for gaming enthusiasts', 129.99, 159.99, (SELECT id FROM electronics_category), (SELECT id FROM techcorp_vendor), 67, 4.9, 312, true),
('Wireless Charging Pad', 'Fast wireless charging for all compatible devices', 39.99, 49.99, (SELECT id FROM electronics_category), (SELECT id FROM techcorp_vendor), 156, 4.5, 89, false),
('Vintage Denim Jacket', 'Classic denim jacket with modern fit and premium quality', 89.99, null, (SELECT id FROM fashion_category), (SELECT id FROM fashion_vendor), 12, 4.5, 156, true),
('Silk Scarf Collection', 'Luxury silk scarves with unique patterns and premium quality', 45.99, null, (SELECT id FROM fashion_category), (SELECT id FROM fashion_vendor), 23, 4.6, 78, false),
('Designer Sunglasses', 'UV protection with stylish frame design', 119.99, 149.99, (SELECT id FROM fashion_category), (SELECT id FROM fashion_vendor), 78, 4.6, 134, false),
('Smart Plant Monitor', 'IoT device to monitor your plants health and watering needs', 59.99, null, (SELECT id FROM home_category), (SELECT id FROM green_vendor), 28, 4.8, 89, false),
('Bamboo Cutting Board Set', 'Sustainable bamboo cutting boards in various sizes', 34.99, null, (SELECT id FROM home_category), (SELECT id FROM green_vendor), 89, 4.7, 145, true),
('Organic Herb Garden Kit', 'Complete kit to grow herbs at home', 24.99, null, (SELECT id FROM home_category), (SELECT id FROM green_vendor), 45, 4.9, 67, true);

-- Insert Product Images
WITH products_with_images AS (
  SELECT 
    id, 
    title,
    CASE 
      WHEN title = 'Wireless Earbuds Pro' THEN 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400'
      WHEN title = 'Gaming Mechanical Keyboard' THEN 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=400'
      WHEN title = 'Wireless Charging Pad' THEN 'https://images.pexels.com/photos/4062289/pexels-photo-4062289.jpeg?auto=compress&cs=tinysrgb&w=400'
      WHEN title = 'Vintage Denim Jacket' THEN 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400'
      WHEN title = 'Silk Scarf Collection' THEN 'https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg?auto=compress&cs=tinysrgb&w=400'
      WHEN title = 'Designer Sunglasses' THEN 'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=400'
      WHEN title = 'Smart Plant Monitor' THEN 'https://images.pexels.com/photos/1400375/pexels-photo-1400375.jpeg?auto=compress&cs=tinysrgb&w=400'
      WHEN title = 'Bamboo Cutting Board Set' THEN 'https://images.pexels.com/photos/1346347/pexels-photo-1346347.jpeg?auto=compress&cs=tinysrgb&w=400'
      WHEN title = 'Organic Herb Garden Kit' THEN 'https://images.pexels.com/photos/1415823/pexels-photo-1415823.jpeg?auto=compress&cs=tinysrgb&w=400'
    END as image_url
  FROM products
)
INSERT INTO product_images (product_id, image_url, sort_order)
SELECT id, image_url, 0
FROM products_with_images
WHERE image_url IS NOT NULL;

-- Insert Product Tags
WITH products_with_tags AS (
  SELECT 
    id, 
    title,
    CASE 
      WHEN title = 'Wireless Earbuds Pro' THEN ARRAY['wireless', 'audio', 'premium']
      WHEN title = 'Gaming Mechanical Keyboard' THEN ARRAY['gaming', 'mechanical', 'rgb']
      WHEN title = 'Wireless Charging Pad' THEN ARRAY['wireless', 'charging', 'fast']
      WHEN title = 'Vintage Denim Jacket' THEN ARRAY['denim', 'vintage', 'casual']
      WHEN title = 'Silk Scarf Collection' THEN ARRAY['silk', 'luxury', 'accessories']
      WHEN title = 'Designer Sunglasses' THEN ARRAY['sunglasses', 'designer', 'uv-protection']
      WHEN title = 'Smart Plant Monitor' THEN ARRAY['smart', 'plants', 'iot']
      WHEN title = 'Bamboo Cutting Board Set' THEN ARRAY['bamboo', 'sustainable', 'kitchen']
      WHEN title = 'Organic Herb Garden Kit' THEN ARRAY['organic', 'herbs', 'garden']
    END as tags
  FROM products
)
INSERT INTO product_tags (product_id, tag)
SELECT id, unnest(tags)
FROM products_with_tags
WHERE tags IS NOT NULL;