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

// Get wishlist items
router.get('/', authenticateUser, async (req, res) => {
  try {
    const { data: wishlistItems, error } = await supabase
      .from('wishlist_items')
      .select(`
        *,
        products (
          id,
          title,
          price,
          original_price,
          rating,
          review_count,
          product_images (image_url),
          vendors (name)
        )
      `)
      .eq('user_id', req.userId);

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch wishlist items' });
    }

    const transformedItems = wishlistItems.map(item => ({
      id: item.products.id,
      title: item.products.title,
      price: parseFloat(item.products.price),
      originalPrice: item.products.original_price ? parseFloat(item.products.original_price) : null,
      rating: parseFloat(item.products.rating),
      reviews: item.products.review_count,
      images: item.products.product_images.map(img => img.image_url),
      vendor: { name: item.products.vendors?.name },
      addedAt: item.created_at
    }));

    res.json(transformedItems);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Toggle wishlist item
router.post('/toggle', authenticateUser, async (req, res) => {
  try {
    const { productId } = req.body;

    // Check if item exists in wishlist
    const { data: existingItem } = await supabase
      .from('wishlist_items')
      .select('*')
      .eq('user_id', req.userId)
      .eq('product_id', productId)
      .single();

    if (existingItem) {
      // Remove from wishlist
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', req.userId)
        .eq('product_id', productId);

      if (error) {
        return res.status(500).json({ error: 'Failed to remove from wishlist' });
      }

      return res.json({ message: 'Removed from wishlist', inWishlist: false });
    }

    // Add to wishlist
    const { data, error } = await supabase
      .from('wishlist_items')
      .insert([{
        user_id: req.userId,
        product_id: productId
      }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to add to wishlist' });
    }

    res.status(201).json({ message: 'Added to wishlist', inWishlist: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;