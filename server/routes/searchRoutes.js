const express = require('express');
const Blog = require('../models/Blog');
const router = express.Router();

// Search blogs by title, content, or tags
router.get('/api/search', async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim() === '') {
    return res.status(400).json({ error: 'Query parameter q is required' });
  }
  try {
    const regex = new RegExp(q, 'i'); // case-insensitive
    const blogs = await Blog.find({
      $or: [
        { title: regex },
        { content: regex },
        { tags: regex }
      ]
    }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to search blogs' });
  }
});

module.exports = router;
