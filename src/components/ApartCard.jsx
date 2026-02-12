import React from 'react';
import { 
  FavoriteBorder, 
  CameraAltOutlined 
} from '@mui/icons-material';
import './ApartCard.css';

export const ApartCard = ({ apartment }) => {
  const { name, price, location, rooms, size, thumbnail, images, category } = apartment;

  return (
    <div className="ingatlan-card">
      {/* Bal oldali kép szekció */}
      <div className="card-image-wrapper">
        <img 
          src={thumbnail?.url || 'https://via.placeholder.com/300x200'} 
          alt={name} 
          className="main-image"
        />
        {category === 'Új építésű' && <div className="badge-new">Új építésű</div>}
        <div className="image-count">
          <CameraAltOutlined className="cam-icon" />
          <span>{images?.length || 0}</span>
        </div>
      </div>

      {/* Jobb oldali tartalom */}
      <div className="card-info">
        <div className="card-header">
          <div className="price-box">
            <span className="price-value">{price?.toLocaleString()} Ft/hó</span>
          </div>
          <button className="fav-button">
            <FavoriteBorder />
          </button>
        </div>

        <div className="address-box">
          <p className="address-text">{location}, {name}</p>
        </div>

        <div className="details-row">
          <div className="detail-item">
            <span className="detail-label">Alapterület</span>
            <span className="detail-value">{size} m²</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Szobák</span>
            <span className="detail-value">{rooms}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Erkély</span>
            <span className="detail-value">--</span> {/* Vagy ha van adat: {balcony} m² */}
          </div>
        </div>

        <div className="card-footer">
          <div className="agency-logo">K</div> {/* Ide jöhetne a logó */}
        </div>
      </div>
    </div>
  );
};