import React, { useState, useContext } from 'react';
import { Box, TextField, Button, Typography, IconButton, InputAdornment, Link, Grid, Alert, CircularProgress } from '@mui/material';
import { 
  MailOutline, 
  Visibility, 
  VisibilityOff, 
  Facebook, 
  Google, 
  Apple, 
  AccountCircle, 
  ArrowBack 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { MyUserContext } from '../context/MyUserProvider';

export const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { signUpUser, msg } = useContext(MyUserContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    
    // Az event.currentTarget az maga a <Box component="form"> elem
    const data = new FormData(event.currentTarget);
    
    try {
      const email = data.get('email');
      const displayName = data.get('displayName');
      const password = data.get('password');
      
      console.log("Regisztráció adatai:", { email, displayName, password });
      
      await signUpUser(email, displayName, password);
      // Itt opcionálisan navigálhatsz tovább siker esetén:
      // navigate('/login');
    } catch (error) {
      console.error("Hiba történt:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%', position: 'relative' }}>
      
      {/* Vissza gomb */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/")}
        sx={{
          position: 'absolute', top: 20, left: 20,
          color: 'text.secondary', textTransform: 'none', fontWeight: 'bold', zIndex: 10,
          '&:hover': { color: '#d58224ff' }
        }}
      >
        Vissza a főoldalra
      </Button>

      {/* Bal oldali űrlap */}
      <Box sx={{ 
        flex: 1, display: 'flex', flexDirection: 'column', 
        p: { xs: 4, md: 8 }, pt: { xs: 10, md: 8 },
        justifyContent: 'space-between' 
      }}>
        
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 30, height: 30, bgcolor: '#d58224ff', borderRadius: '5px', transform: 'rotate(45deg)' }} />
          <Typography variant="h4" fontWeight="bold" sx={{ fontSize: '1.8rem' }}>LakásLiget</Typography>
        </Box>

        {/* Regisztrációs felület */}
        <Box sx={{ maxWidth: 480, mx: 'auto', width: '100%', my: 4 }}>
          <Typography variant="body1" color="textSecondary" sx={{ fontSize: '1.1rem' }}>Kezdjen böngészni</Typography>
          <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ mb: 4, fontSize: '2.5rem' }}>
            Regisztráció
          </Typography>

          {/* Hibaüzenet megjelenítése a Context-ből */}
{msg && <Alert severity="error" sx={{ mb: 2 }}>
  {typeof msg === 'object' ? JSON.stringify(msg) : msg}
</Alert>}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            
            {/* Felhasználónév mező */}
            <Typography variant="body2" fontWeight="bold" sx={{ color: 'text.secondary', ml: 1, mb: 0.5 }}>Felhasználónév</Typography>
            <TextField
              fullWidth
              name="displayName" // Fontos a FormData-hoz!
              placeholder="pelda_felhasznalo"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <AccountCircle color="disabled" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2.5 }}
            />

            {/* E-mail mező */}
            <Typography variant="body2" fontWeight="bold" sx={{ color: 'text.secondary', ml: 1, mb: 0.5 }}>E-mail</Typography>
            <TextField
              fullWidth
              name="email" // Fontos a FormData-hoz!
              type="email"
              placeholder="pelda@email.com"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <MailOutline color="disabled" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2.5 }}
            />

            {/* Jelszó mező */}
            <Typography variant="body2" fontWeight="bold" sx={{ color: 'text.secondary', ml: 1, mb: 0.5 }}>Jelszó</Typography>
            <TextField
              fullWidth
              name="password" // Fontos a FormData-hoz!
              type={showPassword ? 'text' : 'password'}
              placeholder="********"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 4 }}
            />

            <Button
              fullWidth
              type="submit" // A handleSubmit az onSubmit-on keresztül hívódik meg
              variant="contained"
              disabled={loading}
              size="large"
              sx={{ 
                bgcolor: '#d58224ff', py: 1.8, textTransform: 'none', 
                fontSize: '1.2rem', borderRadius: '10px',
                '&:hover': { bgcolor: '#b86d1c' }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Regisztráció"}
            </Button>

            {/* Elválasztó és Social Gombok */}
            <Box sx={{ display: 'flex', alignItems: 'center', my: 4 }}>
              <Box sx={{ flex: 1, height: '1px', bgcolor: '#eee' }} />
              <Typography variant="body2" sx={{ mx: 2, color: 'text.secondary' }}>vagy</Typography>
              <Box sx={{ flex: 1, height: '1px', bgcolor: '#eee' }} />
            </Box>

            <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
              <Grid item xs={4}><Button fullWidth variant="outlined" sx={{ py: 1.5 }}><Facebook sx={{ color: '#1877F2' }} /></Button></Grid>
              <Grid item xs={4}><Button fullWidth variant="outlined" sx={{ py: 1.5 }}><Google /></Button></Grid>
              <Grid item xs={4}><Button fullWidth variant="outlined" sx={{ py: 1.5 }}><Apple /></Button></Grid>
            </Grid>
          </Box>
        </Box>

        <Typography variant="body1">
          Már van fiókja? <Link href="#" underline="none" fontWeight="bold" sx={{ color: '#d58224ff' }}>Bejelentkezés!</Link>
        </Typography>
      </Box>

      {/* Kép szekció */}
      <Box sx={{ 
        flex: 1, display: { xs: 'none', md: 'block' },
        backgroundImage: 'url(https://images.unsplash.com/photo-1719773745404-d2e57e1af9bf?auto=format&fit=crop&q=80)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        m: 1.5, borderRadius: '24px'
      }} />
    </Box>
  );
};