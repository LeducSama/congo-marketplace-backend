-- Row Level Security Policies for Congo Marketplace
-- Run this after the main schema

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Users can read all user profiles (for vendor info)
CREATE POLICY "Users can view all profiles" ON users
    FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Vendors can be viewed by everyone
CREATE POLICY "Vendors are publicly readable" ON vendors
    FOR SELECT USING (true);

-- Only vendor owners can update their vendor info
CREATE POLICY "Vendors can update own info" ON vendors
    FOR UPDATE USING (auth.uid() = user_id);

-- Products are publicly readable
CREATE POLICY "Products are publicly readable" ON products
    FOR SELECT USING (true);

-- Only vendor owners can manage their products
CREATE POLICY "Vendors can manage own products" ON products
    FOR ALL USING (auth.uid() IN (
        SELECT user_id FROM vendors WHERE id = products.vendor_id
    ));

-- Cart items - users can only see/manage their own
CREATE POLICY "Users can manage own cart" ON cart_items
    FOR ALL USING (auth.uid() = user_id);

-- Wishlist items - users can only see/manage their own
CREATE POLICY "Users can manage own wishlist" ON wishlist_items
    FOR ALL USING (auth.uid() = user_id);

-- Vendor followers - users can manage their own follows
CREATE POLICY "Users can manage own follows" ON vendor_followers
    FOR ALL USING (auth.uid() = user_id);

-- Vendor stories - readable by all, manageable by vendor owner
CREATE POLICY "Stories are publicly readable" ON vendor_stories
    FOR SELECT USING (true);

CREATE POLICY "Vendors can manage own stories" ON vendor_stories
    FOR ALL USING (auth.uid() IN (
        SELECT user_id FROM vendors WHERE id = vendor_stories.vendor_id
    ));

-- Orders - users can see their own orders, vendors can see orders for their products
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Vendors can view orders for their products" ON orders
    FOR SELECT USING (auth.uid() IN (
        SELECT user_id FROM vendors WHERE id = orders.vendor_id
    ));

-- Categories and other reference tables are public
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are publicly readable" ON categories
    FOR SELECT USING (true);

ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Product images are publicly readable" ON product_images
    FOR SELECT USING (true);

ALTER TABLE product_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Product tags are publicly readable" ON product_tags
    FOR SELECT USING (true);