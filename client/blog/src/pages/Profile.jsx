import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import {
  Typography,
  Avatar,
  Button,
  TextField,
  Card,
  Tabs,
  Tab,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme,
  IconButton,
} from '@mui/material';
import UpdateIcon from '@mui/icons-material/Update';
import EditIcon from '@mui/icons-material/Edit';
import HomeIcon from '@mui/icons-material/Home';

import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
axios.defaults.withCredentials = true;
const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [newBio, setNewBio] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
     
        const response = await axios.get('http://localhost:3000/api/current_user', {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          
          }
        });

        if (response.data) {
          setUser(response.data);  // Set user data on successful fetch
          console.log('User data:', response.data);
        } else {
          setError('No user data found.');
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to fetch user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);
  useEffect(() => {
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/current_user', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data) {
        setUser(response.data);  // Set user data on successful fetch
        localStorage.setItem('currentUser', JSON.stringify(response.data)); // Store user data in localStorage
        console.log('User data:', response.data);
      } else {
        setError('No user data found.');
        localStorage.removeItem('currentUser'); // Remove user data if none found
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      setError('Failed to fetch user data.');
      localStorage.removeItem('currentUser'); // Remove user data on error
    } finally {
      setLoading(false);
    }
  };

  // Check if user data exists in localStorage on mount
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    setUser(JSON.parse(storedUser));
    setLoading(false);
  } else {
    fetchUser();
  }
}, []);

 
  // Fallback for missing user data
  const getUserName = () => {
    return user?.name || 'John Doe';  // Default name if not present
  };

  const getUserAvatar = () => {
    return user?.picture || 'https://via.placeholder.com/100';  // Default avatar if not present
  };

  const getUserBio = () => {
    return user?.bio || 'This user has not provided a bio yet.';  // Default bio if not present
  };

  // Fetch user posts
  const fetchPostsByUsername = async () => {
    if (!user || !user.username) {
      console.error('Username is not available.');
      setMessage('Username is not available.');
      setSeverity('error');
      return;
    }
  
    setLoadingPosts(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/posts/author/${user.username}`, // Updated endpoint
        { withCredentials: true }
      );
  
      if (response.data && Array.isArray(response.data)) {
        setPosts(response.data);
        // console.log('Fetched posts by username:', response.data);
      } else {
        setPosts([]);
        console.error('Invalid posts data format:', response.data);
      }
    } catch (err) {
      console.error('Error fetching posts by username:', err);
      setMessage('Failed to fetch posts by username.');
      setSeverity('error');
      setPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPostsByUsername();
    }
  }, [user]);

  // Function to delete a post
const handleDeleteClick = async (postId) => {
  if (window.confirm("Are you sure you want to delete this post?")) {
    try {
      await axios.delete(`http://localhost:3000/api/blogs/${postId}`, {
        withCredentials: true,
      });
      // Remove the deleted post from state

      setPosts(posts.filter(post => post._id !== postId));
      setMessage('Post deleted successfully');
      setSeverity('success');
    } catch (error) {
      console.error("Error deleting post:", error);
      setMessage('Error deleting post');
      setSeverity('error'); 
    }
  }
};

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:3000/logout');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleBioUpdate = async () => {
    try {
      await axios.post(
        'http://localhost:3000/api/update_bio',
        { bio: newBio },
        { withCredentials: true }
      );
      setUser((prevUser) => ({ ...prevUser, bio: newBio }));
      setNewBio('');
      setMessage('Bio updated successfully!');
      setSeverity('success');
    } catch (err) {
      setMessage('Error updating bio.');
      setSeverity('error');
    }
  };

  const handleUsernameUpdate = async () => {
    try {
      if (!newUsername) {
        setMessage('Username cannot be empty');
        setSeverity('error');
        return;
      }

      await axios.post(
        'http://localhost:3000/api/update_username',
        { username: newUsername },
        { withCredentials: true }
      );
      setUser((prevUser) => ({ ...prevUser, username: newUsername }));
      setNewUsername('');
      setMessage('Username updated successfully!');
      setSeverity('success');
    } catch (err) {
      if (err.response?.status === 409) {
        setMessage('Username already taken');
      } else {
        setMessage('Error updating username');
      }
      setSeverity('error');
    }
  };

  const handleTabChange = (event, newValue) => setTabIndex(newValue);

 const toggleEditProfile = () => {
    setIsEditingProfile(!isEditingProfile);
    if (isEditingProfile) {
      setNewBio('');
      setNewUsername('');
      // Refetch posts when canceling edit mode
      fetchPostsByUsername();
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" align="center" color="error" sx={{ marginTop: '20px' }}>
        {error}
      </Typography>
    );
  }

  return (
    <div className='' style={{height: '100vh' ,  background: 'linear-gradient(to bottom, #0f0f1a, #1a1a2e)',backgroundAttachment: 'fixed',overflowY: 'auto'}}>
      <IconButton
  onClick={() => navigate('/')}
  sx={{ 
    color: 'white',
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
    '&:hover': {
      color: 'primary.main',
      transform: 'scale(1.1)',
    },
    transition: 'all 0.2s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  }}
  aria-label="Return to home"
  title="Return to home"
>
  <HomeIcon />
  <Typography variant="caption" sx={{fontSize: '0.8rem'}}>Home</Typography>
</IconButton>
      <Box sx={{ padding: 2, maxWidth: 900, margin: 'auto' }}>
        {/* Profile Header */}
        <Card sx={{ marginBottom: 2, padding: 2, position: 'relative', backgroundColor:'#1C232D', color: 'white' }}>
          <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} alignItems="center">
            <Avatar
              alt={getUserName()}
              src={getUserAvatar()}
              sx={{
                width: isMobile ? 80 : 100,
                height: isMobile ? 80 : 100,
                marginRight: isMobile ? 0 : 2,
                marginBottom: isMobile ? 2 : 0,
              }}
            />
            <Box flex={1} >
              <Typography variant="h5" fontWeight="bold">
                {getUserName()}
              </Typography>
              <Typography variant="body2" color='lightblue' sx={{textDecoration1:'underline'}}>
                @{user?.username || 'No username'} 
              </Typography>
              {/* <Typography variant="body2" sx={{ color: 'lightgray' }}>
                {user?.email || 'No email'}6
              </Typography> */}
              {/*  *this is for just testing purposes */}
              <Typography variant="body1" sx={{ marginTop: 1 }}>
                {getUserBio()}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <IconButton 
                onClick={toggleEditProfile} 
                sx={{ marginRight: 1, color: 'white' }}
              >
                {isEditingProfile ? <CloseIcon /> : <EditIcon />}
              </IconButton>
              <Button
                variant="outlined"
                sx={{ textTransform: 'none', marginTop: isMobile ? 2 : 0, color: 'white', borderColor: 'white' }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
          </Box>
        </Card>

        {/* Tabs for Posts, Followers, etc. */}
        {!isEditingProfile && (
          <Card sx={{ backgroundColor:'#1C232D', color:'white' }}>
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              variant="fullWidth"
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab label="Posts" sx={{ color: 'white' }} />
              <Tab label="Followers" sx={{ color: 'white' }} />
              <Tab label="Following" sx={{ color: 'white' }} />
            </Tabs>
            <Box p={2}>
              {tabIndex === 0 && (
                <div>
                  {loadingPosts ? (
                    <CircularProgress />
                  ) : posts.length > 0 ? (
                    posts.map((post) => (
                      <Card
  key={post._id}
  sx={{
    marginBottom: 2,
    padding: 3,
    backgroundColor: '#2E3B4E',
    color: 'white',
    borderRadius: '12px',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 6px 12px rgba(0,0,0,0.2)'
    }
  }}
>
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography 
        variant="h6" 
        sx={{
          fontWeight: 600,
          fontSize: '1.2rem',
          textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
        }}
      >
        {post.title}
      </Typography>
      <IconButton 
        size="small"
        sx={{ color: 'lightblue' }}
        onClick={() => navigate(`/edit-blog/${post._id}`)}
      >
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small" 
        sx={{ color: '#ff4444' }}
        onClick={()=> handleDeleteClick(post._id) }
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Box>
    <Chip
      label={`${post.voteScore} votes`}
      sx={{
        backgroundColor: 'rgba(255,165,0,0.2)',
        color: 'orange',
        fontWeight: 'bold'
      }}
    />
  </Box>
  
  <Typography 
    variant="body2" 
    sx={{ 
      color: 'rgba(255,255,255,0.7)',
      fontSize: '0.85rem',
      mb: 2
    }}
  >
    By {post.author} • {new Date(post.createdAt).toLocaleDateString()}
  </Typography>
  
  <Typography 
    variant="body1" 
    sx={{
      mb: 2,
      lineHeight: 1.6,
      color: 'rgba(255,255,255,0.9)'
    }}
  >
    {post.content}
  </Typography>
  
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
    {post.tags.map(tag => (
      <Chip
        key={tag}
        label={tag}
        size="small"
        sx={{
          backgroundColor: 'rgba(135,206,235,0.2)',
          color: 'lightblue',
          '&:hover': {
            backgroundColor: 'rgba(135,206,235,0.3)'
          }
        }}
      />
    ))}
  </Box>
</Card>                    ))
                  ) : (
                    <Typography>No posts available for this author.</Typography>
                  )}
                </div>
              )}
              {tabIndex === 1 && <Typography color="white">Followers feature coming soon...</Typography>}
              {tabIndex === 2 && <Typography color="white">Following feature coming soon...</Typography>}
            </Box>
          </Card>
        )}

        {/* Bio and Username Editor */}
        {isEditingProfile && (
          <Card sx={{ marginTop: 2, padding: 2 ,backgroundColor:'#1C232D',color:'white'}}>
            <Typography variant="h6">Edit Profile</Typography>

            <Box sx={{ marginTop: 2 }}>
              <Typography variant="subtitle1">Update Bio</Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Add or update your bio"
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
                sx={{ 
                  marginBottom: 2,
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'white',
                    },
                  },
                }}
              />
              <Button 
                variant="contained" 
                onClick={handleBioUpdate} 
                sx={{ marginBottom: 2 }}
                startIcon={<UpdateIcon />}
              >
                Save Bio
              </Button>
            </Box>

            <Box sx={{ marginTop: 2 }}>
              <Typography variant="subtitle1">Update Username</Typography>
              <TextField
                fullWidth
                placeholder="Update your username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                sx={{ 
                  marginBottom: 2,
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'white',
                    },
                  },
                }}
              />
              <Button 
                variant="contained" 
                onClick={handleUsernameUpdate}
                sx={{ marginBottom: 2 }}
                startIcon={<UpdateIcon />}
              >
                Save Username
              </Button>
            </Box>
          </Card>
        )}
      </Box>

      {/* Snackbar for messages */}
      <Snackbar open={message !== ''} autoHideDuration={6000} onClose={() => setMessage('')}>
        <Alert onClose={() => setMessage('')} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Profile;
