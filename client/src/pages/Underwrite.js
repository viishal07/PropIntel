import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  Divider,
  List,
  ListItem,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Tooltip,
} from '@mui/material';

const propertyTypes = [
  'Single Family',
  'Multifamily',
  'Office',
  'Retail',
  'Industrial',
  'Land',
];

const API_BASE = process.env.REACT_APP_API_BASE;

const Underwrite = () => {
  const location = useLocation();
  const [address, setAddress] = useState(location.state?.address || '');
  const [propertyType, setPropertyType] = useState(propertyTypes[0]);
  const [propertyInfo, setPropertyInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // Fetch property info from backend
  const fetchPropertyInfo = async (addr, type) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/property/info`, { address: addr, type });
      setPropertyInfo(res.data);
    } catch (err) {
      setPropertyInfo(null);
    }
    setLoading(false);
  };

  // Fetch history from backend
  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_BASE}/history`);
      setHistory(res.data);
    } catch (err) {
      setHistory([]);
    }
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address) return;
    setLoading(true);
    try {
      // First, fetch property info
      await fetchPropertyInfo(address, propertyType);
      // Then, underwrite (if needed)
      // const res = await axios.post(`${API_BASE}/property/underwrite`, { address, type: propertyType });
      // setPropertyInfo(res.data);
      fetchHistory();
    } catch (err) {
      setPropertyInfo(null);
    }
    setLoading(false);
  };

  // PDF download implementation
  const handleDownloadPDF = async () => {
    try {
      const res = await axios.post(
        `${API_BASE}/property/report`,
        { address },
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'underwriting-report.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert('Failed to download PDF');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        bgcolor: 'background.default',
        background: 'linear-gradient(135deg, #e0e7ff 0%, #f0f6ff 100%)',
      }}
    >
      {/* Stylish blue header with logo and title */}
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
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '70vh' }}>
        <Paper
          elevation={10}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 5,
            width: '100%',
            boxShadow: '0 8px 32px 0 rgba(30,58,138,0.10)',
            background: 'rgba(255,255,255,0.97)',
            backdropFilter: 'blur(2px)',
          }}
        >
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
            <TextField
              fullWidth
              label="Property Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              variant="outlined"
              sx={{ bgcolor: 'white', borderRadius: 2, flex: 2, minWidth: 200 }}
            />
            <Select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              sx={{ minWidth: 160, bgcolor: 'white', borderRadius: 2, flex: 1 }}
            >
              {propertyTypes.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
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
              Fetch Info
            </Button>
          </Box>
          {loading && <Typography color="primary">Loading property data...</Typography>}
          {propertyInfo && !loading && (
            <Box>
              <Box sx={{ display: 'flex', gap: 4, alignItems: 'center', mb: 3 }}>
                <Box sx={{ width: 120, height: 90, bgcolor: 'grey.200', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.secondary">Image</Typography>
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight="bold">{address}</Typography>
                  <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
                    Type: {propertyInfo.type} &nbsp;|&nbsp; Year Built: {propertyInfo.yearBuilt} &nbsp;|&nbsp; Sq. Ft.: {propertyInfo.sqFt} &nbsp;|&nbsp; Units: {propertyInfo.units} &nbsp;|&nbsp; Value: ${propertyInfo.value.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                <Box>
                  <Typography variant="h6" fontWeight="bold" color="primary">Financial Estimates</Typography>
                  <List>
                    <ListItem>Gross Rent: ${propertyInfo.grossRent.toLocaleString()}</ListItem>
                    <ListItem>Vacancy: {propertyInfo.vacancy}%</ListItem>
                    <ListItem>Operating Expenses: ${propertyInfo.expenses.toLocaleString()}</ListItem>
                    <ListItem>NOI: ${propertyInfo.noi.toLocaleString()}</ListItem>
                    <ListItem>Cap Rate: {propertyInfo.capRate}%</ListItem>
                    <ListItem>DSCR: {propertyInfo.dscr}</ListItem>
                  </List>
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="bold" color="primary">Demographics & Risk</Typography>
                  <List>
                    <ListItem>Crime Score: {propertyInfo.crimeScore}/10</ListItem>
                    <ListItem>Walk Score: {propertyInfo.walkScore}/100</ListItem>
                    <ListItem>Median Income: ${propertyInfo.medianIncome.toLocaleString()}</ListItem>
                    <ListItem>Population Density: {propertyInfo.populationDensity} /sq mi</ListItem>
                    <ListItem>School Rating: {propertyInfo.schoolRating}/10</ListItem>
                  </List>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography fontWeight="bold">Risk Level:</Typography>
                <Box
                  sx={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    bgcolor:
                      propertyInfo.dscr > 1.25
                        ? 'success.main'
                        : propertyInfo.dscr > 1.1
                        ? 'warning.main'
                        : 'error.main',
                  }}
                />
                <Typography>
                  {propertyInfo.dscr > 1.25 ? 'Low' : propertyInfo.dscr > 1.1 ? 'Medium' : 'High'}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                onClick={handleDownloadPDF}
                sx={{ mb: 2, fontWeight: 'bold', boxShadow: 2, borderRadius: 2, px: 3, transition: 'background 0.2s', '&:hover': { background: 'linear-gradient(90deg, #2563eb 60%, #60a5fa 100%)', color: 'white' } }}
              >
                Download PDF Report
              </Button>
            </Box>
          )}
          <Divider sx={{ my: 4 }} />
          <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
            Past Underwritings
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, background: 'rgba(240,246,255,0.7)' }}>
            {history.length === 0 ? (
              <Typography color="text.secondary">No history found.</Typography>
            ) : (
              <List>
                {history.map((item, idx) => (
                  <ListItem key={idx} divider>
                    <Box sx={{ flex: 1 }}>
                      <Typography fontWeight="bold">{item.address}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        {item.summary ? ` — ${item.summary}` : ''}
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Paper>
      </Container>
    </Box>
  );
};

export default Underwrite; 