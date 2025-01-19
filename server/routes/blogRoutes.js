const express = require('express');
const Blog = require('../models/Blog');
const User = require('../models/User');

const router = express.Router();

router.get('/api/blogs', async (req, res) => {
  // Check if user is authenticated
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Get the user's ID from the authenticated request
    const userId = req.user.id;

    // Find the user and get the list of followed authors
    const user = await User.findById(userId).populate('following'); // Assuming `following` is populated with author IDs
    const followedAuthors = user.following.map(author => author._id);

    // Fetch blogs by followed authors
    const followedBlogs = await Blog.find({ author: { $in: followedAuthors } })
      .sort({ createdAt: -1 }) // Sort followed blogs by latest first
      .limit(50); // Optional limit

    // Fetch other popular blogs not by followed authors
    const otherBlogs = await Blog.find({ author: { $nin: followedAuthors } })
      .sort({ upvotes: -1 }) // Sort by most upvotes
      .limit(50); // Optional limit

    // Combine the blogs: followed first, then others
    const blogs = [...followedBlogs, ...otherBlogs];

    // Send the response
    res.json(blogs);
  } catch (err) {
    console.error('Error fetching blogs:', err);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

router.get('/api/blogs/:id', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
   }
   
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



router.get('/api/tags/:tags', async (req, res) => {

  try {
    const blogs = await Blog.find({ tags: req.params.tags });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blogs by tag' });
  }
}
  
)


module.exports = router;
