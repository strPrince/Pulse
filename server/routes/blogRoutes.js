const express = require('express');
const Blog = require('../models/Blog');
const User = require('../models/User');
const router = express.Router();

router.get('/api/blogs', async (req, res) => {
    try {
      const blogs = await Blog.find();
      res.json(blogs);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch blogs' });
    }
  });

router.get('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    blog ? res.json(blog) : res.status(404).json({ error: 'Blog not found' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
});


router.post('api/blogs', async (req, res) => {
  try {
    const newBlog = new Blog(req.body);
    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create blog' });
  }
});

module.exports = router;
