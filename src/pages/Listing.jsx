import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../components/Header";
import {
  MdArrowBackIos,
  MdArrowForwardIos,
  MdClose,
  MdFullscreen,
  MdInfoOutline,
  MdPlace,
  MdDirectionsWalk,
  MdSchool,
} from "react-icons/md";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { readHome } from "../myBackend";
import "./Listing.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Ikon fixálása Leaflethez
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

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
  if (!apartment || gallery.length === 0)
    return <div className="listing-loader">Ingatlan nem található.</div>;

  const price = Number(apartment.price) || 0;

  const getDistrict = (address) => {
    if (!address) return "Budapest";

    const parts = address.split(",").map((p) => p.trim());
    const districtPart = parts.find((p) => p.toLowerCase().includes("kerület"));

    if (districtPart) return districtPart;

    const zipMatch = address.match(/1(\d{2})\d/);
    if (zipMatch) {
      const districtNum = parseInt(zipMatch[1], 10);
      const romanDistricts = [
        "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X",
        "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX",
        "XX", "XXI", "XXII", "XXIII",
      ];
      return `${romanDistricts[districtNum - 1]}. kerület`;
    }

    return "Budapest";
  };

  const district = getDistrict(apartment.fullAddress);
  const position = [apartment.lat, apartment.lon];

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
                <button className="nav-arrow left" onClick={prevImg}>
                  <MdArrowBackIos />
                </button>
                <button className="nav-arrow right" onClick={nextImg}>
                  <MdArrowForwardIos />
                </button>
                <div className="img-counter">
                  {currentIndex === 0
                    ? "Borítókép"
                    : `${currentIndex + 1} / ${gallery.length}`}
                </div>
              </>
            )}
            <div className="fullscreen-hint">
              <MdFullscreen /> Kattints a nagyításhoz
            </div>
          </div>
        </div>

        {/* Összegző sáv */}
        <div className="listing-summary-bar">
          <div className="summary-item">
            <span className="summary-label">Havi bérleti díj</span>
            <span className="summary-value highlight">
              {price.toLocaleString()} Ft
            </span>
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
              <span className="calc-price">
                {(price * 2).toLocaleString()} Ft
              </span>
            </div>
            <div className="calc-operator">+</div>
            <div className="calc-block">
              <span className="calc-label">Első havi lakbér</span>
              <span className="calc-price">{price.toLocaleString()} Ft</span>
            </div>
            <div className="calc-operator">=</div>
            <div className="calc-block highlight-block">
              <span className="calc-label">Összesen fizetendő</span>
              <span className="calc-price">
                {(price * 3).toLocaleString()} Ft
              </span>
            </div>
          </div>
        </div>

        {/* Részletes adatok */}
        <div className="details-section">
          <h2>Részletes paraméterek</h2>
          <div className="details-card">
            <div className="details-grid">
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
                  <span className="d-label">Gépesített</span>
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
                  <span className="d-value">
                    {apartment.balconySize !== "Nincs megadva"
                      ? `${apartment.balconySize} m²`
                      : "Nincs"}
                  </span>
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
                <p style={{ whiteSpace: "pre-wrap" }}>
                  {apartment.description}
                </p>
              </div>
            </div>
          </div>

          {/* ELHELYEZKEDÉS SZEKCIÓ ÉLŐ TÉRKÉPPEL */}
          <div className="location-container" style={{ marginTop: "40px" }}>
            <h2>
              <MdPlace /> Elhelyezkedés
            </h2>
            <div className="location-card">
              <div className="address-header">
                <p className="full-address-text">
                  {apartment.fullAddress || apartment.address}
                </p>
              </div>

              <div className="distance-grid">
                <div className="distance-box">
                  <MdPlace className="dist-icon" style={{ color: "#d32f2f" }} />
                  <div className="dist-details">
                    <span className="dist-label">Városrész: </span>
                    <span className="dist-value">{district}</span>
                  </div>
                </div>
                <div className="distance-box">
                  <MdDirectionsWalk className="dist-icon" />
                  <div className="dist-details">
                    <span className="dist-label">Tömegközlekedés: </span>
                    <span className="dist-value">Kiváló összeköttetés</span>
                  </div>
                </div>
              </div>

              {/* TÉNYLEGES LEAFLET TÉRKÉP */}
              <div
                className="map-wrapper"
                style={{
                  height: "350px",
                  width: "100%",
                  marginTop: "20px",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "1px solid #ddd",
                  zIndex: 1,
                }}
              >
                {apartment.lat && apartment.lon ? (
                  <MapContainer
                    center={position}
                    zoom={15}
                    scrollWheelZoom={false}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position}>
                      <Popup>
                        <strong>{apartment.title}</strong>
                        <br />
                        {price.toLocaleString()} Ft / hó
                      </Popup>
                    </Marker>
                  </MapContainer>
                ) : (
                  <div className="no-map">
                    Nincsenek elérhető koordináták a térképhez.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal / Fullscreen Galéria */}
      {isModalOpen && (
        <div
          className="image-modal-overlay"
          onClick={() => setIsModalOpen(false)}
        >
          <button className="modal-close" onClick={() => setIsModalOpen(false)}>
            <MdClose />
          </button>
          <button className="modal-fixed-arrow left" onClick={prevImg}>
            <MdArrowBackIos />
          </button>
          <button className="modal-fixed-arrow right" onClick={nextImg}>
            <MdArrowForwardIos />
          </button>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={gallery[currentIndex]?.url}
              alt="Ingatlan nagyítva"
              className="modal-image"
            />
            <div className="modal-counter">
              {currentIndex + 1} / {gallery.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};