import React from 'react';
import { Header } from '../components/Header';
import './About.css';

export const About = () => {
  return (
    <div className="about-page-wrapper">
      <Header />
      
      <div  className='about-container'>
        {/* Hero Banner */}
        <section className="about-hero-banner">
            <div className="glass-overlay">
            <h1 className="about-title">Rólunk</h1>
            </div>
        </section>

        {/* Tartalmi rész - Görgethető tartalom */}
        <main className="about-main-content">
            <section className="about-description">
            <div className="container">
                <h2 className="section-subtitle">Szakértelem és Bizalom</h2>
                <div className="accent-line"></div>
                <p>
                A Lakás Ligetnél küldetésünk, hogy egyszerűvé és átláthatóvá tegyük az ingatlanbérlést. 
                Csapatunk elkötelezett a minőségi lakókörnyezet és a korrekt bérbeadói folyamatok mellett.
                </p>
                <p>
                Több éves tapasztalattal a hátunk mögött segítünk bérlőinknek megtalálni az ideális otthont, 
                tulajdonosainknak pedig a megbízható bérlőket. Hiszünk a személyes kapcsolatokban és a digitális megoldások erejében.
                </p>
            </div>
            </section>

            {/* Extra szekció a görgetéshez */}
            <section className="about-stats">
            <div className="stat-card">
                <span className="stat-value">500+</span>
                <span className="stat-name">Sikeres bérbeadás</span>
            </div>
            <div className="stat-card">
                <span className="stat-value">10+</span>
                <span className="stat-name">Év tapasztalat</span>
            </div>
            <div className="stat-card">
                <span className="stat-value">100%</span>
                <span className="stat-name">Elégedettség</span>
            </div>
            </section>
        </main>

        {/* Sötét Footer / Elérhetőségek */}
        <footer className="dark-footer">
            <div className="footer-container">
            <div className="footer-brand">

                <div className="logo-container">
                    <div className="logo-icon" />
                    <h1 className="logo-text">LakásLiget</h1>
                </div>
                <p>Minőségi otthonok, egyszerűen.</p>
            </div>
            
            <div className="footer-contact">
                <h4>Elérhetőségeink</h4>
                <div className="contact-list">
                <div className="contact-item">
                    <span className="footer-label">E-mail:</span>
                    <span className="footer-value">hello@lakasliget.hu</span>
                </div>
                <div className="contact-item">
                    <span className="footer-label">Telefon:</span>
                    <span className="footer-value">+36 30 555 1234</span>
                </div>
                <div className="contact-item">
                    <span className="footer-label">Cím:</span>
                    <span className="footer-value">1054 Budapest, Liget tér 12.</span>
                </div>
                </div>
            </div>
            </div>
            <div className="footer-bottom">
            <p>&copy; 2026 Lakás Liget. Minden jog fenntartva.</p>
            </div>
        </footer>
        </div>
      </div> 

     
  );
};