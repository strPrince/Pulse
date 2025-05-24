import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  Chip,
  Stack,
  Divider,
  IconButton
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import Verifypopup from "./Verifypopup";

//todo : improve the design of the blog card  

const BlogCard = ({ blog, currentUser, onDelete }) => {
  const navigate = useNavigate();
const[showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [blogToDelete, setBlogToDelete] = React.useState(null);
  const handleAuthorClick = (username) => {
    if (currentUser && currentUser.username === username) {
      navigate('/profile');
    } else {
      navigate(`/user/${username}`);
    }
  };

  const handleEditClick = () => {
    navigate(`/edit-blog/${blog._id}`);
  };

  const handleDeleteClick = async () => {
    setBlogToDelete(blog._id);
    setShowDeleteDialog(true);
  };
  const handleConfirmDelete = async (confirmed) => {
    setShowDeleteDialog(false);
    if (confirmed && blogToDelete) {
      onDelete(blogToDelete);
      try {
        await axios.delete(`http://localhost:3000/api/blogs/${blogToDelete}`, {
          withCredentials: true
        });
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }
  }

  return (
    <>
      <Card
        component={Link}
        to={`/blog/${blog._id}`}
        sx={{
          backgroundColor: '#1a1a2e',
          color: '#e6e6ff',
          borderRadius: 4,
          mb: 1,
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
                {showDeleteDialog && (
                  <Verifypopup
                    open={showDeleteDialog}
                    onClose={handleConfirmDelete}
                    message="Are you sure you want to delete this blog?"
                  />
                )}
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
                    position: 'absolute',
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
  );
};

export default BlogCard;
