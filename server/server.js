const express = require("express");
const router = express.Router();
const Blog = require("./models/Blog");
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const User = require('./models/User');
const Comment = require('./models/Comment');
// const GoAuth = require('./routes/GoogleAuth');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');
const MongoStore = require('connect-mongo');
const cookieSession = require("cookie-session");
// Connect to Database
mongoose.connect('mongodb+srv://princepbad:rpwYcMJGHZ9osPyL@cluster0.po3ab.mongodb.net/BLOGGER?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,      // Parses MongoDB connection string
  useUnifiedTopology: true,  // Enables new connection management engine
  serverSelectionTimeoutMS: 5000,
  tls:true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

app = express();





// Log data from blog collection
Blog.find().then((data) => {
  console.log("Blog data:", data);
}).catch((error) => {
  console.error("Error fetching blog data:", error);
});

app.use(cors({
  origin: 'https://localhost:5173', // Your frontend URL
  credentials: true, // Important for handling credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// GET /api/blogs - Fetch all blogs
router.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
   
 
  } catch (err) {
    console.error('Error fetching blogs:', err);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

// POST /api/blogs - Create a new blog


// GET /api/blogs/:id - Fetch a single blog
router.get("/api/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      res.status(404).json({ error: "Blog not found" });
      return;
    }
    res.status(200).json(blog);
    console.log(blog);
  } catch (err) {
    console.error('Error fetching blog:', err);
    res.status(500).json({ error: "Failed to fetch blog" });
  }
});

// PUT /api/blogs/:id - Update a blog
router.put("/api/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, {
      ...req.body,
      updatedAt: Date.now()
    }, { new: true });
    if (!blog) {
      res.status(404).json({ error: "Blog not found" });
      return;
    }
    res.status(200).json(blog);
  } catch (err) {
    console.error('Error updating blog:', err);
    res.status(500).json({ error: "Failed to update blog" });
  }
});

// DELETE /api/blogs/:id - Delete a blog
router.delete("/api/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      res.status(404).json({ error: "Blog not found" });
      return;
    }
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error('Error deleting blog:', err);
    res.status(500).json({ error: "Failed to delete blog" });
  }
});



app.use(router);
app.use("/api", router);


console.log("updated.....");

app.use(cors({ 
  origin: 'https://localhost:5173',
  credentials: true 
}));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'my key',
  resave: true,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://princepbad:rpwYcMJGHZ9osPyL@cluster0.po3ab.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    collectionName: 'sessions',
  }),
  cookie: { secure: false , maxAge: 24 * 60 * 60 * 1000}, // Set to true if using https
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
  clientID: '584386715419-4r4vtvd92nmjjnrh9iod7sq54d0rkfj8.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'https://pulsee-y61s.onrender.com/auth/google/callback',

  
},
async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists in the database
    let user = await User.findOne({ googleId: profile.id });

    // If user doesn't exist, create a new one
    if (!user) {
      user = new User({
        googleId: profile.id,
        name: profile.displayName, // Save the displayName
        email: profile.emails[0].value,
        picture: profile.photos ? profile.photos[0].value : '',
      });

      // Save the new user in the database
      await user.save();
    }

    // Return the user info
    return done(null, user);
    console.log(profile); // This will show the profile object with all its properties

  } catch (err) {
    return done(err);
  }
}));


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});






app.use(passport.initialize());
app.use(passport.session());





store: MongoStore.create({
   mongoUrl : 'mongodb+srv://princepbad:rpwYcMJGHZ9osPyL@cluster0.po3ab.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', // MongoDB URL
  collectionName: 'sessions', // Store sessions in this collection
}),

// Test route to check session
app.get('/test-session', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Hello, ${req.user.name}`);
  } else {
    res.send('Session is not set or user is not authenticated');
  }
});


app.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'], // Request user profile and email
  })
);


app.use(express.json());

// Callback route for Google OAuth
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/', failureMessage: true }),
  (req, res) => {
    // Save user and authentication state in the session
    req.session.user = req.user;
    req.session.isAuthenticated = true;

    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.redirect('/error');
      }
      // Redirect to the frontend profile page
      res.redirect('https://localhost:5173/profile');
    });
  }
);



// Error handler
app.use((err, req, res, next) => {
  console.error('Authentication error:', err);
  res.redirect('/');
});



app.get('/api/current_user', (req, res) => {
  if (req.isAuthenticated() && req.user) {
    res.json(req.user); 
   // Return user details if authenticated
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

 
app.get('/logout', (req, res) => {
 
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out' });
    }
    
    // Clear the session cookie
    res.clearCookie('connect.sid'); // Default session cookie name
    res.json({ message: 'Logged out successfully' });
  });
});
const authenticate = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Handle preflight OPTIONS requests
// app.options('*', (req, res) => {
//   res.header('Access-Control-Allow-Origin', 'https://localhost:5173');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   res.sendStatus(200);
// });
app.use(cors({
  origin: 'https://localhost:5173', // Your frontend URL
  credentials: true, // Important for handling credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// app.use((req, res, next) => {
//   console.log('CORS Headers being set:');
//   console.log({
//     'Access-Control-Allow-Origin': 'https://localhost:5173',
//     'Access-Control-Allow-Credentials': 'true',
//   });
//   next();
// });

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

// Route to update social media links
app.post('/api/update_social_links', async (req, res) => {
  const { userId, platform, link } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Dynamically update the link
    user[platform] = link;
    await user.save();

    res.status(200).json({ message: 'Social link updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Error updating social link', error: err.message });
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


app.get('/api/users/username/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    const user = await User.findOne({ username: username });
     
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user data without sensitive information
    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      picture: user.picture,
     
      // Add any other fields you want to include
    };

    res.json(userData);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});




// GET: Get all comments for a post
// GET: Get all comments for a post
app.post('/api/comments/:postId', async (req, res) => {
  console.log('Session Data:', req.session); // Debugging session data

  if (!req.session.user) {
    return res.status(401).json({ message: 'You must be logged in to comment' });
  }

  const { content } = req.body;
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: 'Invalid post ID' });
  }

  try {
    const newComment = new Comment({
      postId,
      content,
      author: req.session.user.username,
    });

    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ message: 'Error adding comment', error: err });
  }
});

// GET: Get all comments for a post
app.get('/api/comments/:postId', async (req, res) => {
  console.log('Fetching comments for postId:', req.params.postId);  // Add this log for debugging

  const { postId } = req.params;

  // Validate if postId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: 'Invalid post ID' });
  }

  try {
    const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ message: 'Error fetching comments', error: err });
  }
});

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
    // Find all posts where the `author` matches the provided username
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



const port = 3000;
app.listen(port, function (err) {
  if (err) console.log(err);
  console.log("Server listening on PORT", port);
});
