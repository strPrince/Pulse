import React, { useState, useEffect, useCallback } from "react";
import { Link } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Chip, 
  Avatar,
  Container,
  Stack
} from "@mui/material";
import { 
  BookmarkAdd, 
  Share, 
  RemoveRedEye, 
  ChatBubbleOutline 
} from '@mui/icons-material';
import axios from "axios";

const BlogCard = ({ blog, onUserClick }) => {
  const [expanded, setExpanded] = useState(false);

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
                bgcolor: '#ff6b6b', // Changed author avatar background color
                boxShadow: '0 4px 8px rgba(255,107,107,0.3)' // Updated shadow to match new color
              }}
            >
              {blog.author[0].toUpperCase()}
            </Avatar>
            <Box>
              <Typography 
                variant="subtitle1" 
                fontWeight="bold" 
                color="#4a90e2"
                onClick={() => onUserClick(blog.author)}
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
            color="#ff9f43" // Changed blog title color
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
              WebkitLineClamp: expanded ? 'unset' : 3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              mb: 3,
              lineHeight: 1.6,
              letterSpacing: '0.3px'
            }}
          >
            {expanded ? blog.content : blog.content.slice(0, 200)}
            {!expanded && blog.content.length > 200 && '...'}
          </Typography>

          {blog.content.length > 200 && (
            <Button 
              size="small" 
              onClick={() => setExpanded(!expanded)}
              sx={{ 
                color: '#4a90e2',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': { 
                  backgroundColor: 'rgba(74,144,226,0.1)',
                  color: '#66a3ff'
                } 
              }}
            >
              {expanded ? 'Show Less' : 'Read More'}
            </Button>
          )}

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

        {/* Blog Footer */}
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          mt={3}
        >
          {/* Tags */}
          <Stack direction="row" spacing={1.5}>
            {blog.tags && blog.tags.map((tag, index) => (
              <Chip 
                key={index} 
                label={tag} 
                size="small" 
                sx={{ 
                  backgroundColor: 'rgba(74,144,226,0.15)', 
                  color: '#4a90e2',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: 'rgba(74,144,226,0.25)'
                  }
                }} 
              />
            ))}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

const EnhancedBlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchBlogs = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/blogs", {
        params: {
          limit: 10,
          page: page
        }
      });

      setBlogs(prevBlogs => 
        page === 1 ? response.data : [...prevBlogs, ...response.data]
      );
      
      setHasMore(response.data.length === 10);
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100 &&
      hasMore
    ) {
      fetchBlogs();
    }
  }, [hasMore]);

  useEffect(() => {
    fetchBlogs();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleUserClick = async (username) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/user/profile/${username}`);
      console.log('User data:', response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  return (
    <Box 
      sx={{
        background: 'linear-gradient(to bottom, #0f0f1a, #1a1a2e)',
        minHeight: '100vh',
        py: 6
      }}
    >
      <Container maxWidth="md">
        {/* Page Header */}
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
          <Typography 
            variant="h6" 
            color="rgba(230,230,255,0.9)" 
            textAlign="center"
            sx={{
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.6
            }}
          >
            Discover insights, stories, and perspectives from our community
          </Typography>
        </Box>

        {/* Blog List */}
        {blogs.map((blog) => (
          <BlogCard 
            key={blog._id} 
            blog={blog} 
            onUserClick={handleUserClick} 
          />
        ))}

        {/* Loading Indicator */}
        {loading && (
          <Box 
            display="flex" 
            justifyContent="center" 
            mt={4}
          >
            <CircularProgress sx={{ color: '#4a90e2' }} />
          </Box>
        )}

        {/* End of Blogs */}
        {!hasMore && blogs.length > 0 && (
          <Typography 
            textAlign="center" 
            color="rgba(230,230,255,0.7)"
            mt={4}
          >
            No more blogs to load
          </Typography>
        )}
      </Container>
    </Box>
  );
};

export default EnhancedBlogPage;
