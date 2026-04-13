import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import "./About.css";

export const About = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div className="about-page">
      <Header />

      <div className="about-container">
        <section className="about-header">
          <div
            className="about-hero-bg"
            style={{ transform: `translateY(${scrollY * 0.35}px)` }}
          />
          <div className="blur">
            <h1 className="about-title">Rólunk</h1>
          </div>
        </section>

        <main className="about-main">
          <section className="about-section">
            <div className="container">
              <h2 className="section-title">Szakértelem és Bizalom</h2>
              <div className="accent-line"></div>
              <p>
                A Lakás Ligetnél küldetésünk, hogy egyszerűvé és átláthatóvá
                tegyük az ingatlanbérlést. Csapatunk elkötelezett a minőségi
                lakókörnyezet és a korrekt bérbeadói folyamatok mellett.
              </p>
              <p>
                Több éves tapasztalattal a hátunk mögött segítünk bérlőinknek
                megtalálni az ideális otthont, tulajdonosainknak pedig a
                megbízható bérlőket. Hiszünk a személyes kapcsolatokban és a
                digitális megoldások erejében.
              </p>
            </div>
          </section>

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

        <footer className="footer-container">
          <div className="dark-footer">
            <div className="footer-brand">
              <div className="about-logo-container">
                <div className="about-logo-icon"></div>
                <h1 className="about-logo-text">LakásLiget</h1>
              </div>
              <p>Bérelhető lakások Budapesten, egyszerűen!</p>
              <div className="footer-socials">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="social-icon"
                >
                  <svg
                    width="18"
                    height="18"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="social-icon"
                >
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                  </svg>
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noreferrer"
                  className="social-icon"
                >
                  <svg
                    width="18"
                    height="18"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.74a4.85 4.85 0 0 1-1.01-.05z" />
                  </svg>
                </a>
              </div>
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
                  <span className="footer-value">
                    1054 Budapest, Liget tér 12.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2026 Lakás Liget. Minden jog fenntartva</p>
          </div>
        </footer>
      </div>
    </div>
  );
};
