import express from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../server.js';

const router = express.Router();

// Middleware to authenticate user
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get all vendors
router.get('/', async (req, res) => {
  try {
    const { data: vendors, error } = await supabase
      .from('vendors')
      .select(`
        *,
        users!vendors_user_id_fkey (
          name,
          avatar_url,
          verified
        )
      `)
      .order('rating', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch vendors' });
    }

    const transformedVendors = vendors.map(vendor => ({
      id: vendor.id,
      name: vendor.name,
      description: vendor.description,
      avatar: vendor.users?.avatar_url || null,
      banner: vendor.banner_url,
      rating: parseFloat(vendor.rating),
      totalSales: vendor.total_sales,
      followers: vendor.followers,
      verified: vendor.users?.verified || false,
      createdAt: new Date(vendor.created_at)
    }));

    res.json(transformedVendors);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get followed vendors with stories
router.get('/following', authenticateUser, async (req, res) => {
  try {
    const { data: followedVendors, error } = await supabase
      .from('vendor_followers')
      .select(`
        vendors (
          id,
          name,
          users (avatar_url, verified),
          vendor_stories (
            id,
            content,
            image_url,
            views,
            created_at
          )
        )
      `)
      .eq('user_id', req.userId);

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch followed vendors' });
    }

    const transformedVendors = followedVendors.map(follow => ({
      id: follow.vendors.id,
      name: follow.vendors.name,
      avatar: follow.vendors.users?.avatar_url || null,
      verified: follow.vendors.users?.verified || false,
      hasNewStory: follow.vendors.vendor_stories.length > 0,
      stories: follow.vendors.vendor_stories
        .filter(story => new Date(story.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000))
        .map(story => ({
          id: story.id,
          content: story.content,
          imageUrl: story.image_url,
          timestamp: story.created_at,
          views: story.views
        }))
    }));

    res.json(transformedVendors);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Follow/unfollow vendor
router.post('/:id/follow', authenticateUser, async (req, res) => {
  try {
    const { id: vendorId } = req.params;

    // Check if already following
    const { data: existingFollow } = await supabase
      .from('vendor_followers')
      .select('*')
      .eq('user_id', req.userId)
      .eq('vendor_id', vendorId)
      .single();

    if (existingFollow) {
      // Unfollow
      const { error } = await supabase
        .from('vendor_followers')
        .delete()
        .eq('user_id', req.userId)
        .eq('vendor_id', vendorId);

      if (error) {
        return res.status(500).json({ error: 'Failed to unfollow vendor' });
      }

      // Update vendor followers count
      await supabase.rpc('decrement_vendor_followers', { vendor_id: vendorId });

      return res.json({ message: 'Vendor unfollowed', following: false });
    }

    // Follow
    const { error } = await supabase
      .from('vendor_followers')
      .insert([{
        user_id: req.userId,
        vendor_id: vendorId
      }]);

    if (error) {
      return res.status(500).json({ error: 'Failed to follow vendor' });
    }

    // Update vendor followers count
    await supabase.rpc('increment_vendor_followers', { vendor_id: vendorId });

    res.json({ message: 'Vendor followed', following: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get products from followed vendors (for feed)
router.get('/following/products', authenticateUser, async (req, res) => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id,
        title,
        price,
        original_price,
        rating,
        review_count,
        is_trending,
        product_images (image_url),
        vendors!products_vendor_id_fkey (
          id,
          name,
          users (avatar_url, verified)
        )
      `)
      .eq('is_active', true)
      .in('vendor_id', 
        supabase
          .from('vendor_followers')
          .select('vendor_id')
          .eq('user_id', req.userId)
      )
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch products' });
    }

    const transformedProducts = products.map(product => ({
      id: product.id,
      title: product.title,
      price: parseFloat(product.price),
      originalPrice: product.original_price ? parseFloat(product.original_price) : null,
      rating: parseFloat(product.rating),
      reviews: product.review_count,
      image: product.product_images[0]?.image_url || null,
      vendor: {
        id: product.vendors.id,
        name: product.vendors.name,
        avatar: product.vendors.users?.avatar_url || null,
        verified: product.vendors.users?.verified || false
      },
      badge: product.is_trending ? 'Trending' : null,
      inStock: true
    }));

    // Shuffle for random display
    const shuffled = transformedProducts.sort(() => Math.random() - 0.5);

    res.json(shuffled);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;