const express = require('express');
const Comment = require('../models/Comment');
const router = express.Router();

router.post('/api/comments/:postId', async (req, res) => {
  try {
    // Validate that required fields exist in request body
    if (!req.body.content) {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    const newComment = new Comment({ 
      ...req.body,
      postId: req.params.postId ,
      author: req.user.username,
    });

    console.log('Received comment data:', newComment);

    // Explicitly await the save operation and handle any validation errors
    try {
      const savedComment = await newComment.save();
      console.log('Comment saved successfully:', savedComment);
      res.status(201).json(savedComment);
    } catch (saveErr) {
      console.error('Error saving comment:', saveErr);
      return res.status(400).json({ error: 'Invalid comment data', details: saveErr.message });
    }

  } catch (err) {
    console.error('Server error:', err);
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

router.delete('/api/comments/:commentId', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // Only allow author to delete
    if (comment.author !== req.user?.username) {
      return res.status(403).json({ message: 'You are not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
