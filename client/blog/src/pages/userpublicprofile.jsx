import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";  // Import useNavigate
import { Box, Typography, CircularProgress, Avatar, Container, Paper, Grid, Button, Tooltip, Divider } from "@mui/material";
import { Email, LocationOn, Work, DateRange, Share } from "@mui/icons-material";
import axios from "axios";

const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();  // Initialize navigate hook
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Assume you have a function to get the current logged-in user info
  const currentUser = JSON.parse(sessionStorage.getItem('user')) || null; // Get user from session storage

  useEffect(() => {
    // Check if the current user is the same as the profile user
    if (currentUser && currentUser.name === username) {
      console.log(currentUser.name, username);
      navigate('/profile');  // Redirect to '/profile' if usernames match
    }

    const fetchUser = async () => {
      setLoading(true);
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
  }, [username, currentUser, navigate]);  // Add navigate and currentUser to the dependency array

  const handleShareProfile = () => {
    const shareText = `Check out ${user.name}'s profile: http://localhost:3000/user/${username}`;
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
    <div style={{ background: 'linear-gradient(to bottom, #0f0f1a, #1a1a2e)', height: '100vh', overflowY: 'hidden' }}>
      <Container maxWidth="md">
        <Paper
          elevation={6}
          sx={{
            mt: 6,
            mb: 4,
            borderRadius: 4,
            backgroundColor: '#1a1a2e',
            color: "#e6e6ff",
            overflow: "hidden",
            boxShadow: "0 12px 24px rgba(0, 0, 0, 0.5)",
          }}
        >
          <Box
            sx={{
              height: 200,
              background: "linear-gradient(to bottom, #4a90e2, #1a1a2e)",
              position: "relative",
            }}
          />
          <Box
            sx={{
              px: 4,
              pb: 4,
              position: "relative",
              mt: -8,
            }}
          >
            {user.picture ? (
              <Avatar
                src={user.picture}
                sx={{
                  width: 150,
                  height: 150,
                  border: "5px solid #e6e6ff",
                  marginTop: "-75px",
                  position: "relative",
                  boxShadow: "0 8px 16px rgba(255, 255, 255, 0.2)",
                }}
              />
            ) : (
              <Avatar
                sx={{
                  width: 150,
                  height: 150,
                  border: "5px solid #e6e6ff",
                  bgcolor: "#ff6b6b",
                  fontSize: "3rem",
                  marginTop: "-75px",
                  position: "relative",
                  boxShadow: "0 8px 16px rgba(255, 107, 107, 0.5)",
                }}
              >
                {user.name[0].toUpperCase()}
              </Avatar>
            )}
            <Grid container spacing={4} sx={{ mt: 4 }}>
              <Grid item xs={12}>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  color="#ff9f43"
                  sx={{
                    textShadow: "0 4px 8px rgba(0,0,0,0.5)",
                  }}
                >
                  {user.name}
                </Typography>
                <Typography
                  variant="h6"
                  color="#4a90e2"
                  sx={{
                    mb: 3,
                    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  @{username}
                </Typography>
                <Typography variant="body1" color="rgba(230,230,255,0.9)" sx={{ mb: 3 }}>
                  {user.bio || "No bio available"}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    flexWrap: "wrap",
                    mb: 3,
                    color: "rgba(230,230,255,0.7)",
                  }}
                >
                  {user.email && (
                    <Tooltip title="Email">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Email />
                        <Typography>{user.email}</Typography>
                      </Box>
                    </Tooltip>
                  )}
                  {user.location && (
                    <Tooltip title="Location">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LocationOn />
                        <Typography>{user.location}</Typography>
                      </Box>
                    </Tooltip>
                  )}
                  {user.occupation && (
                    <Tooltip title="Occupation">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Work />
                        <Typography>{user.occupation}</Typography>
                      </Box>
                    </Tooltip>
                  )}
                  {user.joinDate && (
                    <Tooltip title="Join Date">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <DateRange />
                        <Typography>
                          Joined {new Date(user.joinDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Tooltip>
                  )}
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3, backgroundColor: "rgba(74,144,226,0.25)" }} />

            <Box display="flex" justifyContent="center" mt={2}>
              <Button
                variant="contained"
                startIcon={<Share />}
                onClick={handleShareProfile}
                sx={{
                  backgroundColor: "#4a90e2",
                  color: "#fff",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#66a3ff",
                  },
                }}
              >
                Share Profile
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default UserProfile;
