import React, { useState, useEffect, useContext } from 'react';
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { MyUserContext } from '../context/MyUserProvider';
import { Header } from '../components/Header';
import { readHomes } from '../myBackend'; // Beimportáljuk az olvasás függvényt
import { ApartCard } from '../components/ApartCard'; // Használjuk a már meglévő kártyát
import './UserProfile.css';

export const UserProfile = () => {
  const { user, photoUpdate, deleteAccount, deleteAvatar, msg } = useContext(MyUserContext);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [myHomes, setMyHomes] = useState([]); // Saját hirdetések állapota
  const navigate = useNavigate();

  // Saját hirdetések betöltése
  useEffect(() => {
    if (user) {
      const unsubscribe = readHomes((data) => {
        // Csak azokat tartjuk meg, amiket ez a felhasználó töltött fel
        const filtered = data.filter(home => home.uid === user.uid);
        setMyHomes(filtered);
      });
      return () => unsubscribe && typeof unsubscribe === 'function' && unsubscribe();
    }
  }, [user]);

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

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Biztos törölni szeretné a fiókját? Minden hirdetése elvész!")) {
      const pw = prompt("Add meg a jelszavad a fiók törléséhez!");
      if (pw) {
        setLoading(true);
        try {
          await deleteAvatar(user.uid);
          await deleteAccount(pw);
          navigate("/");
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    }
  };

  return (
    <div className="recipe-form-container">
      <Header />
      <IoClose onClick={() => navigate("/home")} className="close-icon" title="Vissza" />
      
      <h1 className="form-title">Profil Beállítások</h1>

      <div className="profile-layout">
        {/* BAL OLDAL: Profil adatok */}
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

          <button className='accDelBtn' onClick={handleDelete} disabled={loading}>
            Fiók törlése
          </button>
        </div>

        {/* JOBB OLDAL: Saját hirdetések */}
        <div className="my-listings-section">
          <h2>Saját hirdetéseim ({myHomes.length})</h2>
          <div className="my-listings-grid">
            {myHomes.length > 0 ? (
              myHomes.map(home => (
                <div key={home.id} className="my-home-item" onClick={() => navigate("/listing/" + home.id)}>
                  <ApartCard apartment={home} />
                  {/* Itt később elhelyezhetsz egy Törlés vagy Szerkesztés gombot is */}
                </div>
              ))
            ) : (
              <div className="no-listings">
                <p>Még nem töltöttél fel hirdetést.</p>
                <button className="apply-btn" onClick={() => navigate("/add")}>Hirdetés feladása</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {loading && <div className="loading-overlay"><div className="custom-spinner"></div></div>}
    </div>
  );
};