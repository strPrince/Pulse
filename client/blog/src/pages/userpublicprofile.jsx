import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Avatar,
  Container,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  Divider,
  Chip,
  IconButton,
  Tooltip
} from "@mui/material";
import {
  Share,
  PersonAdd,
  Article,
  Cancel,
  People,
  Favorite,
  Edit,
  Link
} from "@mui/icons-material";
import axios from "axios";
import { format } from "date-fns";

const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [showPosts, setShowPosts] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

// TODO: improving follower and following count functionality  and follow functionality

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/current_user", {
          withCredentials: true,
        });
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Error fetching current user:", error);
        navigate("/login");
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/user/profile/${username}`
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [username]);

  useEffect(() => {
    if (currentUser && user) {
      setIsOwnProfile(currentUser._id === user._id);
      checkFollowStatus();
      fetchFollowCounts();
    }
  }, [currentUser, user]);

  const checkFollowStatus = async () => {
    if (!currentUser || !user || currentUser._id === user._id) return;
    
    try {
      const response = await axios.get(
        `http://localhost:3000/api/users/${currentUser._id}/isFollowing/${user._id}`,
        { withCredentials: true }
      );
      setIsFollowing(response.data.isFollowing);
    } catch (error) {
      console.error("Error checking follow status:", error);
    }
  };

  const fetchFollowCounts = async () => {
    try {
      const [followersRes, followingRes] = await Promise.all([
        axios.get(`http://localhost:3000/api/users/${user._id}/followers/count`),
        axios.get(`http://localhost:3000/api/users/${user._id}/following/count`),
      ]);
      setFollowersCount(followersRes.data.count);
      setFollowingCount(followingRes.data.count);
    } catch (error) {
      console.error("Error fetching followers/following counts:", error);
    }
  };

  const handleFollow = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    
    try {
      const endpoint = isFollowing ? 'unfollow' : 'follow';
      await axios.post(
        `http://localhost:3000/api/users/${endpoint}/${user._id}`,
        {},
        { withCredentials: true }
      );
      
      setIsFollowing(!isFollowing);
      setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1);
      
      // Show feedback to user
      const action = isFollowing ? 'unfollowed' : 'followed';
      console.log(`Successfully ${action} ${user.name}`);
    } catch (error) {
      console.error("Error updating follow status:", error);
      alert(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/posts/author/${username}`
      );
      setPosts(response.data);
      setShowPosts(true);
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };

  const handleShareProfile = () => {
    const profileUrl = `${window.location.origin}/user/${username}`;
    const shareText = `Check out ${user.name}'s profile on our platform!`;

    if (navigator.share) {
      navigator.share({
        title: `${user.name}'s Profile`,
        text: shareText,
        url: profileUrl,
      }).catch(() => {
        // Fallback if share fails
        copyToClipboard(profileUrl);
      });
    } else {
      copyToClipboard(profileUrl);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Profile link copied to clipboard!");
  };

  const handleViewPost = (postId) => {
    navigate(`/blog/${postId}`);
  };

  const handleHidePosts = () => {
    setShowPosts(false);
  };

  const handleEditProfile = () => {
    navigate("/settings/profile");
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress size={60} thickness={4} sx={{ color: "#4a90e2" }} />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Typography variant="h4" color="textSecondary">
          User not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #181c24 0%, #23272f 100%)",
        minHeight: "100vh",
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Profile Section */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 4,
                background: "#23272f",
                position: "sticky",
                top: 20,
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar
                  src={user.picture || ""}
                  sx={{
                    width: 150,
                    height: 150,
                    border: "4px solid #4a90e2",
                    mb: 3,
                    fontSize: 60,
                    bgcolor: "#11131a",
                    color: "#fff",
                  }}
                >
                  {!user.picture && user.name[0].toUpperCase()}
                </Avatar>

                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{ mb: 1, textAlign: "center", color: "#fff" }}
                >
                  {user.name}
                </Typography>

                <Typography
                  variant="subtitle1"
                  sx={{ mb: 3, color: "#b0b3b8" }}
                >
                  @{username}
                </Typography>

                {user.bio && (
                  <Typography
                    variant="body1"
                    sx={{ mb: 3, textAlign: "center", color: "#b0b3b8" }}
                  >
                    {user.bio}
                  </Typography>
                )}

                <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                  <Chip
                    icon={<People sx={{ color: '#4a90e2' }} />}
                    label={`${followersCount} Followers`}
                    variant="outlined"
                    sx={{ color: '#fff', borderColor: '#4a90e2', background: '#181c24' }}
                  />
                  <Chip
                    icon={<Favorite sx={{ color: '#e25555' }} />}
                    label={`${followingCount} Following`}
                    variant="outlined"
                    sx={{ color: '#fff', borderColor: '#e25555', background: '#181c24' }}
                  />
                </Box>

                <Divider sx={{ width: "100%", my: 2, borderColor: '#333' }} />

                {isOwnProfile ? (
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={handleEditProfile}
                    sx={{ mb: 2, bgcolor: '#4a90e2', color: '#fff', '&:hover': { bgcolor: '#357ab8' } }}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    variant={isFollowing ? "outlined" : "contained"}
                    color="primary"
                    startIcon={isFollowing ? <Cancel /> : <PersonAdd />}
                    onClick={handleFollow}
                    sx={{ mb: 2, bgcolor: isFollowing ? 'transparent' : '#4a90e2', color: '#fff', borderColor: '#4a90e2', '&:hover': { bgcolor: isFollowing ? '#23272f' : '#357ab8' } }}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                )}

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Share />}
                  onClick={handleShareProfile}
                  sx={{ mb: 2, color: '#fff', borderColor: '#4a90e2', '&:hover': { bgcolor: '#23272f' } }}
                >
                  Share Profile
                </Button>

                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  startIcon={<Article />}
                  onClick={fetchPosts}
                  sx={{ bgcolor: '#e25555', color: '#fff', '&:hover': { bgcolor: '#b32d2d' } }}
                >
                  View Posts
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Posts Section */}
          {showPosts && (
            <Grid item xs={12} md={8}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  background: "#181c24",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 4,
                  }}
                >
                  <Typography variant="h5" fontWeight={700} sx={{ color: '#fff' }}>
                    {user.name}'s Posts
                  </Typography>
                  <Tooltip title="Close posts">
                    <IconButton onClick={handleHidePosts} sx={{ color: '#fff' }}>
                      <Cancel />
                    </IconButton>
                  </Tooltip>
                </Box>

                {posts.length > 0 ? (
                  posts.map((post) => (
                    <Card
                      key={post._id}
                      sx={{
                        mb: 3,
                        background: '#23272f',
                        color: '#fff',
                        transition: "transform 0.2s",
                        '&:hover': {
                          transform: "translateY(-2px)",
                          boxShadow: "0 6px 12px rgba(0,0,0,0.25)",
                        },
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          sx={{ mb: 1, color: '#fff' }}
                        >
                          {post.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ mb: 2, color: '#b0b3b8' }}
                        >
                          {format(new Date(post.createdAt), "MMMM d, yyyy")}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ mb: 3, color: '#e0e0e0' }}
                          paragraph
                        >
                          {post.content.substring(0, 200)}...
                        </Typography>
                        <Button
                          variant="outlined"
                          startIcon={<Link />}
                          onClick={() => handleViewPost(post._id)}
                          sx={{ color: '#4a90e2', borderColor: '#4a90e2', '&:hover': { bgcolor: '#23272f' } }}
                        >
                          Read More
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      py: 6,
                    }}
                  >
                    <Article sx={{ fontSize: 60, color: "#444", mb: 2 }} />
                    <Typography variant="h6" sx={{ color: '#b0b3b8' }}>
                      No posts yet
                    </Typography>
                    {isOwnProfile && (
                      <Button
                        variant="text"
                        sx={{ mt: 2, color: '#4a90e2' }}
                        onClick={() => navigate("/create-post")}
                      >
                        Create your first post
                      </Button>
                    )}
                  </Box>
                )}
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default UserProfile;