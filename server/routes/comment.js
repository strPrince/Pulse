// routes/comments.js
const express = require('express');
const Comment = require('../models/Comment');

const router = express.Router();

// Route to fetch comments for a blog post
router.get('/comments/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments', error });
  }
});

// Route to add a new comment
router.post('/comments', async (req, res) => {
  const { postId, author, content } = req.body;

  try {
    const newComment = new Comment({
      postId,
      author,
      content
    });

    const savedComment = await newComment.save();
    res.json(savedComment);
  } catch (error) {
    res.status(500).json({ message: 'Error saving comment', error });
  }
});

module.exports = router;
