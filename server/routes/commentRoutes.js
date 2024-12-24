const express = require('express');
const Comment = require('../models/Comment');
const router = express.Router();

router.post('/api/comments/:postId', async (req, res) => {
  try {
    const newComment = new Comment({ ...req.body, postId: req.params.postId });
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

router.get('/api/comments/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

module.exports = router;
