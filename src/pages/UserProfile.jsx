import React, { useState, useEffect, useContext } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaPhone, FaEnvelope, FaUser, FaBuilding, FaTrash, FaExclamationTriangle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { MyUserContext } from '../context/MyUserProvider';
import { Header } from '../components/Header';
import { deleteAvatar, notify, readHomes } from '../myBackend';
import { ApartCard } from '../components/ApartCard';
import { useFavourites } from '../useFavourites';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseApp';
import './UserProfile.css';

export const UserProfile = () => {
  const { user, photoUpdate, deleteAccount } = useContext(MyUserContext);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [myHomes, setMyHomes] = useState([]);
  const [allHomes, setAllHomes] = useState([]);
  const [activeTab, setActiveTab] = useState("own");
  const { favourites } = useFavourites();
  const navigate = useNavigate();

  const [contact, setContact] = useState({
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    contactType: "Magánszemély",
  });
  const [contactSaved, setContactSaved] = useState(false);

  // Fiók törlés modal
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePw, setShowDeletePw] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const load = async () => {
        const data = await readHomes();
        setAllHomes(data);
        setMyHomes(data.filter(home => home.uid === user.uid));
      };
      load();

      const loadContact = async () => {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setContact({
              contactName: data.contactName || user.displayName || "",
              contactPhone: data.contactPhone || "",
              contactEmail: data.contactEmail || user.email || "",
              contactType: data.contactType || "Magánszemély",
            });
          } else {
            setContact(prev => ({
              ...prev,
              contactName: user.displayName || "",
              contactEmail: user.email || "",
            }));
          }
        } catch (err) {
          console.error("Kontakt betöltési hiba:", err);
        }
      };
      loadContact();
    }
  }, [user]);

  const favHomes = allHomes.filter(home => favourites.includes(home.id));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    try {
      await photoUpdate(file);
      setFile(null);
      setPreview(null);
    } catch (error) {
      console.error("Feltöltési hiba:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      const existing = docSnap.exists() ? docSnap.data() : {};
      await setDoc(docRef, { ...existing, ...contact });

      for (const home of myHomes) {
        const homeRef = doc(db, "apartments", home.id);
        await updateDoc(homeRef, { ...contact });
      }

      notify.success("Sikeres mentés!");
      setContactSaved(true);
      setTimeout(() => setContactSaved(false), 3000);
    } catch (err) {
      notify.error("Hiba történt mentéskor!");
      console.error("Kontakt mentési hiba:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletePassword) return;
    setDeleteLoading(true);
    try {
      await deleteAvatar(user.uid);
      await deleteAccount(deletePassword);
      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
      setDeleteModal(false);
      setDeletePassword("");
    }
  };

  return (
    <div className="recipe-form-container">
      <Header />
      <IoClose onClick={() => navigate("/")} className="close-icon" title="Vissza" />
      
      <h1 className="form-title">Profil Beállítások</h1>

      <div className="profile-layout">
        {/* BAL OLDAL */}
        <div className="profile-sidebar">

          <form className="recipe-card" onSubmit={handleSubmit}>
            <div className="user-info">
              <h3>{user?.displayName || "Felhasználó"}</h3>
              <p>{user?.email}</p>
            </div>

            <div className="avatar-section">
              {user?.photoURL && !preview && (
                <img src={user.photoURL} className="profile-img" alt="profilkep" />
              )}
              {preview && (
                <img src={preview} className="preview-img" alt="előnézet" />
              )}
              <label className="upload-label">
                Kép módosítása
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
              </label>
            </div>

            <button className="save-btn" disabled={loading || !file} type="submit">
              {loading ? "Mentés..." : "Profilkép mentése"}
            </button>
          </form>

          <form className="recipe-card contact-card-form" onSubmit={handleContactSave}>
            <h3 className="contact-form-title">
              <FaUser style={{ color: "#e68900" }} /> Elérhetőségeim
            </h3>
            <p className="contact-form-subtitle">Ezek az adatok megjelennek a hirdetéseiden.</p>

            <div className="contact-form-field">
              <label><FaUser className="cff-icon" /> Neve</label>
              <input type="text" value={contact.contactName} onChange={e => setContact(p => ({ ...p, contactName: e.target.value }))} placeholder="pl. Kiss János" />
            </div>
            <div className="contact-form-field">
              <label><FaPhone className="cff-icon" /> Telefonszám</label>
              <input type="tel" value={contact.contactPhone} onChange={e => setContact(p => ({ ...p, contactPhone: e.target.value }))} placeholder="pl. +36 30 123 4567" />
            </div>
            <div className="contact-form-field">
              <label><FaEnvelope className="cff-icon" /> Email cím</label>
              <input type="email" value={contact.contactEmail} onChange={e => setContact(p => ({ ...p, contactEmail: e.target.value }))} placeholder="pl. kiss.janos@email.hu" />
            </div>
            <div className="contact-form-field">
              <label><FaBuilding className="cff-icon" /> Hirdető típusa</label>
              <select value={contact.contactType} onChange={e => setContact(p => ({ ...p, contactType: e.target.value }))}>
                <option value="Magánszemély">Magánszemély</option>
                <option value="Tulajdonos">Tulajdonos</option>
                <option value="Ingatlaniroda">Ingatlaniroda</option>
              </select>
            </div>

            <button className="save-btn" type="submit" disabled={loading}>
              {contactSaved ? "✓ Mentve!" : loading ? "Mentés..." : "Elérhetőség mentése"}
            </button>
          </form>

          {/* Fiók törlése gomb */}
          <button className="accDelBtn" onClick={() => setDeleteModal(true)} disabled={loading}>
            <FaTrash /> Fiók törlése
          </button>
        </div>

        {/* JOBB OLDAL */}
        <div className="my-listings-section">
          <div className="listings-tabs">
            <button className={`tab-btn ${activeTab === "own" ? "active" : ""}`} onClick={() => setActiveTab("own")}>
              Saját hirdetéseim ({myHomes.length})
            </button>
            <button className={`tab-btn ${activeTab === "favs" ? "active" : ""}`} onClick={() => setActiveTab("favs")}>
              Kedvenceim ({favHomes.length})
            </button>
          </div>

          {activeTab === "own" && (
            <div className="my-listings-grid">
              {myHomes.length > 0 ? (
                myHomes.map(home => (
                  <div key={home.id} className="my-home-item" onClick={() => navigate("/listing/" + home.id)}>
                    <ApartCard apartment={home} />
                  </div>
                ))
              ) : (
                <div className="no-listings">
                  <p>Még nem töltöttél fel hirdetést.</p>
                  <button className="apply-btn" onClick={() => navigate("/add")}>Hirdetés feladása</button>
                </div>
              )}
            </div>
          )}

          {activeTab === "favs" && (
            <div className="my-listings-grid">
              {favHomes.length > 0 ? (
                favHomes.map(home => (
                  <div key={home.id} className="my-home-item" onClick={() => navigate("/listing/" + home.id)}>
                    <ApartCard apartment={home} />
                  </div>
                ))
              ) : (
                <div className="no-listings">
                  <p>Még nincs kedvenc hirdetésed.</p>
                  <button className="apply-btn" onClick={() => navigate("/listings")}>Hirdetések böngészése</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* FIÓK TÖRLÉS MODAL */}
      {deleteModal && (
        <div className="delete-modal-overlay" onClick={() => setDeleteModal(false)}>
          <div className="delete-modal" onClick={e => e.stopPropagation()}>
            <div className="delete-modal-icon">
              <FaExclamationTriangle />
            </div>
            <h2>Fiók törlése</h2>
            <p className="delete-modal-desc">
              Biztosan törölni szeretné fiókját? Ez a művelet <strong>visszafordíthatatlan</strong>
            </p>

            <div className="delete-pw-field">
              <label>Jelszó megerősítése</label>
              <div className="delete-pw-wrapper">
                <input
                  type={showDeletePw ? "text" : "password"}
                  value={deletePassword}
                  onChange={e => setDeletePassword(e.target.value)}
                  placeholder="Add meg a jelszavad"
                  autoFocus
                />
                <button type="button" className="delete-pw-eye" onClick={() => setShowDeletePw(p => !p)}>
                  {showDeletePw ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="delete-modal-actions">

              <button
                className="delete-confirm-btn"
                onClick={handleDeleteConfirm}
                disabled={!deletePassword || deleteLoading}
              >
                {deleteLoading ? "Törlés..." : "Fiók  törlése"}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && <div className="loading-overlay"><div className="custom-spinner"></div></div>}
    </div>
  );
};