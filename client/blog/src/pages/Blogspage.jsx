import React, { useState, useEffect } from "react";
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
  Stack,
  Divider,
  IconButton 
} from "@mui/material";
import axios from "axios";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const BlogCard = ({ blog, currentUser, onDelete }) => {
  const navigate = useNavigate();

  const handleAuthorClick = (username) => {
    if (currentUser && currentUser.username === username) {
      navigate('/profile');
    } else {
      navigate(`/user/${username}`); // Navigate to the user profile page with the username
    }
  };

  const handleEditClick = () => {
    navigate(`/edit-blog/${blog._id}`); // Navigate to the blog edit page
  };

  const handleDeleteClick = async () => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await axios.delete(`http://localhost:3000/api/blogs/${blog._id}`, {
          withCredentials: true,
        });
        onDelete(blog._id); // Call the onDelete function passed down to remove blog from UI
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }
  };

  return (
  <>
    <Card 
      component={Link}
      to={`/blog/${blog._id}`}
      sx={{
        backgroundColor: '#1a1a2e',
        color: '#e6e6ff', 
        borderRadius: 4,
        mb: 4,
        transition: 'all 0.3s ease-in-out',
        textDecoration: 'none',
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
              alt={blog.author}
              // src={blog}
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
                onClick={(e) => {
                  e.preventDefault();
                  handleAuthorClick(blog.author);
                }}
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
          
          {/* Edit and Delete Buttons */}
          {currentUser && currentUser.username === blog.author && (
            <Box display="flex" alignItems="center">
              <IconButton 
                onClick={(e) => {
                  e.preventDefault();
                  handleEditClick();
                }}
                sx={{ color: '#ff9f43', mr: 2 }}
              >
                <EditIcon />
              </IconButton>
              <IconButton 
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteClick(blog._id);
                }}
                sx={{ color: '#ff6b6b' }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </Box>

        {/* Blog Content */}
        <Box>
          <Box display="flex" alignItems="center" mb={2}>
            <Typography 
              variant="h5" 
              fontWeight="bold" 
              color="#ff9f43"
              sx={{
                lineHeight: 1.4,
                letterSpacing: '0.5px',
                flex: 1
              }}
            >
              {blog.title}
            </Typography>
          </Box>

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
            dangerouslySetInnerHTML={{
              __html: blog.content
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color: #4a90e2; text-decoration: none;">$1</a>')
            }}
          />

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1}>
              {blog.categories && blog.categories.map((category, index) => (
                <Chip
                  key={index}
                  label={category}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255,159,67,0.2)',
                    color: '#ff9f43',
                    fontWeight: 'bold'
                  }}
                />
              ))}
            </Stack>
  
              {blog.tags && blog.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/tags/${tag}`);
                  }}
                  sx={{
                    position:'absolute', 
                    backgroundColor: 'rgba(74,144,226,0.2)',
                    color: '#4a90e2',
                    fontWeight: 'bold',
                    borderRadius: '16px',
                    border: '1px solid rgba(74,144,226,0.3)',
                    m: 0.5,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(74,144,226,0.4)',
                      transform: 'scale(1.05)',
                      transition: 'all 0.2s ease-in-out'
                    }
                  }} 
                />
              ))}         
              
              
              
            
            <Typography
              variant="subtitle2"
              sx={{

                color: '#4a90e2',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              {blog.voteScore} votes
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
    <Divider sx={{ my: 3 }} orientation="horizontal" color="#4a90e2" />
  </>
)};
const EnhancedBlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

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
    setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== blogId));
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
      </Container>
    </Box>
  );
};

export default EnhancedBlogPage;
