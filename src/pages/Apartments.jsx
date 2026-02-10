import React, { useState, useEffect, useContext } from 'react';
import { 
  Box, Grid, Typography, Container, CircularProgress, 
  TextField, FormControl, Select, MenuItem, Paper, Button, Divider, InputAdornment, 
  Slider
} from '@mui/material';
import { Search, HomeWork, Straighten, MeetingRoom, Payments, Tune } from '@mui/icons-material';

import { Header } from '../components/Header';
import { MyUserContext } from '../context/MyUserProvider';
import { ApartCard } from '../components/ApartCard';
import { readHomes } from '../myBackend';

export const Apartments = () => {
  const { user } = useContext(MyUserContext);
  const [homes, setHomes] = useState([]);
  const [filteredHomes, setFilteredHomes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    title: '',
    maxPrice: 1000000,
    minSize: '',
    rooms: '',
    type: ''
  });

  useEffect(() => {
    const unsubscribe = readHomes((data) => {
      setHomes(data);
      setFilteredHomes(data);
      setLoading(false);
    }, setLoading);
    return () => unsubscribe && typeof unsubscribe === 'function' && unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    const result = homes.filter(home => {
      return (
        home.name?.toLowerCase().includes(filters.title.toLowerCase()) &&
        (Number(home.price) <= filters.maxPrice) &&
        (filters.minSize === '' || Number(home.size) >= Number(filters.minSize)) &&
        (filters.rooms === '' || Number(home.rooms) === Number(filters.rooms)) &&
        (filters.type === '' || home.type === filters.type)
      );
    });
    setFilteredHomes(result);
  };

  return (
    <Box sx={{ bgcolor: '#F7F8F9', minHeight: '100vh', pb: 10 }}>
      <Header />
      
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Grid container spacing={3} alignItems="flex-start">
          
          {/* LEFT SIDE - FILTER */}
          <Grid item xs={12} md={3.5} sx={{ display: 'flex' }}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  borderRadius: '12px', 
                  border: '1px solid #E0E4E8',
                  bgcolor: 'white'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Tune sx={{ mr: 1, color: '#2D333A' }} />
                  <Typography variant="h6" fontWeight="700" color="#2D333A">Szűrés</Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  
                  <Box>
                    <Typography variant="subtitle2" fontWeight="700" sx={{ mb: 1 }}>Helyszín vagy név</Typography>
                    <TextField
                      fullWidth
                      name="title"
                      placeholder="Város, kerület..."
                      size="small"
                      value={filters.title}
                      onChange={handleChange}
                      sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#F9FAFB' } }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" fontWeight="700" sx={{ mb: 1 }}>
                      Havi bérleti díj: {filters.maxPrice.toLocaleString()} Ft
                    </Typography>
                    <Slider
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={(e, val) => setFilters(prev => ({...prev, maxPrice: val}))}
                      min={50000}
                      max={1500000}
                      step={10000}
                      sx={{ color: '#d58224ff' }}
                    />
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" fontWeight="700" sx={{ mb: 1 }}>Szobák</Typography>
                      <Select
                        fullWidth
                        name="rooms"
                        size="small"
                        value={filters.rooms}
                        onChange={handleChange}
                        displayEmpty
                      >
                        <MenuItem value="">Mind</MenuItem>
                        {[1, 2, 3, 4, 5].map(n => <MenuItem key={n} value={n}>{n}+</MenuItem>)}
                      </Select>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" fontWeight="700" sx={{ mb: 1 }}>Méret (m²)</Typography>
                      <TextField
                        fullWidth
                        name="minSize"
                        type="number"
                        size="small"
                        placeholder="Min."
                        value={filters.minSize}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>

                  <Box>
                    <Typography variant="subtitle2" fontWeight="700" sx={{ mb: 1 }}>Ingatlan típusa</Typography>
                    <Select
                      fullWidth
                      name="type"
                      size="small"
                      value={filters.type}
                      onChange={handleChange}
                      displayEmpty
                    >
                      <MenuItem value="">Összes típus</MenuItem>
                      <MenuItem value="Panel">Panel</MenuItem>
                      <MenuItem value="Tégla">Tégla</MenuItem>
                      <MenuItem value="Ház">Ház</MenuItem>
                    </Select>
                  </Box>

                  <Button 
                    fullWidth 
                    variant="contained" 
                    onClick={handleSearch}
                    sx={{ 
                      bgcolor: '#d58224ff', 
                      py: 1.5, 
                      borderRadius: '8px', 
                      fontWeight: 'bold',
                      textTransform: 'none',
                      boxShadow: 'none',
                      '&:hover': { bgcolor: '#b86d1c', boxShadow: 'none' }
                    }}
                  >
                    Találatok mutatása
                  </Button>
                </Box>
              </Paper>
            </Box>
          </Grid>

          {/* RIGHT SIDE - APARTMENT CARDS */}
          <Grid item xs={12} md={8.5} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" fontWeight="800" color="#2D333A">
                Kiadó lakások Budapesten
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Találtunk {filteredHomes.length} kiadó ingatlant az Ön részére
              </Typography>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress sx={{ color: '#d58224ff' }} />
              </Box>
            ) : (
              <Grid container spacing={3}>
                {filteredHomes.map((obj) => (
                  <Grid item key={obj.id} xs={12} sm={12} lg={6}>
                    <ApartCard apartment={obj} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
};