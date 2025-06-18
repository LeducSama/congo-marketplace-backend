import express from 'express';
import { supabase } from '../server.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, search, trending, limit = 50 } = req.query;
    
    let query = supabase
      .from('products')
      .select(`
        *,
        vendors (
          id,
          name,
          rating
        ),
        categories (
          name
        ),
        product_images (
          image_url,
          sort_order
        ),
        product_tags (
          tag
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(parseInt(limit));

    if (category) {
      query = query.eq('categories.name', category);
    }

    if (trending === 'true') {
      query = query.eq('is_trending', true);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: products, error } = await query;

    if (error) {
      console.error('Products fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }

    // Transform data to match frontend expectations
    const transformedProducts = products.map(product => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: parseFloat(product.price),
      originalPrice: product.original_price ? parseFloat(product.original_price) : null,
      images: product.product_images
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(img => img.image_url),
      category: product.categories?.name || 'Uncategorized',
      vendorId: product.vendor_id,
      vendor: product.vendors ? {
        id: product.vendors.id,
        name: product.vendors.name,
        rating: product.vendors.rating
      } : null,
      rating: parseFloat(product.rating),
      reviews: product.review_count,
      stock: product.stock,
      tags: product.product_tags.map(tag => tag.tag),
      isTrending: product.is_trending,
      createdAt: new Date(product.created_at)
    }));

    res.json(transformedProducts);

  } catch (error) {
    console.error('Products endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        vendors (
          id,
          name,
          description,
          rating,
          total_sales,
          followers
        ),
        categories (
          name
        ),
        product_images (
          image_url,
          sort_order
        ),
        product_tags (
          tag
        )
      `)
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error || !product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Transform data
    const transformedProduct = {
      id: product.id,
      title: product.title,
      description: product.description,
      price: parseFloat(product.price),
      originalPrice: product.original_price ? parseFloat(product.original_price) : null,
      images: product.product_images
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(img => img.image_url),
      category: product.categories?.name || 'Uncategorized',
      vendorId: product.vendor_id,
      vendor: product.vendors ? {
        id: product.vendors.id,
        name: product.vendors.name,
        description: product.vendors.description,
        rating: product.vendors.rating,
        totalSales: product.vendors.total_sales,
        followers: product.vendors.followers
      } : null,
      rating: parseFloat(product.rating),
      reviews: product.review_count,
      stock: product.stock,
      tags: product.product_tags.map(tag => tag.tag),
      isTrending: product.is_trending,
      createdAt: new Date(product.created_at)
    };

    res.json(transformedProduct);

  } catch (error) {
    console.error('Product fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get categories
router.get('/categories/all', async (req, res) => {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch categories' });
    }

    res.json(categories);

  } catch (error) {
    console.error('Categories fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;