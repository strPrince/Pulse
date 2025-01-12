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
} from "@mui/material";
import { Share, PersonAdd, Article, Cancel } from "@mui/icons-material";
import axios from "axios";

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
        const response = await axios.get(`http://localhost:3000/api/user/profile/${username}`);
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
    const fetchFollowState = async () => {
      if (currentUser && user) {
        try {
          const response = await axios.get(`http://localhost:3000/api/users/${user._id}/followers`);
          setIsFollowing(response.data.some((follower) => follower._id === currentUser._id));
        } catch (error) {
          console.error("Error fetching follow state:", error);
        }
      }
    };
console.log(isFollowing)
    const fetchCounts = async () => {
      if (user) {
        try {
          const [followersRes, followingRes] = await Promise.all([
            axios.get(`http://localhost:3000/api/users/${user._id}/followers`),
            axios.get(`http://localhost:3000/api/users/${user._id}/following`),
          ]);
          setFollowersCount(followersRes.data.length);
          setFollowingCount(followingRes.data.length);
        } catch (error) {
          console.error("Error fetching followers/following counts:", error);
        }
      }
    };

    if (user) {
      fetchFollowState();
      fetchCounts();
    }
  }, [user, currentUser]);

  const handleFollow = async () => {
    if (!currentUser) {
      alert("You need to be logged in to follow users.");
      return;
    }

    if (!user?._id) {
      console.error('User ID is missing');
      alert("Unable to follow user at this time");
      return;
    }

    try {
      const endpoint = isFollowing ? 'unfollow' : 'follow';
      const response = await axios.post(
        `http://localhost:3000/api/users/${endpoint}/${user._id}`,
        {},
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        setIsFollowing(!isFollowing, () => {
          console.log("Follow state updated to:", !isFollowing);
        });
        setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1);
        
        setTimeout(fetchCounts, 1000); // Sync with server after a delay
        
        const message = isFollowing ? 
          `Unfollowed ${user.name}` : 
          `Following ${user.name}`;
        alert(message);
      }

    } catch (error) {
      console.error("Error following/unfollowing user:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Something went wrong. Please try again.");
      // Optionally revert state changes if necessary
      // setIsFollowing(isFollowing); // reverts if update failed
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/posts/author/${username}`);
      setPosts(response.data);
      setShowPosts(true);
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };

  const handleShareProfile = () => {
    const shareText = `Check out ${user.name}'s profile (${followersCount} followers): http://localhost:3000/user/${username}`;
    if (navigator.share) {
      navigator.share({
        title: `${user.name}'s Profile`,
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert("Profile link copied to clipboard!");
    }
  };

  const handleViewPost = (postId) => {
    navigate(`/blog/${postId}`);
  };

  const handleHidePosts = () => {
    setShowPosts(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress sx={{ color: "#4a90e2" }} />
      </Box>
    );
  }

  if (!user) {
    return (
      <Typography textAlign="center" color="rgba(230,230,255,0.9)">
        User not found
      </Typography>
    );
  }

  return (
    <div
      style={{
        background: "linear-gradient(to bottom, #0f0f1a, #1a1a2e)",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={showPosts ? 4 : 8} sx={{ display: "flex", justifyContent: "center" }}>
            <Paper
              elevation={6}
              sx={{
                width: showPosts ? "100%" : "70%",
                borderRadius: 4,
                backgroundColor: "#1a1a2e",
                color: "#e6e6ff",
                overflow: "hidden",
                boxShadow: "0 12px 24px rgba(0, 0, 0, 0.5)",
                transition: "width 0.3s ease-in-out",
              }}
            >
              <Button
                variant="contained"
                startIcon={<Share />}
                onClick={handleShareProfile}
                sx={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  zIndex: 1,
                  backgroundColor: "rgba(74,144,226,0.8)",
                  "&:hover": {
                    backgroundColor: "#4a90e2",
                  },
                }}
              >
                Share
              </Button>

              <Box sx={{ px: 4, pb: 1, position: "relative", padding: "20px" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    src={user.picture || ""}
                    sx={{
                      width: 100,
                      height: 100,
                      border: "2px solid #e6e6ff",
                      position: "relative",
                    }}
                  >
                    {!user.picture && user.name[0].toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color="#ff9f43">
                      {user.name}
                    </Typography>
                    <Typography variant="h6" color="#4a90e2">
                      @{username}
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  variant="body1"
                  color="rgba(230,230,255,0.9)"
                  sx={{ mt: 3, mb: 3 }}
                >
                  {user.bio || "No bio available"}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 3,
                    px: 2,
                  }}
                >
                  <Box textAlign="center">
                    <Typography variant="h6" fontWeight="bold" color="#ff9f43">
                      {followersCount}
                    </Typography>
                    <Typography variant="body2" color="rgba(230,230,255,0.7)">
                      Followers
                    </Typography>
                  </Box>
                  <Box textAlign="center">
                    <Typography variant="h6" fontWeight="bold" color="#ff9f43">
                      {followingCount}
                    </Typography>
                    <Typography variant="body2" color="rgba(230,230,255,0.7)">
                      Following
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                  
                  <Button
                    variant={isFollowing ? "outlined" : "contained"} 
                    startIcon={isFollowing ? <Cancel /> : <PersonAdd />}
                    onClick={handleFollow}
                    sx={{
                      backgroundColor: isFollowing ? "transparent" : "#4a90e2",
                      borderColor: isFollowing ? "#ff6b6b" : "transparent", 
                      color: isFollowing ? "#ff6b6b" : "#fff",
                      "&:hover": {
                        backgroundColor: isFollowing ? "rgba(255, 107, 107, 0.1)" : "#66a3ff",
                        borderColor: isFollowing ? "#ff8585" : "transparent",
                      },
                    }}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<Article />}
                    onClick={fetchPosts}
                    sx={{
                      borderColor: "#4a90e2",
                      color: "#4a90e2",
                      "&:hover": {
                        borderColor: "#66a3ff",
                        backgroundColor: "rgba(74,144,226,0.1)",
                      },
                    }}
                  >
                    View Posts
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {showPosts && (
            <Grid item xs={12} md={8}>
              <Button
                variant="text"
                startIcon={<Cancel />}
                onClick={handleHidePosts}
                sx={{ mb: 2, color: "#ff6b6b" }}
              >
                Cancel
              </Button>
              <Paper
                elevation={6}
                sx={{
                  maxHeight: "80vh",
                  overflowY: "auto",
                  padding: 2,
                  borderRadius: 4,
                  backgroundColor: "#1a1a2e",
                  color: "#e6e6ff",
                  boxShadow: "0 12px 24px rgba(0, 0, 0, 0.5)",
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#1a1a2e",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#4a90e2",
                    borderRadius: "4px",
                  },
                }}
              >
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <Card
                      key={post._id}
                      sx={{
                        marginBottom: 2,
                        backgroundColor: "#29293d",
                        color: "#e6e6ff",
                        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" fontWeight="bold" color="#ff9f43">
                          {post.title}
                        </Typography>
                        <Typography variant="body2" color="rgba(230,230,255,0.7)">
                          {post.content.substring(0, 100)}...
                        </Typography>

                        <Button
                          variant="contained"
                          onClick={() => handleViewPost(post._id)}
                          sx={{
                            mt: 2,
                            backgroundColor: "#4a90e2",
                            "&:hover": {
                              backgroundColor: "#66a3ff",
                            },
                          }}
                        >
                          View Post
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Typography>No posts available</Typography>
                )}
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>
    </div>
  );
};

export default UserProfile;