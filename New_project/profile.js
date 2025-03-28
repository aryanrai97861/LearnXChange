import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Divider,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: 'primary.main',
                fontSize: '2.5rem',
              }}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 2 }}>
              Profile
            </Typography>
          </Box>
          <Divider sx={{ my: 3 }} />
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Username
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user?.username}
            </Typography>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Email
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile;