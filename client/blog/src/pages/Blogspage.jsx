import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Container, 
  Avatar, 
  Card, 
  CardContent, 
  Button, 
  Chip, 
  Stack 
} from "@mui/material";
import axios from "axios";

const BlogCard = ({ blog }) => {
  const navigate = useNavigate();

  const handleAuthorClick = (username) => {
    navigate(`/user/${username}`); // Navigate to the user profile page with the username
  };

  return (
    <Card 
      sx={{
        backgroundColor: '#1a1a2e',
        color: '#e6e6ff',
        borderRadius: 4,
        mb: 4,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.5)'
        }
      }}
      elevation={6}
    >
      <CardContent>
        {/* Blog Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center">
            <Avatar 
              sx={{ 
                width: 48, 
                height: 48, 
                mr: 2,
                bgcolor: '#ff6b6b',
                boxShadow: '0 4px 8px rgba(255,107,107,0.3)'
              }}
            >
              {blog.author[0].toUpperCase()}
            </Avatar>
            <Box>
              <Typography 
                variant="subtitle1" 
                fontWeight="bold" 
                color="#4a90e2"
                onClick={() => handleAuthorClick(blog.author)}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { 
                    textDecoration: 'underline',
                    color: '#66a3ff'
                  } 
                }}
              >
                {blog.author}
              </Typography>
              <Typography variant="caption" color="rgba(230,230,255,0.7)">
                {new Date(blog.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Blog Content */}
        <Box>
          <Typography 
            variant="h5" 
            fontWeight="bold" 
            mb={2}
            color="#ff9f43"
            sx={{
              lineHeight: 1.4,
              letterSpacing: '0.5px'
            }}
          >
            {blog.title}
          </Typography>

          <Typography 
            variant="body1" 
            color="rgba(230,230,255,0.9)"
            sx={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              mb: 3,
              lineHeight: 1.6,
              letterSpacing: '0.3px'
            }}
          >
            {blog.content}
          </Typography>

          <Button
            component={Link}
            to={`/blog/${blog._id}`}
            size="small"
            sx={{
              color: '#4a90e2',
              textTransform: 'none',
              ml: 2,
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'rgba(74,144,226,0.1)',
                color: '#66a3ff'
              }
            }}
          >
            View Full Post
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

const EnhancedBlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/blogs");
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <Box 
      sx={{
        background: 'linear-gradient(to bottom, #0f0f1a, #1a1a2e)',
        minHeight: '100vh',
        py: 6
      }}
    >
      <Container maxWidth="md">
        <Box mb={6}>
          <Typography 
            variant="h3" 
            color="#4a90e2" 
            fontWeight="bold" 
            textAlign="center"
            mb={3}
            sx={{
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              letterSpacing: '1px'
            }}
          >
            Latest Blogs
          </Typography>
        </Box>

        {blogs.map((blog) => (
          <BlogCard 
            key={blog._id} 
            blog={blog}
          />
        ))}

        {loading && (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress sx={{ color: '#4a90e2' }} />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default EnhancedBlogPage;
