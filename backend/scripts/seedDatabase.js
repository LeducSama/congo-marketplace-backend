import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // 1. Insert Categories
    console.log('📂 Adding categories...');
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .insert([
        { name: 'Electronics', icon: 'Smartphone', color: 'bg-blue-100 text-blue-600' },
        { name: 'Fashion', icon: 'Shirt', color: 'bg-pink-100 text-pink-600' },
        { name: 'Home & Garden', icon: 'Home', color: 'bg-green-100 text-green-600' },
        { name: 'Sports', icon: 'Dumbbell', color: 'bg-orange-100 text-orange-600' },
        { name: 'Books', icon: 'Book', color: 'bg-purple-100 text-purple-600' },
        { name: 'Beauty', icon: 'Sparkles', color: 'bg-red-100 text-red-600' }
      ])
      .select();

    if (catError) {
      console.error('❌ Category error:', catError);
      return;
    }
    console.log('✅ Categories added:', categories.length);

    // 2. Insert Users (vendors)
    console.log('👥 Adding vendor users...');
    const { data: users, error: userError } = await supabase
      .from('users')
      .insert([
        {
          name: 'TechCorp Electronics',
          email: 'vendor1@techcorp.com',
          password_hash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewIWlB5G6WOB1NFK',
          role: 'vendor',
          verified: true,
          avatar_url: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=150'
        },
        {
          name: 'Fashion Forward',
          email: 'vendor2@fashion.com',
          password_hash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewIWlB5G6WOB1NFK',
          role: 'vendor',
          verified: true,
          avatar_url: 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=150'
        },
        {
          name: 'Green Living',
          email: 'vendor3@green.com',
          password_hash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewIWlB5G6WOB1NFK',
          role: 'vendor',
          verified: true,
          avatar_url: 'https://images.pexels.com/photos/3184297/pexels-photo-3184297.jpeg?auto=compress&cs=tinysrgb&w=150'
        }
      ])
      .select();

    if (userError) {
      console.error('❌ User error:', userError);
      return;
    }
    console.log('✅ Users added:', users.length);

    // 3. Insert Vendors
    console.log('🏪 Adding vendor profiles...');
    const vendorData = [
      {
        user_id: users[0].id,
        name: 'TechCorp Electronics',
        description: 'Premium electronics and gadgets',
        rating: 4.8,
        total_sales: 15420,
        followers: 2340
      },
      {
        user_id: users[1].id,
        name: 'Fashion Forward',
        description: 'Trendy clothing and accessories',
        rating: 4.6,
        total_sales: 8900,
        followers: 1890
      },
      {
        user_id: users[2].id,
        name: 'Green Living',
        description: 'Eco-friendly home and garden products',
        rating: 4.9,
        total_sales: 12100,
        followers: 3100
      }
    ];

    const { data: vendors, error: vendorError } = await supabase
      .from('vendors')
      .insert(vendorData)
      .select();

    if (vendorError) {
      console.error('❌ Vendor error:', vendorError);
      return;
    }
    console.log('✅ Vendors added:', vendors.length);

    // 4. Insert Products
    console.log('📦 Adding products...');
    const electronicsCategory = categories.find(c => c.name === 'Electronics');
    const fashionCategory = categories.find(c => c.name === 'Fashion');
    const homeCategory = categories.find(c => c.name === 'Home & Garden');

    const techVendor = vendors.find(v => v.name === 'TechCorp Electronics');
    const fashionVendor = vendors.find(v => v.name === 'Fashion Forward');
    const greenVendor = vendors.find(v => v.name === 'Green Living');

    const productsData = [
      {
        title: 'Wireless Earbuds Pro',
        description: 'Premium noise-cancelling wireless earbuds with 24h battery life',
        price: 149.99,
        original_price: 199.99,
        category_id: electronicsCategory.id,
        vendor_id: techVendor.id,
        stock: 45,
        rating: 4.7,
        review_count: 234,
        is_trending: true
      },
      {
        title: 'Gaming Mechanical Keyboard',
        description: 'RGB backlit mechanical keyboard for gaming enthusiasts',
        price: 129.99,
        original_price: 159.99,
        category_id: electronicsCategory.id,
        vendor_id: techVendor.id,
        stock: 67,
        rating: 4.9,
        review_count: 312,
        is_trending: true
      },
      {
        title: 'Wireless Charging Pad',
        description: 'Fast wireless charging for all compatible devices',
        price: 39.99,
        original_price: 49.99,
        category_id: electronicsCategory.id,
        vendor_id: techVendor.id,
        stock: 156,
        rating: 4.5,
        review_count: 89,
        is_trending: false
      },
      {
        title: 'Vintage Denim Jacket',
        description: 'Classic denim jacket with modern fit and premium quality',
        price: 89.99,
        category_id: fashionCategory.id,
        vendor_id: fashionVendor.id,
        stock: 12,
        rating: 4.5,
        review_count: 156,
        is_trending: true
      },
      {
        title: 'Silk Scarf Collection',
        description: 'Luxury silk scarves with unique patterns and premium quality',
        price: 45.99,
        category_id: fashionCategory.id,
        vendor_id: fashionVendor.id,
        stock: 23,
        rating: 4.6,
        review_count: 78,
        is_trending: false
      },
      {
        title: 'Designer Sunglasses',
        description: 'UV protection with stylish frame design',
        price: 119.99,
        original_price: 149.99,
        category_id: fashionCategory.id,
        vendor_id: fashionVendor.id,
        stock: 78,
        rating: 4.6,
        review_count: 134,
        is_trending: false
      },
      {
        title: 'Smart Plant Monitor',
        description: 'IoT device to monitor your plants health and watering needs',
        price: 59.99,
        category_id: homeCategory.id,
        vendor_id: greenVendor.id,
        stock: 28,
        rating: 4.8,
        review_count: 89,
        is_trending: false
      },
      {
        title: 'Bamboo Cutting Board Set',
        description: 'Sustainable bamboo cutting boards in various sizes',
        price: 34.99,
        category_id: homeCategory.id,
        vendor_id: greenVendor.id,
        stock: 89,
        rating: 4.7,
        review_count: 145,
        is_trending: true
      },
      {
        title: 'Organic Herb Garden Kit',
        description: 'Complete kit to grow herbs at home',
        price: 24.99,
        category_id: homeCategory.id,
        vendor_id: greenVendor.id,
        stock: 45,
        rating: 4.9,
        review_count: 67,
        is_trending: true
      }
    ];

    const { data: products, error: productError } = await supabase
      .from('products')
      .insert(productsData)
      .select();

    if (productError) {
      console.error('❌ Product error:', productError);
      return;
    }
    console.log('✅ Products added:', products.length);

    // 5. Insert Product Images
    console.log('🖼️ Adding product images...');
    const imageMap = {
      'Wireless Earbuds Pro': 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Gaming Mechanical Keyboard': 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Wireless Charging Pad': 'https://images.pexels.com/photos/4062289/pexels-photo-4062289.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Vintage Denim Jacket': 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Silk Scarf Collection': 'https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Designer Sunglasses': 'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Smart Plant Monitor': 'https://images.pexels.com/photos/1400375/pexels-photo-1400375.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Bamboo Cutting Board Set': 'https://images.pexels.com/photos/1346347/pexels-photo-1346347.jpeg?auto=compress&cs=tinysrgb&w=400',
      'Organic Herb Garden Kit': 'https://images.pexels.com/photos/1415823/pexels-photo-1415823.jpeg?auto=compress&cs=tinysrgb&w=400'
    };

    const productImages = products.map(product => ({
      product_id: product.id,
      image_url: imageMap[product.title],
      sort_order: 0
    })).filter(img => img.image_url);

    const { error: imageError } = await supabase
      .from('product_images')
      .insert(productImages);

    if (imageError) {
      console.error('❌ Image error:', imageError);
      return;
    }
    console.log('✅ Product images added:', productImages.length);

    // 6. Insert Product Tags
    console.log('🏷️ Adding product tags...');
    const tagMap = {
      'Wireless Earbuds Pro': ['wireless', 'audio', 'premium'],
      'Gaming Mechanical Keyboard': ['gaming', 'mechanical', 'rgb'],
      'Wireless Charging Pad': ['wireless', 'charging', 'fast'],
      'Vintage Denim Jacket': ['denim', 'vintage', 'casual'],
      'Silk Scarf Collection': ['silk', 'luxury', 'accessories'],
      'Designer Sunglasses': ['sunglasses', 'designer', 'uv-protection'],
      'Smart Plant Monitor': ['smart', 'plants', 'iot'],
      'Bamboo Cutting Board Set': ['bamboo', 'sustainable', 'kitchen'],
      'Organic Herb Garden Kit': ['organic', 'herbs', 'garden']
    };

    const productTags = [];
    products.forEach(product => {
      const tags = tagMap[product.title] || [];
      tags.forEach(tag => {
        productTags.push({
          product_id: product.id,
          tag: tag
        });
      });
    });

    const { error: tagError } = await supabase
      .from('product_tags')
      .insert(productTags);

    if (tagError) {
      console.error('❌ Tag error:', tagError);
      return;
    }
    console.log('✅ Product tags added:', productTags.length);

    console.log('🎉 Database seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Vendors: ${vendors.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Images: ${productImages.length}`);
    console.log(`   - Tags: ${productTags.length}`);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

// Run the seeding
seedDatabase();