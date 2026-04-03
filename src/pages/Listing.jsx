import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../components/Header";
import {
  MdArrowBackIos, MdArrowForwardIos, MdClose, MdFullscreen, MdPlace, MdDirectionsWalk,
} from "react-icons/md";
import { FaUser, FaPhone, FaEnvelope, FaGraduationCap, FaShoppingCart, FaDumbbell } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseApp";
import { readHome } from "../myBackend";
import "./Listing.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

const createColorIcon = (color, emoji) => L.divIcon({
  className: "",
  html: `<div style="background:${color};width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);">${emoji}</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const ICONS = {
  university: createColorIcon("#1976d2", "🎓"),
  supermarket: createColorIcon("#2e7d32", "🛒"),
  gym: createColorIcon("#e68900", "💪"),
};

// Több Overpass mirror a fallback-hez
const OVERPASS_MIRRORS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
];

const fetchWithRetry = async (query, retries = 3, delayMs = 1000) => {
  for (let attempt = 0; attempt < retries; attempt++) {
    const mirror = OVERPASS_MIRRORS[attempt % OVERPASS_MIRRORS.length];
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000); // 12mp kliens timeout

      const resp = await fetch(mirror, {
        method: "POST",
        body: query,
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

      const text = await resp.text(); // előbb text, hogy ne crasheljen JSON parse
      const data = JSON.parse(text);
      return data;
    } catch (err) {
      console.warn(`Overpass kísérlet ${attempt + 1} sikertelen (${mirror}):`, err.message);
      if (attempt < retries - 1) {
        await new Promise(r => setTimeout(r, delayMs * (attempt + 1))); // exponenciális várakozás
      }
    }
  }
  throw new Error("Minden Overpass szerver elérhetetlen");
};

const fetchPlaces = async (lat, lon, type) => {
  const queries = {
    university: `node["amenity"="university"](around:1500,${lat},${lon});way["amenity"="university"](around:1500,${lat},${lon});`,
    supermarket: `node["shop"="supermarket"](around:1000,${lat},${lon});node["shop"="convenience"](around:800,${lat},${lon});`,
    gym: `node["leisure"="fitness_centre"](around:1200,${lat},${lon});node["amenity"="gym"](around:1200,${lat},${lon});`,
  };

  // timeout:25 a szerveren, hogy legyen ideje válaszolni
  const query = `[out:json][timeout:25];(${queries[type]});out center;`;

  try {
    const data = await fetchWithRetry(query);
    return data.elements.map(el => ({
      id: el.id,
      lat: el.lat || el.center?.lat,
      lon: el.lon || el.center?.lon,
      name: el.tags?.name || "Névtelen",
    })).filter(p => p.lat && p.lon);
  } catch (err) {
    console.error("Overpass véglegesen sikertelen:", err);
    return [];
  }
};

const LAYERS = [
  { key: "university", label: "Egyetemek", icon: <FaGraduationCap />, color: "#1976d2" },
  { key: "supermarket", label: "Boltok", icon: <FaShoppingCart />, color: "#2e7d32" },
  { key: "gym", label: "Edzőtermek", icon: <FaDumbbell />, color: "#e68900" },
];

export const Listing = () => {
  const { id } = useParams();
  const [apartment, setApartment] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [seller, setSeller] = useState(null);
  const [activeLayers, setActiveLayers] = useState({ university: false, supermarket: false, gym: false });
  const [places, setPlaces] = useState({ university: [], supermarket: [], gym: [] });
  const [layerLoading, setLayerLoading] = useState({ university: false, supermarket: false, gym: false });
  const fetched = useRef({ university: false, supermarket: false, gym: false });
  const navigate = useNavigate();

  useEffect(() => {
    readHome(id, async (data) => {
      if (data) {
        setApartment(data);
        if (data.uid) {
          try {
            const userDocRef = doc(db, "users", data.uid);
            const userSnap = await getDoc(userDocRef);
            if (userSnap.exists()) setSeller(userSnap.data());
          } catch (error) {
            console.error("Hiba a hirdető lekérésekor:", error);
          }
        }
        const combined = [];
        if (data.thumbnail) combined.push(data.thumbnail);
        if (data.images && Array.isArray(data.images)) combined.push(...data.images);
        setGallery(combined);
      }
      setLoading(false);
    });
  }, [id]);

  const handleToggleLayer = async (key) => {
    const isNowActive = !activeLayers[key];
    setActiveLayers(prev => ({ ...prev, [key]: isNowActive }));
    if (isNowActive && !fetched.current[key] && apartment?.lat && apartment?.lon) {
      setLayerLoading(prev => ({ ...prev, [key]: true }));
      const results = await fetchPlaces(apartment.lat, apartment.lon, key);
      setPlaces(prev => ({ ...prev, [key]: results }));
      fetched.current[key] = true;
      setLayerLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  const nextImg = (e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev + 1) % gallery.length); };
  const prevImg = (e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev - 1 + gallery.length) % gallery.length); };

  if (loading) return <div className="listing-loader">Adatok betöltése...</div>;
  if (!apartment || gallery.length === 0) return <div className="listing-loader">Ingatlan nem található.</div>;

  const price = Number(apartment.price) || 0;

  const getDistrict = (address) => {
    if (!address) return "Budapest";
    const parts = address.split(",").map((p) => p.trim());
    const districtPart = parts.find((p) => p.toLowerCase().includes("kerület"));
    if (districtPart) return districtPart;
    const zipMatch = address.match(/1(\d{2})\d/);
    if (zipMatch) {
      const districtNum = parseInt(zipMatch[1], 10);
      const romanDistricts = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV","XVI","XVII","XVIII","XIX","XX","XXI","XXII","XXIII"];
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

        {/* Galéria */}
        <div className="listing-gallery" onClick={() => setIsModalOpen(true)}>
          <div className="main-img-box clickable">
            <img src={gallery[currentIndex]?.url} alt={apartment.title} className="fade-in" key={currentIndex} />
            {gallery.length > 1 && (
              <>
                <button className="nav-arrow left" onClick={prevImg}><MdArrowBackIos /></button>
                <button className="nav-arrow right" onClick={nextImg}><MdArrowForwardIos /></button>
                <div className="img-counter">{currentIndex === 0 ? "Borítókép" : `${currentIndex + 1} / ${gallery.length}`}</div>
              </>
            )}
            <div className="fullscreen-hint"><MdFullscreen /> Kattints a nagyításhoz</div>
          </div>
        </div>

        {/* Összegző sáv */}
        <div className="listing-summary-bar">
          <div className="summary-item"><span className="summary-label">Havi bérleti díj</span><span className="summary-value highlight">{price.toLocaleString()} Ft</span></div>
          <div className="summary-item"><span className="summary-label">Alapterület</span><span className="summary-value">{apartment.area} m²</span></div>
          <div className="summary-item"><span className="summary-label">Szobák száma</span><span className="summary-value">{apartment.rooms}</span></div>
        </div>

        {/* Kaució */}
        <div className="calc-card">
          <h3>Szerződéskötéskor esedékes költségek</h3>
          <div className="calc-flex">
            <div className="calc-block"><span className="calc-label">2 havi kaució</span><span className="calc-price">{(price * 2).toLocaleString()} Ft</span></div>
            <div className="calc-operator">+</div>
            <div className="calc-block"><span className="calc-label">Első havi lakbér</span><span className="calc-price">{price.toLocaleString()} Ft</span></div>
            <div className="calc-operator">=</div>
            <div className="calc-block highlight-block"><span className="calc-label">Összesen fizetendő</span><span className="calc-price">{(price * 3).toLocaleString()} Ft</span></div>
          </div>
        </div>

        {/* Részletes adatok */}
        <div className="details-section">
          <h2>Részletes paraméterek</h2>
          <div className="details-card">
            <div className="details-grid">
              <div className="details-column">
                <div className="detail-row"><span className="d-label">Ingatlan típusa</span><span className="d-value">{apartment.category}</span></div>
                <div className="detail-row"><span className="d-label">Építés éve</span><span className="d-value">{apartment.buildYear}</span></div>
                <div className="detail-row"><span className="d-label">Emelet</span><span className="d-value">{apartment.floor}</span></div>
                <div className="detail-row"><span className="d-label">Épület szintjei</span><span className="d-value">{apartment.buildingLevels}</span></div>
                <div className="detail-row"><span className="d-label">Belmagasság</span><span className="d-value">{apartment.ceilingHeight}</span></div>
                <div className="detail-row"><span className="d-label">Lift</span><span className="d-value">{apartment.lift}</span></div>
                <div className="detail-row"><span className="d-label">Energetikai tanúsítvány</span><span className="d-value">{apartment.energyCert}</span></div>
              </div>
              <div className="details-column">
                <div className="detail-row"><span className="d-label">Fűtés típusa</span><span className="d-value">{apartment.heating}</span></div>
                <div className="detail-row"><span className="d-label">Légkondicionáló</span><span className="d-value">{apartment.airConditioner}</span></div>
                <div className="detail-row"><span className="d-label">Szigetelés</span><span className="d-value">{apartment.insulation}</span></div>
                <div className="detail-row"><span className="d-label">Bútorozott</span><span className="d-value">{apartment.furnished}</span></div>
                <div className="detail-row"><span className="d-label">Gépesített</span><span className="d-value">{apartment.equipped}</span></div>
                <div className="detail-row"><span className="d-label">Fürdő és WC</span><span className="d-value">{apartment.bathroomWc}</span></div>
                <div className="detail-row"><span className="d-label">Akadálymentesített</span><span className="d-value">{apartment.accessible}</span></div>
              </div>
              <div className="details-column">
                <div className="detail-row"><span className="d-label">Kilátás</span><span className="d-value">{apartment.view}</span></div>
                <div className="detail-row"><span className="d-label">Tájolás</span><span className="d-value">{apartment.orientation}</span></div>
                <div className="detail-row"><span className="d-label">Erkély mérete</span><span className="d-value">{apartment.balconySize !== "Nincs megadva" ? `${apartment.balconySize} m²` : "Nincs"}</span></div>
                <div className="detail-row"><span className="d-label">Kisállat hozható</span><span className="d-value">{apartment.pets}</span></div>
                <div className="detail-row"><span className="d-label">Dohányzás</span><span className="d-value">{apartment.smoking}</span></div>
                <div className="detail-row"><span className="d-label">Min. bérleti idő</span><span className="d-value">{apartment.minRentTime}</span></div>
                <div className="detail-row"><span className="d-label">Költözhető</span><span className="d-value">{apartment.moveInDate}</span></div>
              </div>
            </div>
          </div>

          {/* Leírás */}
          <div className="description-container">
            <h2>Hirdetés leírása</h2>
            <div className="description-card">
              <div className="description-content">
                <p style={{ whiteSpace: "pre-wrap" }}>{apartment.description}</p>
              </div>
            </div>
          </div>

          {/* Hirdető */}
          {(apartment.contactName || seller?.contactName) && (
            <div className="contact-section">
              <h2><FaUser style={{ marginRight: 8, color: "#e68900" }} />Hirdető adatai</h2>
              <div className="contact-card-listing" onClick={() => navigate("/users/" + apartment.uid)}>
                <div className="contact-avatar">
                  {seller?.avatarUrl
                    ? <img src={seller.avatarUrl} alt="Profil" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                    : <FaUser size={28} />
                  }
                </div>
                <div className="contact-details">
                  <div className="contact-name-row">
                    <span className="contact-name">{seller?.contactName || apartment.contactName || "Ismeretlen"}</span>
                    {(seller?.contactType || apartment.contactType) && (
                      <span className="contact-type-badge">{seller?.contactType || apartment.contactType}</span>
                    )}
                  </div>
                  <div className="contact-links">
                    {(seller?.contactPhone || apartment.contactPhone) && (
                      <a href={`tel:${seller?.contactPhone || apartment.contactPhone}`} className="contact-link phone" onClick={(e) => e.stopPropagation()}>
                        <FaPhone />{seller?.contactPhone || apartment.contactPhone}
                      </a>
                    )}
                    {(seller?.contactEmail || apartment.contactEmail) && (
                      <a href={`mailto:${seller?.contactEmail || apartment.contactEmail}`} className="contact-link email" onClick={(e) => e.stopPropagation()}>
                        <FaEnvelope />{seller?.contactEmail || apartment.contactEmail}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Elhelyezkedés */}
          <div className="location-container" style={{ marginTop: "40px" }}>
            <h2><MdPlace /> Elhelyezkedés</h2>
            <div className="location-card">
              <div className="address-header">
                <p className="full-address-text">{apartment.fullAddress || apartment.address}</p>
              </div>
              <div className="distance-grid">
                <div className="distance-box">
                  <MdPlace className="dist-icon" style={{ color: "#d32f2f" }} />
                  <div className="dist-details"><span className="dist-label">Városrész: </span><span className="dist-value">{district}</span></div>
                </div>
                <div className="distance-box">
                  <MdDirectionsWalk className="dist-icon" />
                  <div className="dist-details"><span className="dist-label">Tömegközlekedés: </span><span className="dist-value">Kiváló összeköttetés</span></div>
                </div>
              </div>

              {/* TOGGLE GOMBOK */}
              <div className="map-layer-toggles">
                {LAYERS.map(layer => (
                  <button
                    key={layer.key}
                    className={`layer-toggle-btn ${activeLayers[layer.key] ? "active" : ""}`}
                    style={{ "--layer-color": layer.color }}
                    onClick={() => handleToggleLayer(layer.key)}
                  >
                    {layerLoading[layer.key]
                      ? <span className="layer-spinner" />
                      : layer.icon
                    }
                    {layer.label}
                    {activeLayers[layer.key] && places[layer.key].length > 0 && (
                      <span className="layer-count">{places[layer.key].length}</span>
                    )}
                  </button>
                ))}
              </div>

              {/* TÉRKÉP */}
              <div className="map-wrapper" style={{ height: "400px", width: "100%", marginTop: "16px", borderRadius: "12px", overflow: "hidden", border: "1px solid #ddd", zIndex: 1 }}>
                {apartment.lat && apartment.lon ? (
                  <MapContainer center={position} zoom={15} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                    <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={position}>
                      <Popup><strong>{apartment.title}</strong><br />{price.toLocaleString()} Ft / hó</Popup>
                    </Marker>
                    {LAYERS.map(layer =>
                      activeLayers[layer.key] && places[layer.key].map(place => (
                        <Marker key={`${layer.key}-${place.id}`} position={[place.lat, place.lon]} icon={ICONS[layer.key]}>
                          <Popup>
                            <strong>{place.name}</strong><br />
                            <span style={{ color: layer.color, fontSize: "12px" }}>{layer.label}</span>
                          </Popup>
                        </Marker>
                      ))
                    )}
                  </MapContainer>
                ) : (
                  <div className="no-map">Nincsenek elérhető koordináták a térképhez.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="image-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <button className="modal-close" onClick={() => setIsModalOpen(false)}><MdClose /></button>
          <button className="modal-fixed-arrow left" onClick={prevImg}><MdArrowBackIos /></button>
          <button className="modal-fixed-arrow right" onClick={nextImg}><MdArrowForwardIos /></button>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={gallery[currentIndex]?.url} alt="Ingatlan" className="modal-image" />
            <div className="modal-counter">{currentIndex + 1} / {gallery.length}</div>
          </div>
        </div>
      )}
    </div>
  );
};