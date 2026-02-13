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
        {/* Galéria rész */}
        <div className="listing-gallery" onClick={() => setIsModalOpen(true)}>
          <div className="main-img-box clickable">
            <img 
              src={gallery[currentIndex]?.url} 
              alt={apartment.title} 
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

        {/* Összegző sáv */}
        <div className="listing-summary-bar">
          <div className="summary-item">
            <span className="summary-label">Havi bérleti díj</span>
            <span className="summary-value highlight">{price.toLocaleString()} Ft</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Alapterület</span>
            <span className="summary-value">{apartment.area} m²</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Szobák száma</span>
            <span className="summary-value">{apartment.rooms}</span>
          </div>
        </div>

        {/* Kaució kalkulátor */}
        <div className="calc-card">
          <h3>Szerződéskötéskor esedékes költségek</h3>
          <div className="calc-flex">
            <div className="calc-block">
              <span className="calc-label">2 havi kaució</span>
              <span className="calc-price">{(price * 2).toLocaleString()} Ft</span>
            </div>
            <div className="calc-operator">+</div>
            <div className="calc-block">
              <span className="calc-label">Első havi lakbér</span>
              <span className="calc-price">{price.toLocaleString()} Ft</span>
            </div>
            <div className="calc-operator">=</div>
            <div className="calc-block highlight-block">
              <span className="calc-label">Összesen fizetendő</span>
              <span className="calc-price">{(price * 3).toLocaleString()} Ft</span>
            </div>
          </div>
        </div>

        {/* Részletes adatok - MINDEN MEZŐVEL */}
        <div className="details-section">
          <h2>Részletes paraméterek</h2>
          <div className="details-card">
            <div className="details-grid">
              
              {/* 1. oszlop: Épület adatai */}
              <div className="details-column">
                <div className="detail-row">
                  <span className="d-label">Ingatlan típusa</span>
                  <span className="d-value">{apartment.category}</span>
                </div>
                <div className="detail-row">
                  <span className="d-label">Építés éve</span>
                  <span className="d-value">{apartment.buildYear}</span>
                </div>
                <div className="detail-row">
                  <span className="d-label">Emelet</span>
                  <span className="d-value">{apartment.floor}</span>
                </div>
                <div className="detail-row">
                  <span className="d-label">Épület szintjei</span>
                  <span className="d-value">{apartment.buildingLevels}</span>
                </div>
                <div className="detail-row">
                  <span className="d-label">Belmagasság</span>
                  <span className="d-value">{apartment.ceilingHeight}</span>
                </div>
                <div className="detail-row">
                  <span className="d-label">Lift</span>
                  <span className="d-value">{apartment.lift}</span>
                </div>
                <div className="detail-row">
                  <span className="d-label">Energetikai tanúsítvány</span>
                  <span className="d-value">{apartment.energyCert}</span>
                </div>
              </div>

              {/* 2. oszlop: Műszaki és kényelmi extrák */}
              <div className="details-column">
                <div className="detail-row">
                  <span className="d-label">Fűtés típusa</span>
                  <span className="d-value">{apartment.heating}</span>
                </div>
                <div className="detail-row">
                  <span className="d-label">Légkondicionáló</span>
                  <span className="d-value">{apartment.airConditioner}</span>
                </div>
                <div className="detail-row">
                  <span className="d-label">Szigetelés</span>
                  <span className="d-value">{apartment.insulation}</span>
                </div>
                <div className="detail-row">
                  <span className="d-label">Bútorozott</span>
                  <span className="d-value">{apartment.furnished}</span>
                </div>
                <div className="detail-row">
                  <span className="d-label">Gépesített/Equipped</span>
                  <span className="d-value">{apartment.equipped}</span>
                </div>
                <div className="detail-row">
                  <span className="d-label">Fürdő és WC</span>
                  <span className="d-value">{apartment.bathroomWc}</span>
                </div>
                <div className="detail-row">
                  <span className="d-label">Akadálymentesített</span>
                  <span className="d-value">{apartment.accessible}</span>
                </div>
              </div>

              {/* 3. oszlop: Elhelyezkedés és Szabályok */}
              <div className="details-column">
                <div className="detail-row">
                  <span className="d-label">Kilátás</span>
                  <span className="d-value">{apartment.view}</span>
                </div>
                <div className="detail-row">
                  <span className="d-label">Tájolás</span>
                  <span className="d-value">{apartment.orientation}</span>
                </div>
                <div className="detail-row">
                  <span className="d-label">Erkély mérete</span>
                  <span className="d-value">{apartment.balconySize ? `${apartment.balconySize} m²` : 'Nincs'}</span>
                </div>
                <div className="detail-row">
                  <span className="d-label">Kisállat hozható</span>
                  <span className="d-value">{apartment.pets}</span>
                </div>
                <div className="detail-row">
                  <span className="d-label">Dohányzás</span>
                  <span className="d-value">{apartment.smoking}</span>
                </div>
                <div className="detail-row">
                  <span className="d-label">Min. bérleti idő</span>
                  <span className="d-value">{apartment.minRentTime}</span>
                </div>
                <div className="detail-row">
                  <span className="d-label">Költözhető</span>
                  <span className="d-value">{apartment.moveInDate}</span>
                </div>
              </div>

            </div>
          </div>
          <div className="description-container">
            <h2>Hirdetés leírása</h2>
            <div className="description-card">
              <div className="description-content">
                {/* A fehér szóközöket és újsorokat megtartjuk a leírásban */}
                <p style={{ whiteSpace: 'pre-wrap' }}>
                  {apartment.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal / Fullscreen Galéria */}
      {isModalOpen && (
        <div className="image-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <button className="modal-close" onClick={() => setIsModalOpen(false)}><Close /></button>
          <button className="modal-fixed-arrow left" onClick={prevImg}><ArrowBackIosNew /></button>
          <button className="modal-fixed-arrow right" onClick={nextImg}><ArrowForwardIos /></button>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={gallery[currentIndex]?.url} alt="Ingatlan nagyítva" className="modal-image" />
            <div className="modal-counter">{currentIndex + 1} / {gallery.length}</div>
          </div>
        </div>
      )}
    </div>
  );
};