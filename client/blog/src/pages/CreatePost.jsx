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
} from '@mui/material';
import axios from 'axios';

const BlogPostPage = () => {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [selectedFile, setSelectedFile] = useState(null); // Image file
  const [imageUrl, setImageUrl] = useState(''); // URL of uploaded image
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

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

    setIsSubmitting(true); // Disable button while uploading

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", "working"); // Your Cloudinary upload preset
    formData.append("cloud_name", "diz6xc7or"); // Your Cloudinary cloud name

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/diz6xc7or/image/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error uploading image");
      }

      const data = await response.json();
      setImageUrl(data.secure_url); // The uploaded image's URL returned by Cloudinary
      setSnackbarMessage('Image uploaded successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error uploading image:', error);
      setSnackbarMessage('Failed to upload image.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false); // Enable button after upload
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

    // Disable the post button while submitting
    setIsSubmitting(true);
console.log(imageUrl);
    try {
      const blogPost = {
        title: title.trim(),
        content: content.trim(),
        category: category.split(',').map((cat) => cat.trim()),
        image: imageUrl, // Include the image URL uploaded to Cloudinary
        
        author: user?.username || 'Anonymous', // Assuming 'user' object exists
      };

      // Send the blog post data to the backend API
      const response = await axios.post('http://localhost:3000/api/blog-posts', blogPost, {
        withCredentials: true, // For session-based auth, if necessary
      });

      // Show success message
      setSnackbarMessage('Post published successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      // Clear form after successful post
      setTitle('');
      setContent('');
      setCategory('');
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
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5">Create a Blog Post</Typography>
          <Box sx={{ mt: 2 }}>
            {/* Title Input */}
            <TextField
              label="Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            {/* Content Input */}
            <TextField
              label="Content"
              fullWidth
              multiline
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            {/* Category Input */}
            <TextField
              label="Category"
              fullWidth
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            {/* Image Upload */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
            <Button
              variant="outlined"
              onClick={handleImageUpload}
              sx={{ ml: 2 }}
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
