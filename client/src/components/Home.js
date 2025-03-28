import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';

function Home() {
  const [serverStatus, setServerStatus] = useState('Checking...');

  useEffect(() => {
    // Test backend connection
    fetch('http://localhost:5000/api/test')
      .then(response => response.json())
      .then(data => {
        setServerStatus(`Backend: ${data.message}, Database: ${data.dbStatus}`);
      })
      .catch(error => {
        setServerStatus('Error connecting to backend');
        console.error('Error:', error);
      });
  }, []);

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to LearnXchange
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Your Learning Journey Starts Here
        </Typography>
        <Typography color="text.secondary" paragraph>
          Connect, Learn, and Grow with our community of learners
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button variant="contained" color="primary" sx={{ mr: 2 }}>
            Get Started
          </Button>
          <Button variant="outlined" color="primary">
            Learn More
          </Button>
        </Box>
        <Typography variant="body2" sx={{ mt: 4 }} color="text.secondary">
          Server Status: {serverStatus}
        </Typography>
      </Box>
    </Container>
  );
}

export default Home; 