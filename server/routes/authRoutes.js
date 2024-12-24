const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    req.session.user = req.user;
    req.session.isAuthenticated = true;
    res.redirect('http://localhost:5173/profile');
  }
);

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Could not log out' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

router.get('/api/current_user', (req, res) => {
    if (req.isAuthenticated()) {
      return res.json({
        id: req.user.id,
        name: req.user.name,
        username: req.user.username, // Ensure this is included
        bio: req.user.bio,           // Ensure this is included
        picture: req.user.picture,
      });
    } else {
      return res.status(401).json({ error: 'User not authenticated' });
    }
  });
  

module.exports = router;