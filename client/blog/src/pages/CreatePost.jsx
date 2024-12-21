import React, { useState, useEffect } from 'react';
import {
  Typography,
  Avatar,
  TextField,
  Button,
  Card,
  CardContent,
  Snackbar, 
  Alert,
  Container,
  Box,
  Paper
} from '@mui/material';
import axios from 'axios';

const BlogPostPage = ({  }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [catagory, setCategory] = useState('');
  const [user, setUser] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/current_user', { withCredentials: true });
        if (response.data) {
          setUser(response.data);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setSnackbarMessage('Failed to load user data');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    };

    fetchUser();
  }, []);

  const handlePost = async () => {
    try {
      if (!title.trim() || !content.trim()) {
        setSnackbarMessage('Both title and content are required!');
        setSnackbarSeverity('warning');
        setSnackbarOpen(true);
        return;
      }

      setIsSubmitting(true);
  
      const blogPost = {
        title: title.trim(),
        content: content.trim(),
        tags: catagory.trim(),
        author: user?.username || 'Anonymous',
      };
  
      const response = await axios.post(
        'http://localhost:3000/api/blog-posts',
        blogPost,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      setSnackbarMessage('Post saved successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setTitle('');
      setContent('');
      setCategory('');
    } catch (error) {
      console.error('Error creating blog post:', error);
      setSnackbarMessage('Failed to create blog post');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mainc" style={{ backgroundColor: '#121212' }}>
    <Container maxWidth="lg" sx={{ bgcolor: '#121212' }}>
      <Box
        sx={{
          minHeight: '100vh',
          py: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          bgcolor: '#121212',
          color: '#fff'
        }}
      >
        <Paper 
          elevation={0}
          sx={{
            p: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            bgcolor: '#1E1E1E',
            color: '#fff'
          }}
        >
          <Avatar
            alt={user?.username || 'User'}
            src={user?.picture || 'https://via.placeholder.com/100'}
            sx={{ width: 64, height: 64 }}
          />
          <Box>
            <Typography variant="h5" fontWeight="medium" color="#fff">
              {user?.username || 'Guest User'}
            </Typography>
            <Typography variant="body2" color="#9BA4B5">
              Share your thoughts with the community
            </Typography>
          </Box>
        </Paper>

        <Card
          elevation={2}
          sx={{
            borderRadius: 2,
            bgcolor: '#1E1E1E',
            color: '#fff'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom fontWeight="medium" color="#fff">
              Create a New Blog Post
            </Typography>
            
            <Box component="form" noValidate sx={{ mt: 3 }}>
              <TextField
                label="Title"
                variant="outlined"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': {
                      borderColor: '#394867',
                    },
                    '&:hover fieldset': {
                      borderColor: '#537FE7',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#9BA4B5'
                  }
                }}
                required
                error={title.trim() === ''}
                helperText={title.trim() === '' ? 'Title is required' : ''}
              />
              
              <TextField
                label="Content"
                variant="outlined"
                fullWidth
                multiline
                rows={12}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': {
                      borderColor: '#394867',
                    },
                    '&:hover fieldset': {
                      borderColor: '#537FE7',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#9BA4B5'
                  }
                }}
                required
                error={content.trim() === ''}
                helperText={content.trim() === '' ? 'Content is required' : ''}
              />
              
              <TextField
                label="Category"
                variant="outlined"
                fullWidth
                value={catagory}
                onChange={(e) => setCategory(e.target.value)}
                sx={{ 
                  mb: 4,
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': {
                      borderColor: '#394867',
                    },
                    '&:hover fieldset': {
                      borderColor: '#537FE7',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#9BA4B5'
                  }
                }}
                placeholder="Enter category tags separated by commas"
              />

              <Button
                variant="contained"
                color="primary"
                onClick={handlePost}
                fullWidth
                disabled={isSubmitting || !title.trim() || !content.trim()}
                sx={{
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  bgcolor: '#537FE7',
                  '&:hover': {
                    bgcolor: '#3457D5'
                  }
                }}
              >
                {isSubmitting ? 'Publishing...' : 'Publish Post'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
    </div>
  );
};

export default BlogPostPage;
