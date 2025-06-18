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

// Get cart items
router.get('/', authenticateUser, async (req, res) => {
  try {
    const { data: cartItems, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        products (
          id,
          title,
          price,
          stock,
          product_images (image_url)
        )
      `)
      .eq('user_id', req.userId);

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch cart items' });
    }

    const transformedItems = cartItems.map(item => ({
      id: item.id,
      quantity: item.quantity,
      product: {
        id: item.products.id,
        title: item.products.title,
        price: parseFloat(item.products.price),
        stock: item.products.stock,
        images: item.products.product_images.map(img => img.image_url)
      }
    }));

    res.json(transformedItems);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add item to cart
router.post('/add', authenticateUser, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Check if item already exists in cart
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', req.userId)
      .eq('product_id', productId)
      .single();

    if (existingItem) {
      // Update quantity
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id)
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: 'Failed to update cart item' });
      }

      return res.json({ message: 'Cart updated', item: data });
    }

    // Add new item
    const { data, error } = await supabase
      .from('cart_items')
      .insert([{
        user_id: req.userId,
        product_id: productId,
        quantity
      }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to add item to cart' });
    }

    res.status(201).json({ message: 'Item added to cart', item: data });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update cart item quantity
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', id)
        .eq('user_id', req.userId);

      if (error) {
        return res.status(500).json({ error: 'Failed to remove item' });
      }

      return res.json({ message: 'Item removed from cart' });
    }

    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', id)
      .eq('user_id', req.userId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to update cart item' });
    }

    res.json({ message: 'Cart item updated', item: data });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove item from cart
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', id)
      .eq('user_id', req.userId);

    if (error) {
      return res.status(500).json({ error: 'Failed to remove item' });
    }

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;