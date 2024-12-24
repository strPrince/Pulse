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



// router.get('/api/user/profile/:username', (req, res) => {
//   const { username } = req.params;

//   // Find user by username
//   const user = User.find(user => user.username === username);

//   if (!user) {
//     return res.status(404).json({ message: 'User not found' });
//   }

//   res.json(user);
// });

router.get('/api/user/profile/:username', async (req, res) => {
  const { username } = req.params;
console.log(username);
  try {
    const user = await User.findOne({ username });
     console.log("got user ",user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving user', error: err.message });
  }
});


module.exports = router;
