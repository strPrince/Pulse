import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Avatar, Card, CardContent, Button } from "@mui/material";

const BlogCard = ({ blog, currentUser, onDelete }) => {
  return (
    <Card
      sx={{
        backgroundColor: '#1a1a2e',
        color: '#e6e6ff',
        borderRadius: '16px',
        mb: 4,
        transition: 'all 0.3s ease-in-out',
        boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 16px 32px rgba(0,0,0,0.6)',
        },
      }}
    >
      <CardContent>
        {/* Author and Date */}
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: '#ff6b6b',
              boxShadow: '0 4px 8px rgba(255,107,107,0.4)',
              mr: 2,
            }}
          >
            {blog.author[0].toUpperCase()}
          </Avatar>
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              color="#66a3ff"
              sx={{
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {blog.author}
            </Typography>
            <Typography variant="caption" color="rgba(230,230,255,0.7)">
              {new Date(blog.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>

        {/* Blog Title */}
        <Typography
          variant="h6"
          fontWeight="bold"
          color="#ff9f43"
          sx={{
            mb: 1,
            lineHeight: 1.4,
          }}
        >
          {blog.title}
        </Typography>

        {/* Blog Description */}
        <Typography
          variant="body2"
          color="rgba(230,230,255,0.9)"
          sx={{
            mb: 2,
            lineHeight: 1.6,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
          }}
        >
          {blog.content}
        </Typography>

        {/* Read More Button */}
        <Button
          component={Link}
          to={`/blog/${blog._id}`}
          size="medium"
          sx={{
            backgroundColor: '#4a90e2',
            color: '#fff',
            textTransform: 'none',
            fontWeight: 500,
            px: 3,
            py: 1,
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: '#66a3ff',
              boxShadow: '0 4px 12px rgba(102,163,255,0.5)',
            },
          }}
        >
          Read More
        </Button>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
