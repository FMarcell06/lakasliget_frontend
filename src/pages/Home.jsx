import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { notify, readHomes } from "../myBackend";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Home.css";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { useContext } from "react";
import { MyUserContext } from "../context/MyUserProvider";
import { log } from "firebase/firestore/pipelines";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const orangeIcon = L.divIcon({
  className: "",
  html: `
    <div style="background:#e68900;width:38px;height:38px;border-radius:50%;border:3px solid white;box-shadow:0 3px 10px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
      </svg>
    </div>`,
  iconSize: [38, 38],
  iconAnchor: [19, 38],
});

// Scroll-animált elem hook
const useScrollReveal = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.05, rootMargin: "0px 0px -50px 0px" },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, visible];
};

export const Home = () => {
  const { user } = useContext(MyUserContext);
  const navigate = useNavigate();
  const [mapListings, setMapListings] = useState([]);
  const [featuredListings, setFeaturedListings] = useState([]);
  const [scrollY, setScrollY] = useState(0);

  const [featuredRef, featuredVisible] = useScrollReveal();
  const [mapRef, mapVisible] = useScrollReveal();
  const [statsRef, statsVisible] = useScrollReveal();

  const handleBegin = () => {
    if (!user) {
      navigate("/signin");
      notify.warning("Jelentkezz be az ingatlan meghirdetéséhez!");
    } else navigate("/addnew");
  };

  useEffect(() => {
    const load = async () => {
      const data = await readHomes();
      const visible = data.filter((h) => !h.hidden);
      setMapListings(visible.filter((h) => h.lat && h.lon).slice(0, 10));
      setFeaturedListings(visible.slice(0, 3));
    };
    load();
  }, []);

  // Parallax scroll
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="home-container">
      <Header />
      <div className="home-page">
        {/* Hero */}
        <main className="home-main">
          <div
            className="home-hero-bg"
            style={{ transform: `translateY(${scrollY * 0.35}px) scale(1.1)` }}
          />
          <div
            className="home-content"
            style={{ transform: `translateY(${scrollY * 0.15}px)` }}
          >
            <p className="home-eyebrow">
              Albérletek Egyetemistáknak Budapesten
            </p>
            <h1 className="home-logo-text">LakásLiget</h1>
            <p className="home-title">
              Megbízható ingatlanok bérlése, egyszerűen.
            </p>
            <div className="home-cta-row">
              <button
                className="home-button"
                onClick={() => navigate("/listings")}
              >
                Hirdetések böngészése
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <button
                className="home-button-ghost"
                onClick={() => navigate("/addnew")}
                hidden={!user}
              >
                Hirdetés feladása
              </button>
            </div>
          </div>
        </main>

        {/* Statisztikák sáv */}
        <section
          ref={statsRef}
          className={`home-stats-bar ${statsVisible ? "reveal" : ""}`}
        >
          <div className="stat-item">
            <span className="stat-num">{mapListings.length}+</span>
            <span className="stat-label">Aktív hirdetés</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-num">100%</span>
            <span className="stat-label">Ingyenes</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-num">Budapest</span>
            <span className="stat-label">Lefedett terület</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-num">2 perc</span>
            <span className="stat-label">Hirdetés feladása</span>
          </div>
        </section>

        {/* Kiemelt kártyák */}
        {featuredListings.length > 0 && (
          <section
            ref={featuredRef}
            className={`home-featured-section ${featuredVisible ? "reveal" : ""}`}
          >
            <div className="home-section-header">
              <div>
                <p className="section-eyebrow">Friss hirdetések</p>
                <h2>Kiemelt ingatlanok</h2>
              </div>
              <button
                className="see-all-btn"
                onClick={() => navigate("/listings")}
              >
                Összes megtekintése →
              </button>
            </div>
            <div className="compact-grid">
              {featuredListings.map((listing, i) => (
                <div
                  key={listing.id}
                  className="mini-card-v2"
                  onClick={() => navigate("/listing/" + listing.id)}
                >
                  <div
                    className="card-img-top"
                    style={{
                      backgroundImage: `url('${listing.thumbnail?.url || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=400"}')`,
                    }}
                  >
                    <div className="mini-tag">Kiemelt</div>
                    <div className="mini-price-overlay">
                      {Number(listing.price).toLocaleString()} Ft/hó
                    </div>
                  </div>
                  <div className="card-body-bottom">
                    <h3>{listing.title}</h3>
                    <div className="mini-meta">
                      <span>{listing.area} m²</span>
                      <span className="meta-dot">·</span>
                      <span>{listing.rooms} szoba</span>
                      <span className="meta-dot">·</span>
                      <span>{listing.category}</span>
                    </div>
                    <p className="mini-address">📍 {listing.address}</p>
                    <div className="card-footer">
                      <span className="card-cta">Részletek →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Térkép */}
        {mapListings.length > 0 && (
          <section
            ref={mapRef}
            className={`home-map-section ${mapVisible ? "reveal" : ""}`}
          >
            <div className="home-section-header">
              <div>
                <p className="section-eyebrow">Interaktív térkép</p>
                <h2>Hirdetések a térképen</h2>
              </div>
              <p className="map-hint-text">
                Kattints egy jelölőre a részletekért
              </p>
            </div>
            <div
              className="home-map-wrapper"
              style={{
                transform: `scale(${Math.min(1, 0.97 + scrollY * 0.00008)})`,
                transition: "transform 0.1s linear",
              }}
            >
              <MapContainer
                center={[47.497913, 19.040236]}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {mapListings.map((listing) => (
                  <Marker
                    key={listing.id}
                    position={[listing.lat, listing.lon]}
                    icon={orangeIcon}
                  >
                    <Popup className="home-map-popup">
                      <div
                        className="popup-card"
                        onClick={() => navigate("/listing/" + listing.id)}
                      >
                        <img
                          src={
                            listing.thumbnail?.url ||
                            "https://via.placeholder.com/220x130"
                          }
                          alt={listing.title}
                          className="popup-img"
                        />
                        <div className="popup-body">
                          <div className="popup-price">
                            {Number(listing.price).toLocaleString()} Ft/hó
                          </div>
                          <div className="popup-title">{listing.title}</div>
                          <div className="popup-meta">
                            {listing.area} m² · {listing.rooms} szoba
                          </div>
                          <div className="popup-address">{listing.address}</div>
                          <button className="popup-btn">Megnézem →</button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </section>
        )}

        {/* CTA banner */}
        <footer className="footer-container">
          <div className="dark-footer">
            <div className="footer-brand">
              <div className="about-logo-container">
                <div className="about-logo-icon"></div>
                <h1 className="about-logo-text">LakásLiget</h1>
              </div>
              <p>Bérelhető lakások Budapesten, egyszerűen!</p>
            </div>
            <div className="footer-about">
              <p className="footer-about-text">
                A LakásLiget egy ingyenes albérlet-kereső platform, amelyet
                budapesti egyetemisták számára hoztunk létre. Célunk, hogy a
                bérlőknek és bérbeadóknak egyaránt egyszerűvé tegyük az egymásra
                találást.
              </p>
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
