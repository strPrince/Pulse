require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('./config/passport'); // Import the passport configuration
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const authRoutes = require('./routes/authRoutes'); // Import the auth routes
const blogRoutes = require('./routes/blogRoutes'); // Import the blog routes
const commentRoutes = require('./routes/commentRoutes'); // Import the comment routes
const userRoutes = require('./routes/userRoutes'); // Import the user routes
const cors = require('cors');
const User = require('./models/User');
const Blog = require('./models/Blog');
const app = express();

// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
const corsOptions = {
  origin: 'http://localhost:5173', // Your frontend's origin
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};
app.use(cors(corsOptions));
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret',
  resave: false, // Avoid unnecessary session rewrites
  saveUninitialized: false, // Don't create a session until something is stored
  store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/BLOGGER',
      collectionName: 'sessions',
      ttl: 24 * 60 * 60, // 1 day
  }),
  cookie: {
      secure: false, // Use true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
      sameSite: 'lax', // Protect against CSRF
  },
}));
// Initialize passport after session middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use( blogRoutes);
app.use( commentRoutes);
app.use( userRoutes);
app.use( authRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/BLOGGER', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));


const authenticate = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};






app.post('/save-username', authenticate, async (req, res) => {
  try {
    console.log('Session user:', req.session.user);
    
    // Input validation
    const { username } = req.body;
    if (!username || !/^[a-zA-Z0-9._@]+$/.test(username)) {
      return res.status(400).json({ 
        message: 'Valid username is required' 
      });
    }

    // Validate user ID
    if (!req.user?._id) {
      return res.status(401).json({ 
        message: 'User not authenticated' 
      });
    }

    try {
      // Find the user
      const existingUser = await User.findOne({ _id: req.user._id });

      if (!existingUser) {
        // Create new user
        const newUser = new User({
          _id: req.user._id,
          username,
        
        });
 window.location.reload()

        await newUser.save();
        
        return res.status(201).json({
          success: true,
          message: 'User saved successfully',
          user: {
            username: newUser.username,
            id: newUser._id
          }
        });
      }

      // Update existing user
      const result = await User.updateOne(
        { _id: req.user._id },
        { 
          $set: { 
            username,
            
          } 
        }
      );


   

      return res.json({
        success: true,
        message: 'User updated successfully',
        user: {
          username,
          id: req.user._id
        }
      });

    } catch (dbError) {
      console.error('Database operation failed:', dbError);
      return res.status(500).json({
        message: 'Database operation failed',
        error: dbError.message
      });
    }

  } catch (error) {
    console.error('Request processing error:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
});


app.post('/api/blog-posts', async (req, res) => {
  try {
    const { title, content, tags, author } = req.body;

    if (!title || !content || !author) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newBlog = new Blog({
      title,
      content,
      author,
      tags: tags?.split(',').map((tag) => tag.trim()) || [],
    });

    const savedBlog = await newBlog.save();
    console.log('Saved blog:', savedBlog);
    res.status(201).json({ message: 'Blog post created successfully' });
  } catch (error) {
    console.error('Error saving blog post:', error);
    res.status(500).json({ message: 'Error creating blog post' });
  }
});




app.post('/api/update_bio', async (req, res) => {
  const { bio } = req.body; 

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Dynamically update the link
    user.bio = bio;
    await user.save();

    res.status(200).json({ message: 'Bio updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Error updating bio', error: err.message });
  }
});


// app.get('/api/users/username/:username', async (req, res) => {
//   try {
//     const { username } = req.params;
    
//     const user = await User.findOne({ username: username });
     
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Return user data without sensitive information
//     const userData = {
//       id: user._id,
//       username: user.username,
//       email: user.email,
//       bio: user.bio,
//       picture: user.picture,
     
//       // Add any other fields you want to include
//     };

//     res.json(userData);
//   } catch (error) {
//     console.error('Error fetching user:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });




// GET: Get all comments for a post
// GET: Get all comments for a post
// app.post('/api/comments/:postId', async (req, res) => {
//   console.log('Session Data:', req.session); // Debugging session data

//   if (!req.session.user) {
//     return res.status(401).json({ message: 'You must be logged in to comment' });
//   }

//   const { content } = req.body;
//   const { postId } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(postId)) {
//     return res.status(400).json({ message: 'Invalid post ID' });
//   }

//   try {
//     const newComment = new Comment({
//       postId,
//       content,
//       author: req.session.user.username,
//     });

//     const savedComment = await newComment.save();
//     res.status(201).json(savedComment);
//   } catch (err) {
//     console.error('Error adding comment:', err);
//     res.status(500).json({ message: 'Error adding comment', error: err });
//   }
// });

// GET: Get all comments for a post
// app.get('/api/comments/:postId', async (req, res) => {
//   console.log('Fetching comments for postId:', req.params.postId);  // Add this log for debugging

//   const { postId } = req.params;

//   // Validate if postId is a valid ObjectId
//   if (!mongoose.Types.ObjectId.isValid(postId)) {
//     return res.status(400).json({ message: 'Invalid post ID' });
//   }

//   try {
//     const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
//     res.status(200).json(comments);
//   } catch (err) {
//     console.error('Error fetching comments:', err);
//     res.status(500).json({ message: 'Error fetching comments', error: err });
//   }
// });

app.post('/api/update_username', async (req, res) => {
  try {
    const { username: newUsername } = req.body;
    
    // Input validation
    if (!newUsername || !/^[a-zA-Z0-9._@]+$/.test(newUsername)) {
      return res.status(400).json({ 
        message: 'Valid username is required'
      });
    }

    // Find and update user
    const result = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { username: newUsername } },
      { new: true } // Return updated document
    );

    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update session
    req.session.user.username = newUsername;
    await req.session.save();

    res.status(200).json({ 
      message: 'Username updated successfully',
      user: {
        username: result.username,
        id: result._id
      }
    });

  } catch (err) {
    console.error('Error updating username:', err);
    res.status(500).json({ message: 'Error updating username', error: err.message });
  }
});
  



app.get('/api/users/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('name username bio picture');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user details:', err);
    res.status(500).json({ message: 'Server error', error: err });
  }
});




app.get('/api/blogs/:id/vote-status', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    let voteStatus = null;
    
    if (blog.upvotes.includes(req.user._id)) {
      voteStatus = 'up';
    } else if (blog.downvotes.includes(req.user._id)) {
      voteStatus = 'down';
    }
    
    res.json({ voteStatus });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Handle voting
app.post('/api/blogs/:id/vote', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    const { action } = req.body; // 'up', 'down', or 'remove'
    const userId = req.user._id;

    // Remove existing votes first
    blog.upvotes = blog.upvotes.filter(id => !id.equals(userId));
    blog.downvotes = blog.downvotes.filter(id => !id.equals(userId));

    // Add new vote if not removing
    if (action !== 'remove') {
      if (action === 'up') {
        blog.upvotes.push(userId);
      } else if (action === 'down') {
        blog.downvotes.push(userId);
      }
    }

    // Calculate new vote score
    blog.voteScore = blog.calculateVoteScore();
    await blog.save();

    // Determine user's current vote status
    let userVote = null;
    if (blog.upvotes.includes(userId)) {
      userVote = 'up';
    } else if (blog.downvotes.includes(userId)) {
      userVote = 'down';
    }

    res.json({
      voteScore: blog.voteScore,
      userVote
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/posts/author/:username', async (req, res) => {
  const { username } = req.params;

  try {
    // Find all posts where the author matches the provided username
    const posts = await Blog.find({ author: username }).sort({ createdAt: -1 });

    if (posts.length === 0) {
      return res.status(404).json({ message: 'No posts found for this author.' });
    }

    res.status(200).json(posts);
  } catch (err) {
    console.error('Error fetching posts by author:', err);
    res.status(500).json({ message: 'Failed to fetch posts.' });
  }
});








// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});