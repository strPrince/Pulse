import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

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
          withCredentials: true,  // Make sure cookies are sent
        });

        if (response.data) {
          setUser(response.data);  // Set user data on successful fetch
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

  // Fetch user posts
  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     if (!user || !user.id) return;
      
  //     setLoadingPosts(true);
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:3000//api/posts/${user.id}`,
  //         { withCredentials: true }
  //       );

  //       if (response.data && Array.isArray(response.data)) {
  //         setPosts(response.data);
  //         console.log('Fetched posts:');
  //         console.log('Fetched posts:', response.data);
  //       } else {
  //         setPosts([]);
  //         console.error('Invalid posts data format:', response.data);
  //       }
  //     } catch (err) {
  //       console.error('Error fetching posts:', err);
  //       setMessage('Failed to fetch posts');
  //       setSeverity('error');
  //       setPosts([]);
  //     } finally {
  //       setLoadingPosts(false);
  //     }
  //   };

  //   if (user) {
  //     fetchPosts();
  //   }
  // }, [user]);

  

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
        console.log('Fetched posts by username:', response.data);
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
      setMessage('Error updating username.');
      setSeverity('error');
    }
  };

  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  const toggleEditProfile = () => {
    setIsEditingProfile(!isEditingProfile);
    if (isEditingProfile) {
      setNewBio('');
      setNewUsername('');
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
    <div className='' style={{height: '100vh' ,  background: 'linear-gradient(to bottom, #0f0f1a, #1a1a2e)'}}>
    <Box sx={{ padding: 2, maxWidth: 900, margin: 'auto'  }}>
      {/* Profile Header */}
      <Card sx={{ marginBottom: 2, padding: 2, position: 'relative',backgroundColor:'#1C232D',color:'white' }}>
        <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} alignItems="center">
          <Avatar
            alt={user.name}
            src={user.picture}
            sx={{
              width: isMobile ? 80 : 100,
              height: isMobile ? 80 : 100,
              marginRight: isMobile ? 0 : 2,
              marginBottom: isMobile ? 2 : 0,
            }}
          />
          <Box flex={1} >
            <Typography variant="h5" fontWeight="bold">
              {user.name}
            </Typography>
            <Typography variant="body2" color='lightblue' sx={{textDecoration1:'underline'}}>
              @{user.username}
            </Typography>
            <Typography variant="body1" sx={{ marginTop: 1 }}>
              {user.bio || 'No bio available'}
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
      <Card sx={{backgroundColor:'#1C232D',color:'white'}}>
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
        <>
            <div>
    {loadingPosts ? (
      <CircularProgress />
    ) : posts.length > 0 ? (
      posts.map((post) => (
        <Card
          key={post._id}
          sx={{ marginBottom: 2, padding: 2, backgroundColor: '#2E3B4E', color: 'white' }}
        >
          <Typography variant="h6">{post.title}</Typography>
          <Typography variant="body2" sx={{ color: 'lightgray' }}>
            By {post.author} on {new Date(post.createdAt).toLocaleDateString()}
          </Typography>
          <Typography variant="body1">{post.content}</Typography>
          <Typography variant="body2" sx={{ marginTop: 1, color: 'lightblue' }}>
            Tags: {post.tags.join(', ')}
          </Typography>
          <Typography variant="body2" sx={{ marginTop: 1, color: 'orange' }}>
            Vote Score: {post.voteScore}
          </Typography>
        </Card>
      ))
    ) : (
      <Typography>No posts available for this author.</Typography>
    )}
  </div>
  </>
            
          )}
                
          

          {tabIndex === 1 && <Typography color="white">Followers feature coming soon...</Typography>}
          {tabIndex === 2 && <Typography color="white">Following feature coming soon...</Typography>}
        </Box>
      </Card>

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
              startIcon={<UpdateIcon />}
            >
              Save Username
            </Button>
          </Box>
        </Card>
      )}

      <Snackbar 
        open={!!message} 
        autoHideDuration={6000} 
        onClose={() => setMessage('')}
      >
        <Alert severity={severity} onClose={() => setMessage('')}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
    </div>
  );
};

export default Profile;
