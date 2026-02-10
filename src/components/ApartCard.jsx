import React from 'react';
import { 
  Card, CardMedia, CardContent, Typography, Box, 
  Chip, IconButton, Divider, Button 
} from '@mui/material';
import { 
  LocationOn, 
  Hotel, 
  SquareFoot, 
  FavoriteBorder, 
  Collections 
} from '@mui/icons-material';

export const ApartCard = ({ apartment }) => {
  // Destrukturálás, hogy tisztább legyen a kód
  const { 
    name, 
    price, 
    location, 
    rooms, 
    size, 
    category, 
    thumbnail, 
    images 
  } = apartment;

  return (
    <Card sx={{ 
      maxWidth: 360, 
      borderRadius: '20px', 
      boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
      overflow: 'hidden',
      transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
      '&:hover': { transform: 'scale(1.02)', boxShadow: '0 12px 30px rgba(0,0,0,0.12)' }
    }}>
      {/* Kép szekció */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="240"
          image={thumbnail?.url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80'}
          alt={name}
        />
        
        {/* Galéria badge */}
        {images?.length > 0 && (
          <Chip
            icon={<Collections sx={{ fontSize: '14px !important', color: 'white !important' }} />}
            label={`${images.length} fotó`}
            sx={{
              position: 'absolute', top: 15, right: 15,
              bgcolor: 'rgba(0,0,0,0.5)', color: 'white',
              backdropFilter: 'blur(8px)', fontSize: '0.75rem'
            }}
          />
        )}

        {/* Kategória (pl. Eladó / Kiadó) */}
        <Chip
          label={category || "Kiadó"}
          sx={{
            position: 'absolute', top: 15, left: 15,
            bgcolor: '#d58224ff', color: 'white',
            fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.7rem'
          }}
        />

        <IconButton 
          sx={{ 
            position: 'absolute', bottom: -20, right: 20, 
            bgcolor: 'white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            '&:hover': { bgcolor: '#f5f5f5' } 
          }}
        >
          <FavoriteBorder sx={{ color: '#d58224ff' }} />
        </IconButton>
      </Box>

      {/* Tartalom szekció */}
      <CardContent sx={{ p: 3, pt: 4 }}>
        <Typography variant="h5" fontWeight="800" color="#d58224ff" sx={{ mb: 1 }}>
          {price?.toLocaleString()} Ft <Typography component="span" variant="body2" color="text.secondary">/ hó</Typography>
        </Typography>

        <Typography variant="h6" sx={{ fontSize: '1.2rem', fontWeight: 700, mb: 1, height: '1.6em', overflow: 'hidden' }}>
          {name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5, color: 'text.secondary' }}>
          <LocationOn sx={{ fontSize: 18, mr: 0.5, color: '#d58224ff' }} />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>{location || "Budapest"}</Typography>
        </Box>

        <Divider sx={{ mb: 2.5, opacity: 0.6 }} />

        {/* Paraméterek */}
        <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Hotel sx={{ color: 'action.active', fontSize: 20 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{rooms || 1} szoba</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SquareFoot sx={{ color: 'action.active', fontSize: 20 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{size || 0} m²</Typography>
          </Box>
        </Box>

        <Button 
          fullWidth 
          variant="contained" 
          disableElevation
          sx={{ 
            bgcolor: '#d58224ff', 
            py: 1.5,
            borderRadius: '12px',
            textTransform: 'none', 
            fontWeight: 'bold',
            fontSize: '1rem',
            '&:hover': { bgcolor: '#b86d1c' }
          }}
        >
          Megtekintem
        </Button>
      </CardContent>
    </Card>
  );
};