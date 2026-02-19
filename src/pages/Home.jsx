import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import './Home.css';

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper no-scroll">
      <Header />
      
      <main className="hero-65">
        <div className="hero-content">
          <div className="logo-container">
            <div className="logo-icon" />
            <h1 className="logo-text">Lakás Liget</h1>
          </div>
          <p className="hero-subtitle">Prémium ingatlanok, egyszerűen.</p>
          
          <button className="main-cta-btn" onClick={() => navigate('/listings')}>
            Összes hirdetés
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </main>

      <section className="featured-35">
        <div className="compact-grid">
          {[1, 2, 3].map((item) => (
            <div key={item} className="mini-card-v2">
              <div className="card-img-top" style={{backgroundImage: `url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=400')`}}>
                <div className="mini-tag">Kiemelt</div>
              </div>
              <div className="card-body-bottom">
                <h3>Liget Rezidencia</h3>
                <p className="mini-price">320.000 Ft / hó</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};