require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('./config/passport'); // Import the passport configuration
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const authRoutes = require('./routes/authRoutes'); // Import the auth routes
const blogRoutes = require('./routes/blogRoutes'); // Import the blog routes
const commentRoutes = require('./routes/commentRoutes'); // Import the comment routes
const userRoutes = require('./routes/userRoutes');
// Import the user routes
const cors = require('cors');
const User = require('./models/User');
require("dotenv").config();
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






// Remove moved routes from here:
// app.post('/save-username', ...)
// app.post('/api/blog-posts', ...)
// app.put('/api/blogs/:id', ...)
// app.post('/api/update_bio', ...)
// app.put('/api/update_username', ...)
// app.get('/api/users/:username', ...)
// app.get('/api/blogs/:id/vote-status', ...)
// app.post('/api/blogs/:id/vote', ...)
// app.get('/api/posts/author/:username', ...)

app.use(cors({
  origin: ['http://localhost:5173'], // You can add more origins in the array
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));








// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
