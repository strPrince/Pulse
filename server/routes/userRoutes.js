const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.get('/users/username/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    user ? res.json(user) : res.status(404).json({ error: 'User not found' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

module.exports = router;
