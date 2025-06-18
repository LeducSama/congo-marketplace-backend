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

// Create vendor story
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { content, imageUrl } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    // Get user's vendor ID
    const { data: vendor, error: vendorError } = await supabase
      .from('vendors')
      .select('id')
      .eq('user_id', req.userId)
      .single();

    if (vendorError || !vendor) {
      return res.status(403).json({ error: 'Only vendors can create stories' });
    }

    // Create story
    const { data: story, error } = await supabase
      .from('vendor_stories')
      .insert([{
        vendor_id: vendor.id,
        content,
        image_url: imageUrl
      }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to create story' });
    }

    res.status(201).json({ message: 'Story created successfully', story });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get stories feed
router.get('/feed', authenticateUser, async (req, res) => {
  try {
    const { data: stories, error } = await supabase
      .from('vendor_stories')
      .select(`
        *,
        vendors (
          id,
          name,
          users (avatar_url, verified)
        )
      `)
      .eq('is_active', true)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch stories' });
    }

    const transformedStories = stories.map(story => ({
      id: story.id,
      content: story.content,
      imageUrl: story.image_url,
      timestamp: story.created_at,
      views: story.views,
      vendor: {
        id: story.vendors.id,
        name: story.vendors.name,
        avatar: story.vendors.users?.avatar_url || null,
        verified: story.vendors.users?.verified || false
      }
    }));

    res.json(transformedStories);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Increment story views
router.post('/:id/view', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('vendor_stories')
      .update({ views: supabase.raw('views + 1') })
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: 'Failed to update views' });
    }

    res.json({ message: 'View recorded' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;