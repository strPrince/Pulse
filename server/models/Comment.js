const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog', // This will reference the Blog model
      required: true, // The comment must be associated with a blog post
    },
    author: {
      type: String,
      required: true, // The username of the comment author
    },
    content: {
      type: String,
      required: true, // The content of the comment
    },
    createdAt: {
      type: Date,
      default: Date.now, // Timestamp for when the comment was created
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
