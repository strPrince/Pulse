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
              <Link to={`/blog/${blog._id}`} style={{ textDecoration: 'none' }}>
                <Card
                  sx={{
                    width: '100%',
                    maxWidth: '800px',
                    background: '#1a1a2e',
                    color: '#e6e6ff',
                    borderRadius: 4,
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                    },
                  }}
                >
                  <CardContent>
                    {/* Blog Header */}
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ bgcolor: '#ff6b6b', mr: 2 }}>{blog.author[0]}</Avatar>
                        <Box>
                          <Typography variant="subtitle1" color="#4a90e2" fontWeight="bold">
                            {blog.author}
                          </Typography>
                          <Typography variant="caption">
                            {new Date(blog.createdAt).toDateString()}
                          </Typography>
                        </Box>
                      </Box>
                      <Box>
                        <IconButton sx={{ color: '#FFA500' }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton sx={{ color: '#ff6b6b' }}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
    
                    {/* Blog Content */}
                    <Box my={2}>
                      <Typography variant="h5" fontWeight="bold" color="#FFA500">
                        {blog.title}
                      </Typography>
                      <Typography variant="body2" color="#e6e6ff">
                        {blog.content.slice(0, 100)}...
                      </Typography>
                    </Box>
    
                    {/* Tags */}
                    <Stack direction="row" spacing={1}>
                      {blog.tags.map((tag, idx) => (
                        <Chip
                          key={idx}
                          label={tag}
                          sx={{
                            background: 'rgba(74,144,226,0.2)',
                            color: '#4a90e2',
                            fontWeight: 'bold',
                          }}
                        />
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );}
  

export default Tagspage;
