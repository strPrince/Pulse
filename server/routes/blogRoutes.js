const express = require('express');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');
const User = require('../models/User');

const router = express.Router();

// GET all blogs (public, sorted by latest)
router.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// GET single blog by ID (public)
router.get('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    blog ? res.json(blog) : res.status(404).json({ error: 'Blog not found' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
});

// POST create a new blog
router.post('/api/blog-posts', async (req, res) => {
  try {
    const { title, content, author, image, customCategory, tags } = req.body;
    const newBlog = new Blog({ title, content, author, image, customCategory, tags });
    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create blog' });
  }
});

// PUT update a blog by ID
router.put('/api/blogs/:id', async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    updatedBlog ? res.json(updatedBlog) : res.status(404).json({ error: 'Blog not found' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update blog' });
  }
});

// DELETE a blog by ID
router.delete('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    // Only allow author to delete
    if (blog.author !== req.user?.username) {
      return res.status(403).json({ message: 'You are not authorized to delete this blog' });
    }
    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET blogs by tag
router.get('/api/tags/:tag', async (req, res) => {
  try {
    const blogs = await Blog.find({ tags: req.params.tag });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blogs by tag' });
  }
});

// GET all unique tags
router.get('/api/tags', async (req, res) => {
  try {
    const tags = await Blog.distinct('tags');
    res.json(tags);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

// VOTING: upvote/downvote/neutral  [fixed]
router.post('/api/blogs/:id/vote', async (req, res) => {
  try {
    if (!req.user || !req.user._id) return res.status(401).json({ error: 'Unauthorized' });
    const { action } = req.body; // action: 'up', 'down', or 'neutral'
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    // Remove user from both upvotes and downvotes first
    blog.upvotes = blog.upvotes.filter(id => id.toString() !== req.user._id.toString());
    blog.downvotes = blog.downvotes.filter(id => id.toString() !== req.user._id.toString());

    // Apply new vote
    if (action === 'up') {
      blog.upvotes.push(req.user._id);
    } else if (action === 'down') {
      blog.downvotes.push(req.user._id);
    } // else 'neutral' means remove vote

    // Use schema method to recalculate voteScore
    blog.voteScore = blog.calculateVoteScore();
    await blog.save();

    // Determine user's current vote status
    let userVote = null;
    if (blog.upvotes.some(id => id.toString() === req.user._id.toString())) userVote = 'up';
    else if (blog.downvotes.some(id => id.toString() === req.user._id.toString())) userVote = 'down';

    res.json({ voteScore: blog.voteScore, userVote, upvotes: blog.upvotes.length, downvotes: blog.downvotes.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process vote' });
  }
});

// GET vote status for a blog  [fixed]
router.get('/api/blogs/:id/vote-status', async (req, res) => {
  try {
    if (!req.user || !req.user._id) return res.status(401).json({ error: 'Unauthorized' });
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    let voteStatus = null;
    if (blog.upvotes.some(id => id.toString() === req.user._id.toString())) voteStatus = 'up';
    else if (blog.downvotes.some(id => id.toString() === req.user._id.toString())) voteStatus = 'down';
    res.json({ voteStatus, voteScore: blog.voteScore, upvotes: blog.upvotes.length, downvotes: blog.downvotes.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get vote status' });
  }
});

// GET posts by author username
router.get('/api/posts/author/:username', async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.params.username }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts by author' });
  }
});

module.exports = router;
