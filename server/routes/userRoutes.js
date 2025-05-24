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
const authenticate = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};





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

// Follow/unfollow user routes
router.post("/api/users/follow/:id", async (req, res) => {
  const { id } = req.params; // ID of the user to follow
  const currentUser = req.user.id; // ID of the logged-in user

  if (currentUser === id) return res.status(400).json({ message: "You cannot follow yourself." });

  try {
    const userToFollow = await User.findById(id);
    const currentUserData = await User.findById(currentUser);

    if (!userToFollow) return res.status(404).json({ message: "User not found." });

    // Prevent duplicate follow
    if (userToFollow.followers.includes(currentUser)) {
      return res.status(400).json({ message: "You are already following this user." });
    }

    userToFollow.followers.push(currentUser); // Add current user to the followers list of the user to follow
    currentUserData.following.push(id); // Add the user to the following list of the current user

    await userToFollow.save();
    await currentUserData.save();

    res.status(200).json({ message: "Followed successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error following user." });
  }
});

router.post("/api/users/unfollow/:id", async (req, res) => {
  const { id } = req.params; // ID of the user to unfollow
  const currentUser = req.user.id; // ID of the logged-in user

  try {
    const userToUnfollow = await User.findById(id);
    const currentUserData = await User.findById(currentUser);

    if (!userToUnfollow) return res.status(404).json({ message: "User not found." });

    userToUnfollow.followers = userToUnfollow.followers.filter(
      (followerId) => followerId.toString() !== currentUser
    );
    currentUserData.following = currentUserData.following.filter(
      (followingId) => followingId.toString() !== id
    );

    await userToUnfollow.save();
    await currentUserData.save();

    res.status(200).json({ message: "Unfollowed successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error unfollowing user." });
  }
});



// Get followers
router.get("/api/users/:id/followers", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).populate("followers", "username");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.status(200).json(user.followers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching followers." });
  }
});

// Get following
router.get("/api/users/:id/following", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).populate("following", "username");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.status(200).json(user.following);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching following." });
  }
});


router.get('/api/followersandfollowing', async (req, res) => {
  try {
    const followersCount = await User.countDocuments({ followers: req.user.id });
    const followingCount = await User.countDocuments({ following: req.user.id });
    
    const followers = await User.find({ followers: req.user.id })
      .select('username picture name')
      .lean();
      
    const following = await User.find({ following: req.user.id })
      .select('username picture name')
      .lean();

    res.json({ 
      followersCount, 
      followingCount,
      followers,
      following
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching followers and following data" });
  }
});

// Save or update username/email
router.post('/save-username', authenticate, async (req, res) => {
  try {
    const { username, email } = req.body;
    const userId = req.user.id;

    // Check if the username or email is already taken
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
      _id: { $ne: userId } // Exclude the current user from the query
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already in use' });
    }

    // Update the user's username and email
    await User.findByIdAndUpdate(userId, { username, email });

    res.status(200).json({ message: 'Username and email updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating username and email', error: error.message });
  }
});

// Update user bio
router.post('/api/update_bio', async (req, res) => {
  try {
    const { bio } = req.body;
    const userId = req.user.id;

    // Update the user's bio
    await User.findByIdAndUpdate(userId, { bio });

    res.status(200).json({ message: 'Bio updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating bio', error: error.message });
  }
});

// Update username
router.put('/api/update_username', async (req, res) => {
  try {
    const { newUsername } = req.body;
    if (!newUsername || !/^[a-zA-Z0-9._@]+$/.test(newUsername)) {
      return res.status(400).json({ message: 'Valid username is required' });
    }
    const userId = req.user.id || req.user._id;
    // Check if the new username is already taken
    const existingUser = await User.findOne({ username: newUsername });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already taken' });
    }
    // Update the user's username
    await User.findByIdAndUpdate(userId, { username: newUsername });
    res.status(200).json({ message: 'Username updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating username', error: error.message });
  }
});

// Get user by username
router.get('/api/users/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).populate('followers', 'username').populate('following', 'username');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving user', error: err.message });
  }
});

module.exports = router;
