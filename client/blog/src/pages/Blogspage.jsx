import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Container, 
  Divider
} from "@mui/material";
import axios from "axios";
import BlogCard from '../components/blogcard';
import Verifypopup from '../components/Verifypopup';

const EnhancedBlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/blogs");
      console.log(response.data);
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/current_user", {
        withCredentials: true,
      });
      setCurrentUser(response.data);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchCurrentUser();
  }, []);

  const handleDeleteBlog = (blogId) => {
    setBlogToDelete(blogId);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async (confirmed) => {
    setShowDeleteDialog(false);
    if (confirmed && blogToDelete) {
      try {
        await axios.delete(`http://localhost:3000/api/blogs/${blogToDelete}`, {
          withCredentials: true,
        });
        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== blogToDelete));
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }
    setBlogToDelete(null);
  };

  return (
    <Box 
      sx={{
        background: 'linear-gradient(to bottom, #0f0f1a, #1a1a2e)',
        minHeight: '100vh',
        py: 6,
        px: { xs: 1, sm: 2, md: 0 },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      <Container maxWidth="md" sx={{ p: 0 }}>
        {blogs.map((blog) => (
          <BlogCard 
            key={blog._id} 
            blog={blog} 
            currentUser={currentUser} 
            onDelete={handleDeleteBlog} 
          />
        ))}

        {loading && (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress sx={{ color: '#4a90e2' }} />
          </Box>
        )}
        <Verifypopup
          open={showDeleteDialog}
          onClose={handleConfirmDelete}
          message="Are you sure you want to delete this blog?"
        />
      </Container>
    </Box>
  );
};

export default EnhancedBlogPage;
