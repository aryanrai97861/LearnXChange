import React from 'react';
import { Box, Button, Container, Grid, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledHero = styled('section')({
  padding: '4rem 0',
  background: '#f8f9fa',
});

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const Home = () => {
  return (
    <Box>
      <StyledHero>
        <Container>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="overline" color="primary">
                Very proud to introduce
              </Typography>
              <Typography variant="h2" component="h1" gutterBottom>
                Seamless Learning for Brighter Future
              </Typography>
              <Typography variant="body1" paragraph color="text.secondary">
                Our innovative platform offers an effortless and seamless approach to learning, 
                empowering youths of all ages to achieve a brighter future. Join us on a transformative 
                journey to unlock your true potential with the help of our experts.
              </Typography>
              <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                <Button variant="contained" color="primary" size="large">
                  Start now
                </Button>
                <Button variant="outlined" color="primary" size="large">
                  Take tour
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <img 
                src="/WhatsApp Image 2025-03-19 at 23.17.13_2fd7166e.jpg" 
                alt="Learning Illustration" 
                style={{ width: '100%', height: 'auto', borderRadius: '10px' }}
              />
            </Grid>
          </Grid>
        </Container>
      </StyledHero>

      <Box sx={{ py: 8 }}>
        <Container>
          <Typography variant="h3" component="h2" gutterBottom align="center">
            Our Competitive Advantage
          </Typography>
          <Typography variant="body1" paragraph align="center" sx={{ mb: 6 }}>
            We provide a great panel of analysts who are fully determined in providing 
            the quality knowledge to the learners and ensure that they will get best output from us.
          </Typography>

          <Grid container spacing={4}>
            {[
              {
                title: 'Personalized Learning',
                description: 'Offer tailored learning experiences through digital machines and techniques to cater to individual learner needs.',
                icon: '/WhatsApp Image 2025-03-19 at 23.38.31_30a86777.jpg'
              },
              {
                title: 'Affordability',
                description: 'Offer tailored learning experiences through digital machines and techniques to cater to individual learner needs.',
                icon: '/WhatsApp Image 2025-03-19 at 23.38.57_28b51154.jpg'
              },
              {
                title: 'Industry Partnerships',
                description: 'Offer tailored learning experiences through digital machines and techniques to cater to individual learner needs.',
                icon: '/WhatsApp Image 2025-03-19 at 23.40.11_0546a137.jpg'
              },
              {
                title: 'Innovative Technology',
                description: 'Offer tailored learning experiences through digital machines and techniques to cater to individual learner needs.',
                icon: '/WhatsApp Image 2025-03-19 at 23.42.02_59969a00.jpg'
              },
              {
                title: 'Responsive Support',
                description: 'Offer tailored learning experiences through digital machines and techniques to cater to individual learner needs.',
                icon: '/WhatsApp Image 2025-03-19 at 23.43.08_7dc35c39.jpg'
              },
              {
                title: 'Analytics and Insights',
                description: 'Offer tailored learning experiences through digital machines and techniques to cater to individual learner needs.',
                icon: '/graph.avif'
              }
            ].map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <FeatureCard elevation={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <img 
                      src={feature.icon} 
                      alt={feature.title} 
                      style={{ width: 50, height: 50, marginRight: 16 }}
                    />
                    <Typography variant="h6">{feature.title}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;