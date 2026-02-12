import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { 
  ArrowBackIosNew, 
  ArrowForwardIos, 
  Close, 
  Fullscreen,
  InfoOutlined 
} from '@mui/icons-material';
import { readHome } from '../myBackend';
import './Listing.css';

export const Listing = () => {
  const { id } = useParams();
  const [apartment, setApartment] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    readHome(id, (data) => {
      if (data) {
        setApartment(data);
        const combined = [];
        if (data.thumbnail) combined.push(data.thumbnail);
        if (data.images && Array.isArray(data.images)) {
          combined.push(...data.images);
        }
        setGallery(combined);
      }
      setLoading(false);
    });
  }, [id]);

  const nextImg = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % gallery.length);
  };

  const prevImg = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  if (loading) return <div className="listing-loader">Adatok betöltése...</div>;
  if (!apartment || gallery.length === 0) return <div className="listing-loader">Ingatlan nem található.</div>;

  const price = Number(apartment.price) || 0;

  return (
    <div className="listing-page">
      <Header />
      
      <main className="listing-container">
        <div className="listing-gallery" onClick={() => setIsModalOpen(true)}>
          <div className="main-img-box clickable">
            <img 
              src={gallery[currentIndex]?.url} 
              alt="Ingatlan" 
              className="fade-in" 
              key={currentIndex}
            />
            {gallery.length > 1 && (
              <>
                <button className="nav-arrow left" onClick={prevImg}><ArrowBackIosNew /></button>
                <button className="nav-arrow right" onClick={nextImg}><ArrowForwardIos /></button>
                <div className="img-counter">
                  {currentIndex === 0 ? "Borítókép" : `${currentIndex + 1} / ${gallery.length}`}
                </div>
              </>
            )}
            <div className="fullscreen-hint">
              <Fullscreen /> Kattints a nagyításhoz
            </div>
          </div>
        </div>

        <div className="listing-summary-bar">
          <div className="summary-item">
            <span className="summary-label">Ár havonta</span>
            <span className="summary-value highlight">{price.toLocaleString()} Ft</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Alapterület</span>
            <span className="summary-value">{apartment.size} m²</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Szobák</span>
            <span className="summary-value">{apartment.rooms}</span>
          </div>
        </div>

        <div className="calc-card">
          <h3>Kibérelnéd, de nincs elegendő pénzed? Segítünk!</h3>
          <div className="calc-flex">
            <div className="calc-block">
              <span className="calc-label">2 havi kaució <InfoOutlined className="mini-info" /></span>
              <span className="calc-price">{(price * 2).toLocaleString()} Ft</span>
            </div>
            <div className="calc-operator">+</div>
            <div className="calc-block">
              <span className="calc-label">Első havi lakbér</span>
              <span className="calc-price">{price.toLocaleString()} Ft</span>
            </div>
            <div className="calc-operator">=</div>
            <div className="calc-block highlight-block">
              <span className="calc-label">Szerződéskor fizetendő <InfoOutlined className="mini-info" /></span>
              <span className="calc-price">{(price * 3).toLocaleString()} Ft</span>
            </div>
          </div>
          <p className="calc-info">Hitel akár 1 nap alatt a kezdeti költségekre. Mérd fel hitelképességed online!</p>
          <button className="calc-button">Megkaphatom a hitelt?</button>
        </div>

<div className="details-section">
  <h2>Ingatlan adatai</h2>
  <div className="details-card">
    <div className="details-grid">
      {/* Első oszlop */}
      <div className="details-column">
        <div className="detail-row">
          <span className="d-label">Ingatlan állapota</span>
          <span className="d-value">{apartment.condition || 'felújított'}</span>
        </div>
        <div className="detail-row">
          <span className="d-label">Emelet</span>
          <span className="d-value">{apartment.floor || '-'}</span>
        </div>
        <div className="detail-row">
          <span className="d-label">Építés éve</span>
          <span className="d-value">{apartment.year || '2000 után'}</span>
        </div>
        <div className="detail-row">
          <span className="d-label">Belmagasság</span>
          <span className="d-value">{apartment.height || '3m alatt'}</span>
        </div>
      </div>

      {/* Második oszlop */}
      <div className="details-column">
        <div className="detail-row">
          <span className="d-label">Komfort</span>
          <span className="d-value">{apartment.comfort || 'duplakomfortos'}</span>
        </div>
        <div className="detail-row">
          <span className="d-label">Tájolás</span>
          <span className="d-value">{apartment.orientation || 'dél'}</span>
        </div>
        <div className="detail-row">
          <span className="d-label">Kilátás</span>
          <span className="d-value">{apartment.view || 'panorámás'}</span>
        </div>
        <div className="detail-row">
          <span className="d-label">Akadálymentesített</span>
          <span className="d-value">{apartment.accessible ? 'igen' : 'nem'}</span>
        </div>
      </div>
    </div>
  </div>
</div>
      </main>

      {isModalOpen && (
        <div className="image-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <button className="modal-close" onClick={() => setIsModalOpen(false)}><Close /></button>
          
          {/* Fixált nyilak a képernyő szélén */}
          <button className="modal-fixed-arrow left" onClick={prevImg}><ArrowBackIosNew /></button>
          <button className="modal-fixed-arrow right" onClick={nextImg}><ArrowForwardIos /></button>

          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={gallery[currentIndex]?.url} alt="Nagyított" className="modal-image" />
            <div className="modal-counter">{currentIndex + 1} / {gallery.length}</div>
          </div>
        </div>
      )}
    </div>
  );
};