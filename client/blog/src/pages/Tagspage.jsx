import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Stack,
  Chip,
} from '@mui/material';
import Nav from '../components/navbar';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import BlogCard from '../components/blogcard';

const Tagspage = () => {
  const { tags } = useParams();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/tags/${tags}`).then((res) => setBlogs(res.data));
  }, [tags]);

  return (
    <>
      <Nav />
      <Container
        maxWidth={false}
        sx={{
          background: '#0f0f1a',
          color: '#fff',
          minHeight: '100vh',
          width: '100vw',
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" fontWeight="bold" color="#fff">
            Blogs in "{tags}" Category
          </Typography>
        </Box>
        <Grid
          container
          direction="column"
          spacing={4}
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ width: '100%', maxWidth: '800px' }}
        >
          {blogs.map((blog) => (
            <Grid item key={blog._id} sx={{ width: '100%', maxWidth: '800px' }}>
              <BlogCard blog={blog} currentUser={null} onDelete={() => {}} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default Tagspage;
