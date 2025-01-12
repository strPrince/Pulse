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

    userToFollow.followers.push(currentUser);
    currentUserData.following.push(id);

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


module.exports = router;
