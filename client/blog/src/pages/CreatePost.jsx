import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  InputLabel,
} from '@mui/material';
import axios from 'axios';

const BlogPostPage = () => {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState(''); // For custom category
  const [selectedFile, setSelectedFile] = useState(null); // Image file
  const [imageUrl, setImageUrl] = useState(''); // URL of uploaded image
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const predefinedCategories = ['Technology', 'Lifestyle', 'Health', 'Travel', 'Other'];

  // Fetch current user details (if required)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/current_user', { withCredentials: true });
        setUser(response.data);
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    fetchUser();
  }, []);

  // Handle Image Upload to Cloudinary
  const handleImageUpload = async () => {
    if (!selectedFile) {
      setSnackbarMessage('Please select an image to upload.');
      setSnackbarSeverity('error'); 
      setSnackbarOpen(true);
      return;
    }

    // Check file size
    if (selectedFile.size > 10485760) { // 10MB limit
      setSnackbarMessage('Image size must be less than 10MB');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('upload_preset', 'working');
    formData.append('cloud_name', 'diz6xc7or');
    formData.append('api_key', '511498659492683'); // Add your Cloudinary API key
    formData.append('timestamp', Math.floor(Date.now() / 1000)); // Add timestamp

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/diz6xc7or/image/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Error uploading image');
      }

      const data = await response.json();
      setImageUrl(data.secure_url);
      setSnackbarMessage('Image uploaded successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error uploading image:', error);
      setSnackbarMessage(error.message || 'Failed to upload image.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Post Submission
  const handlePost = async () => {
    if (!title.trim() || !content.trim()) {
      setSnackbarMessage('Please fill in all required fields.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    const selectedCategories = category === 'Other' && customCategory ? [customCategory] : [category];
    const blogPost = {
      title: title.trim(),
      content: content.trim(),
      tags: selectedCategories,
      image: imageUrl, // Include the image URL uploaded to Cloudinary
      author: user?.username || 'Anonymous', // Assuming 'user' object exists
    };

    setIsSubmitting(true); // Disable the post button while submitting

    try {
      const response = await axios.post('http://localhost:3000/api/blog-posts', blogPost, {
        withCredentials: true, // For session-based auth, if necessary
      });

      setSnackbarMessage('Post published successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      // Clear form after successful post
      setTitle('');
      setContent('');
      setCategory('');
      setCustomCategory('');
      setImageUrl('');
      setSelectedFile(null);
    } catch (error) {
      console.error('Error creating post:', error);
      setSnackbarMessage('Failed to publish post.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false); // Re-enable the button
    }
  };

  return (
    <Container maxWidth="lg" sx={{ bgcolor: '#1e1e1e', color: '#fff', minHeight: '100vh', minWidth: '100vw' }}>
      <Box sx={{ py: 4, width: '90%', mx: 'auto' }}>
        <Paper sx={{ p: 3, bgcolor: '#2e2e2e', color: '#fff' }}>
          <Typography variant="h5" sx={{ color: '#fff' }}>Create a Blog Post</Typography>
          <Box sx={{ mt: 2 }}>
            {/* Title Input */}
            <TextField
              label="Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              sx={{
                '& .MuiInputLabel-root': { color: '#999' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#666' },
                  '&:hover fieldset': { borderColor: '#999' },
                  '& input': { color: '#fff' }
                }
              }}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            {/* Formatting Buttons */}
            <Box sx={{ mb: 1 }}>
              <Button
                variant="outlined"
                sx={{ mr: 1, color: '#fff', borderColor: '#666' }}
                onClick={() => setContent(content + '**bold text**')}
              >
                Bold
              </Button>
              <Button
                variant="outlined"
                sx={{ mr: 1, color: '#fff', borderColor: '#666' }}
                onClick={() => setContent(content + '*italic text*')}
              >
                Italic
              </Button>
              <Button
                variant="outlined"
                sx={{ color: '#fff', borderColor: '#666' }}
                onClick={() => setContent(content + '[link text](url)')}
              >
                Add Link
              </Button>
            </Box>
            {/* Content Input */}
            <TextField
              label="Content (Supports Markdown)"
              fullWidth
              multiline
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              sx={{
                '& .MuiInputLabel-root': { color: '#999' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#666' },
                  '&:hover fieldset': { borderColor: '#999' },
                  '& textarea': { color: '#fff' }
                }
              }}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            {/* Category Input */}
            <InputLabel sx={{ color: '#999' }}>Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => {
                const selectedValue = e.target.value;
                if (selectedValue !== 'Other') {
                  setCategory(selectedValue);
                  setCustomCategory('');
                } else {
                  setCategory('Other');
                }
              }}
              fullWidth
              sx={{
                color: '#fff',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#666' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#999' },
              }}
            >
              {predefinedCategories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>

            {category === 'Other' && (
              <TextField
                label="Custom Category"
                fullWidth
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                required
                sx={{
                  mt: 2,
                  '& .MuiInputLabel-root': { color: '#999' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#666' },
                    '&:hover fieldset': { borderColor: '#999' },
                    '& input': { color: '#fff' },
                  },
                }}
              />
            )}
          </Box>
          <Box sx={{ mt: 2 }}>
            {/* Image Upload */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              style={{ color: '#fff' }}
            />
            <Button
              variant="outlined"
              onClick={handleImageUpload}
              sx={{ ml: 2, color: '#fff', borderColor: '#666' }}
              disabled={isSubmitting}
            >
              Upload Image
            </Button>
          </Box>
          {imageUrl && (
            <Box sx={{ mt: 2 }}>
              <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '100%' }} />
            </Box>
          )}
          <Box sx={{ mt: 3 }}>
            {/* Submit Post */}
            <Button
              variant="contained"
              onClick={handlePost}
              disabled={isSubmitting}
              sx={{
                bgcolor: '#1976d2',
                '&:hover': { bgcolor: '#1565c0' }
              }}
            >
              {isSubmitting ? 'Publishing...' : 'Publish Post'}
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Snackbar for status messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BlogPostPage;
