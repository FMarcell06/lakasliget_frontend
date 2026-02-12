import React from 'react';
import { Header } from '../components/Header';
import './Home.css';

export const Home = () => {
  return (
    <div className="page-wrapper">
      <Header />
      
      <main className="hero-center">
        <div className="hero-content">
          <h1>Lakás Liget</h1>
          <p>Prémium kiadó ingatlanok közvetlenül a tulajdonostól.</p>
        </div>

        <div className="search-card">
          <div className="search-grid">
            {/* Ingatlan típusa */}
            <div className="input-field">
              <label>Ingatlan típusa</label>
              <select defaultValue="lakás">
                <option value="lakás">Lakás</option>
                <option value="haz">Családi ház</option>
                <option value="telek">Telek</option>
                <option value="iroda">Iroda</option>
              </select>
            </div>

            {/* Helyszín */}
            <div className="input-field">
              <label>Hol keresel?</label>
              <input type="text" placeholder="Város, kerület..." />
            </div>

            {/* Ár */}
            <div className="input-field">
              <label>Max. ár (Ft)</label>
              <input type="number" placeholder="0" />
            </div>

            {/* Méret */}
            <div className="input-field">
              <label>Méret (m²)</label>
              <input type="number" placeholder="min." />
            </div>

            {/* Szobák */}
            <div className="input-field">
              <label>Szobák</label>
              <input type="number" placeholder="db" />
            </div>

            {/* Keresés gomb */}
            <div className="button-field">
              <button className="search-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <span>Keresés</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};