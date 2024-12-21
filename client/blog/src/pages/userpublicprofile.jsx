import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Avatar } from '@mui/material';

const UserPublicProfile = () => {
  const { username } = useParams(); // Get username from URL
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/users/${username}`);
        setUser(response.data);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('User not found.');
      }
    };

    fetchUser();
  }, [username]);

  if (error) {
    return <Typography variant="h6" color="error" align="center">{error}</Typography>;
  }

  if (!user) {
    return <Typography variant="h6" align="center">Loading...</Typography>;
  }

  return (
    <Box sx={{ padding: '16px', maxWidth: '600px', margin: 'auto', textAlign: 'center' }}>
      <Avatar
        alt={user.name}
        src={user.picture}
        sx={{ width: 100, height: 100, margin: 'auto', mb: 2 }}
      />
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>{user.name}</Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>{user.username}</Typography>
      <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>{user.bio}</Typography>
    </Box>
  );
};

export default UserPublicProfile;
