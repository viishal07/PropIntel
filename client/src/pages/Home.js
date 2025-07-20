import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, TextField, Typography, Paper, Tooltip, List, ListItem, Grid, Card, CardContent } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PeopleIcon from '@mui/icons-material/People';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const PROJECT_EMAIL = 'propintelai@example.com'; // Replace with your real project email
const PHONE_NUMBER = '+91-9876543210'; // Replace with your real phone number

const Home = () => {
  const [address, setAddress] = useState('');
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('address', address);
    files.forEach((file) => formData.append('files', file));
    try {
      await axios.post(`${API_BASE}/property/underwrite`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (err) {}
    navigate('/underwrite', { state: { address } });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        bgcolor: 'background.default',
        background: 'linear-gradient(135deg, #e0e7ff 0%, #f0f6ff 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Stylish blue navbar/banner with gradient and shadow */}
      <Box
        sx={{
          width: '100%',
          background: 'linear-gradient(90deg, #1e3a8a 60%, #60a5fa 100%)',
          py: { xs: 3, md: 4 },
          px: 2,
          boxShadow: 4,
          mb: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Tooltip title="PropIntel AI – Property Intelligent Real Estate Underwriting Platform" arrow>
          <Typography
            variant="h4"
            color="white"
            fontWeight="bold"
            sx={{
              fontSize: { xs: '0.8rem', sm: '1.1rem', md: '1.5rem', lg: '1.7rem', xl: '2rem' },
              letterSpacing: 1,
              lineHeight: 1.1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              ml: 0,
              maxWidth: { xs: '60vw', sm: '70vw', md: '80vw', lg: '85vw' },
              textAlign: 'center',
            }}
          >
            PropIntel AI – Property Intelligent Real Estate Underwriting Platform
          </Typography>
        </Tooltip>
      </Box>
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <Paper
          elevation={10}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 5,
            width: '100%',
            boxShadow: '0 8px 32px 0 rgba(30,58,138,0.10)',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(2px)',
          }}
        >
          <Typography
            variant="h5"
            color="primary"
            fontWeight="bold"
            gutterBottom
            align="center"
            sx={{ mb: 2, letterSpacing: 0.5 }}
          >
            Instantly underwrite any property with AI-powered insights
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Enter Property Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              variant="outlined"
              sx={{ bgcolor: 'white', borderRadius: 2 }}
            />
            <Button
              variant="outlined"
              component="label"
              sx={{ alignSelf: 'flex-start' }}
            >
              Upload Property Files
              <input
                type="file"
                multiple
                hidden
                onChange={handleFileChange}
              />
            </Button>
            {files.length > 0 && (
              <List dense>
                {files.map((file, idx) => (
                  <ListItem key={idx} sx={{ fontSize: 14 }}>
                    {file.name}
                  </ListItem>
                ))}
              </List>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{
                px: 4,
                fontWeight: 'bold',
                boxShadow: 3,
                transition: 'background 0.2s',
                '&:hover': {
                  background: 'linear-gradient(90deg, #2563eb 60%, #60a5fa 100%)',
                },
              }}
            >
              UNDERWRITE NOW
            </Button>
          </Box>
        </Paper>
      </Container>
      {/* Feature Highlights Section */}
      <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
        <Grid container spacing={4} wrap="nowrap" sx={{ overflowX: 'auto', flexWrap: 'nowrap' }}>
          <Grid item xs={12} md={4} sx={{ minWidth: 300 }}>
            <Card sx={{ bgcolor: 'rgba(30,58,138,0.1)', borderRadius: 4, boxShadow: 0, p: 2, textAlign: 'center', height: '100%' }}>
              <CardContent>
                <TrendingUpIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
                <Typography variant="h6" fontWeight="bold" color="success.main" gutterBottom>100x Faster</Typography>
                <Typography variant="body2" color="text.secondary">
                  Transform hours of manual work into 30-second analyses
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4} sx={{ minWidth: 300 }}>
            <Card sx={{ bgcolor: 'rgba(30,58,138,0.1)', borderRadius: 4, boxShadow: 0, p: 2, textAlign: 'center', height: '100%' }}>
              <CardContent>
                <SmartToyIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>AI-Driven Insights</Typography>
                <Typography variant="body2" color="text.secondary">
                  AI analyzes property data for smarter decisions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4} sx={{ minWidth: 300 }}>
            <Card sx={{ bgcolor: 'rgba(30,58,138,0.1)', borderRadius: 4, boxShadow: 0, p: 2, textAlign: 'center', height: '100%' }}>
              <CardContent>
                <PeopleIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 1 }} />
                <Typography variant="h6" fontWeight="bold" color="secondary.main" gutterBottom>Accessible to All</Typography>
                <Typography variant="body2" color="text.secondary">
                  Professional-grade tools for every investor
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      {/* Footer */}
      <Box
        component="footer"
        sx={{
          width: '100%',
          background: 'linear-gradient(90deg, #1e3a8a 60%, #60a5fa 100%)',
          py: 3,
          px: 2,
          mt: 'auto',
          boxShadow: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <EmailIcon sx={{ color: 'white', fontSize: 22 }} />
          <Typography color="white" sx={{ fontSize: 16 }}>
            {PROJECT_EMAIL}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <PhoneIcon sx={{ color: 'white', fontSize: 22 }} />
          <Typography color="white" sx={{ fontSize: 16 }}>
            {PHONE_NUMBER}
          </Typography>
        </Box>
        <Typography color="white" sx={{ fontSize: 13, mt: 1, opacity: 0.7 }}>
          &copy; {new Date().getFullYear()} PropIntel AI. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;