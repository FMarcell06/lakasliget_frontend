import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { readHomes } from '../myBackend';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Home.css';

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

const orangeIcon = L.divIcon({
  className: "",
  html: `<div style="background:#e68900;width:36px;height:36px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 3px 10px rgba(0,0,0,0.25);"></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

export const Home = () => {
  const navigate = useNavigate();
  const [mapListings, setMapListings] = useState([]);
  const [featuredListings, setFeaturedListings] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await readHomes();
      const visible = data.filter(h => !h.hidden);
      setMapListings(visible.filter(h => h.lat && h.lon).slice(0, 10));
      setFeaturedListings(visible.slice(0, 3));
    };
    load();
  }, []);

  return (
    <div className="home-container">
      <Header />
      <div className="home-page">

        {/* Hero */}
        <main className="home-main">
          <div className="home-content">
            <h1 className="home-logo-text">Lakás Liget</h1>
            <p className="home-title">Prémium ingatlanok, egyszerűen.</p>
            <button className="home-button" onClick={() => navigate('/listings')}>
              Összes hirdetés
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </main>

        {/* TÉRKÉP */}
        {mapListings.length > 0 && (
          <section className="home-map-section">
            <div className="home-map-header">
              <h2>Hirdetések a térképen</h2>
              <p>Kattints egy jelölőre a részletekért</p>
            </div>
            <div className="home-map-wrapper">
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
                {mapListings.map(listing => (
                  <Marker key={listing.id} position={[listing.lat, listing.lon]} icon={orangeIcon}>
                    <Popup className="home-map-popup">
                      <div className="popup-card" onClick={() => navigate("/listing/" + listing.id)}>
                        <img src={listing.thumbnail?.url || "https://via.placeholder.com/220x130"} alt={listing.title} className="popup-img" />
                        <div className="popup-body">
                          <div className="popup-price">{Number(listing.price).toLocaleString()} Ft/hó</div>
                          <div className="popup-title">{listing.title}</div>
                          <div className="popup-meta">{listing.area} m² · {listing.rooms} szoba</div>
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

        {/* Kiemelt kártyák */}
        {featuredListings.length > 0 && (
          <section className="home-section">
            <div className="compact-grid">
              {featuredListings.map(listing => (
                <div key={listing.id} className="mini-card-v2" onClick={() => navigate("/listing/" + listing.id)}>
                  <div className="card-img-top" style={{ backgroundImage: `url('${listing.thumbnail?.url || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=400"}')` }}>
                    <div className="mini-tag">Kiemelt</div>
                  </div>
                  <div className="card-body-bottom">
                    <h3>{listing.title}</h3>
                    <p className="mini-price">{Number(listing.price).toLocaleString()} Ft / hó</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};