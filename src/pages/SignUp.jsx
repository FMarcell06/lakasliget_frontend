import React, { useState } from 'react';
import { Box, TextField, Button, Typography, IconButton, InputAdornment, Link, Grid } from '@mui/material';
import { MailOutline, Visibility, VisibilityOff, Facebook, Google, Apple } from '@mui/icons-material';

export const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      {/* Bal oldali űrlap */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        p: 8,
        justifyContent: 'space-between' 
      }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 30, height: 30, bgcolor: '#d58224ff', borderRadius: '5px', transform: 'rotate(45deg)' }} />
          <Typography variant="h4" fontWeight="bold" sx={{ fontSize: '1.8rem' }}>LakásLiget</Typography>
        </Box>

        {/* Középső tartalom */}
        <Box sx={{ maxWidth: 480, mx: 'auto', width: '100%' }}>
          <Typography variant="body1" color="textSecondary" sx={{ fontSize: '1.1rem' }}>Kezdjen böngészni</Typography>
          <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ mb: 5, fontSize: '2.5rem' }}>
            Regisztráció
          </Typography>

          <Box component="form" noValidate sx={{ mt: 2 }}>
            <Typography variant="body2" fontWeight="bold" sx={{ color: '#d58224ff', ml: 1, fontSize: '1rem' }}>E-mail</Typography>
            <TextField
              fullWidth
              placeholder="pelda@email.com"
              InputProps={{
                style: { fontSize: '1.2rem', padding: '4px' },
                endAdornment: (
                  <InputAdornment position="end">
                    <MailOutline color="disabled" sx={{ fontSize: 28 }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 4 }}
            />

            
            <Typography variant="body2" fontWeight="bold" sx={{ color: 'text.secondary', ml: 1, fontSize: '1rem' }}>Jelszó</Typography>
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              placeholder="********"
              InputProps={{
                style: { fontSize: '1.2rem', padding: '4px' },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff sx={{ fontSize: 28 }} /> : <Visibility sx={{ fontSize: 28 }} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 5 }}
            />
            

            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{ 
                bgcolor: '#d58224ff', 
                py: 2,
                textTransform: 'none', 
                fontSize: '1.25rem',
                borderRadius: '10px'
              }}
            >
              Regisztráció
            </Button>

            {/* Elválasztó */}
            <Box sx={{ display: 'flex', alignItems: 'center', my: 5 }}>
              <Box sx={{ flex: 1, height: '1px', bgcolor: '#eee' }} />
              <Typography variant="body2" sx={{ mx: 2, color: 'text.secondary', fontSize: '1rem' }}>vagy választhatja az alábbi lehetőségek egyikét</Typography>
              <Box sx={{ flex: 1, height: '1px', bgcolor: '#eee' }} />
            </Box>

            {/* Social Gombok */}
            <Grid container spacing={3} sx={{ justifyContent: 'center' }} >
              {[<Facebook sx={{color: '#1877F2', fontSize: 32}} />, <Google sx={{fontSize: 32}}/>, <Apple sx={{fontSize: 32}} />].map((icon, index) => (
                <Grid item xs={4} key={index}>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    sx={{ 
                      py: 2,
                      borderColor: '#eee', 
                      color: 'black',
                      '&:hover': { borderColor: '#ccc' }
                    }}
                  >
                    {icon}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>

        {/* Footer */}
        <Typography variant="body1" sx={{ textAlign: 'left', fontSize: '1.1rem' }}>
          Már van fiókja? <Link href="#" underline="none" fontWeight="bold">Bejelentkezés!</Link>
        </Typography>
      </Box>

      {/* Jobb oldali kép */}
      <Box sx={{ 
        flex: 1, 
        display: { xs: 'none', md: 'block' },
        backgroundImage: 'url(https://images.unsplash.com/photo-1719773745404-d2e57e1af9bf?auto=format&fit=crop&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        m: 1,
        borderRadius: '16px'
      }} />
    </Box>
  );
};