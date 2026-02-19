import React from 'react';
import { Header } from '../components/Header'; // A meglévő navigációd
import './About.css';

export const About = () => {
  return (
    <div className="about-page-wrapper">
      {/* Ez a te eredeti fejléced a navigációval */}
      <Header />

      {/* Az About oldal saját 'hős' szekciója */}
      <section className="about-hero-banner">
        <div className="glass-overlay">
          <h1 className="about-title">Rólunk</h1>
        </div>
      </section>

      {/* Világos tartalmi rész */}
      <section className="about-description">
        <div className="container">
          <p>
            A Lakás Ligetnél küldetésünk, hogy egyszerűvé és átláthatóvá tegyük az ingatlanbérlést. 
            Csapatunk elkötelezett a minőségi lakókörnyezet és a korrekt bérbeadói folyamatok mellett, 
            legyen szó rövid vagy hosszú távú megoldásokról. 
            Segítünk, hogy ne csak egy ingatlant, hanem valódi otthont találjon.
          </p>
        </div>
      </section>

      {/* Elérhetőség fül */}
      <footer className="contact-footer-tab">
        <div className="tab-content">
          <div className="contact-pill">
            <span className="pill-label">E-mail</span>
            <span className="pill-text">hello@lakasliget.hu</span>
          </div>
          <div className="contact-pill">
            <span className="pill-label">Telefon</span>
            <span className="pill-text">+36 30 555 1234</span>
          </div>
          <div className="contact-pill">
            <span className="pill-label">Cím</span>
            <span className="pill-text">Budapest, Liget út 12.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};