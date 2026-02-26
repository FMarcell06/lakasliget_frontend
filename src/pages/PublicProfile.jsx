import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseApp";
import { readHomes } from "../myBackend";
import { ApartCard } from "../components/ApartCard";
import { Header } from "../components/Header";
import { FaPhone, FaEnvelope, FaUser } from "react-icons/fa";
import { IoClose } from 'react-icons/io5';
import './PublicProfile.css';

export const PublicProfile = () => {
  const { uid } = useParams();
  const navigate = useNavigate();
  const [contactData, setContactData] = useState(null);
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // A képed alapján a 'users' kollekcióban az adott dokumentum tartalmazza az adatokat
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContactData(docSnap.data());
        }

        const allHomes = await readHomes();
        setHomes(allHomes.filter(h => h.uid === uid));
      } catch (err) {
        console.error("Betöltési hiba:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [uid]);

  if (loading) return <div className="loading-overlay"><div className="custom-spinner"></div></div>;

  return (
    <div className="recipe-form-container">
      <Header />
      <IoClose onClick={() => navigate(-1)} className="close-icon" title="Vissza" />
      
      <h1 className="form-title">Hirdető profilja</h1>

      <div className="profile-layout">
        <div className="profile-sidebar">

          <div className="recipe-card">
            <div className="user-info">
              {/* Pontos mezőnév a képed alapján: contactName */}
              <h3>{contactData?.contactName || "Hirdető"}</h3>
              <p>{contactData?.contactEmail}</p>
            </div>

            <div className="avatar-section">
              {/* JAVÍTÁS: avatarUrl kis 'u'-val, ahogy a képen látni! */}
              {contactData?.avatarUrl ? (
                <img 
                  src={contactData.avatarUrl} 
                  className="profile-img" 
                  alt="profilkep" 
                />
              ) : (
                <div className="profile-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
                  <FaUser size={50} color="#ccc" />
                </div>
              )}
            </div>
            
            <div style={{ textAlign: 'center', fontWeight: 'bold', color: '#e68900' }}>
              {/* Pontos mezőnév: contactType */}
              {contactData?.contactType || "Magánszemély"}
            </div>
          </div>

          <div className="recipe-card contact-card-form">
            <h3 className="contact-form-title">
              <FaUser style={{ color: "#e68900" }} /> Elérhetőségek
            </h3>
            
            <div className="contact-form-field">
              <label><FaUser className="cff-icon" /> Név</label>
              <div className="public-read-field">{contactData?.contactName || "-"}</div>
            </div>

            <div className="contact-form-field">
              <label><FaPhone className="cff-icon" /> Telefonszám</label>
              <div className="public-read-field">
                {/* Pontos mezőnév: contactPhone */}
                {contactData?.contactPhone ? (
                   <a href={`tel:${contactData.contactPhone}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {contactData.contactPhone}
                   </a>
                ) : "Nincs megadva"}
              </div>
            </div>

            <div className="contact-form-field">
              <label><FaEnvelope className="cff-icon" /> Email cím</label>
              <div className="public-read-field">{contactData?.contactEmail || "-"}</div>
            </div>

            <button 
              className="save-btn" 
              onClick={() => window.location.href = `mailto:${contactData?.contactEmail}`}
            >
              Kapcsolatfelvétel
            </button>
          </div>
        </div>

        <div className="my-listings-section">
          <div className="listings-tabs">
            <button className="tab-btn active">
              Aktív hirdetései ({homes.length})
            </button>
          </div>

          <div className="my-listings-grid">
            {homes.length > 0 ? (
              homes.map(home => (
                <div key={home.id} className="my-home-item" onClick={() => navigate("/listing/" + home.id)}>
                  <ApartCard apartment={home} />
                </div>
              ))
            ) : (
              <div className="no-listings">
                <p>Jelenleg nincsenek aktív hirdetései.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};