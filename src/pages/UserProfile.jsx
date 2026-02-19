import React, { useState, useContext } from 'react'; // Tisztább import
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { MyUserContext } from '../context/MyUserProvider';
import { Header } from '../components/Header';

export const UserProfile = () => {
  // msg hozzáadva, hogy lásd mi történik!
  const { user, photoUpdate, deleteAccount, deleteAvatar, msg } = useContext(MyUserContext);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    
    setLoading(true);
    try {
      await photoUpdate(file);
      setFile(null); // Feltöltés után ürítjük
      setPreview(null);
    } catch (error) {
      console.error("Feltöltési hiba a komponensben:", error);
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
    if (window.confirm("Biztos törölni szeretné a fiókját?")) {
      const pw = prompt("Add meg a jelszavad a fiók törléséhez!");
      if (pw) {
        setLoading(true);
        try {
          // Előbb a képet/adatokat töröljük, aztán az auth-ot
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
    <div className="recipe-form-container" style={{ position: "relative" }}>
        <Header />
      <h1 className="form-title">Profil</h1>

      <form className="recipe-card" style={{ overflowWrap: "break-word" }} onSubmit={handleSubmit}>
        <h3>Felhasználónév: {user?.displayName}</h3>
        <p>Email cím: {user?.email}</p>

        {/* Visszajelzés a felhasználónak */}
        {msg?.err && <p style={{ color: "red", textAlign: "center" }}>{msg.err}</p>}
        {msg?.updateProfile && <p style={{ color: "green", textAlign: "center" }}>{msg.updateProfile}</p>}

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
          {user?.photoURL && !preview && (
            <img src={user.photoURL} style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover" }} alt="profilkep" />
          )}
          
          <label style={{ textDecoration: "underline", cursor: "pointer" }}>
            Új profilkép választása:
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
          </label>

          {preview && (
            <div style={{ textAlign: "center" }}>
              <p>Előnézet:</p>
              <img src={preview} style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover" }} alt="előnézet" />
            </div>
          )}
        </div>

        <button className="save-btn" disabled={loading || !file} type="submit">
          {loading ? "Mentés..." : "Mentés"}
        </button>
      </form>

      <button 
        style={{ position: "fixed", bottom: "10px", right: "10px", cursor: "pointer" }} 
        className='accDelBtn' 
        onClick={handleDelete}
        disabled={loading}
      >
        Fiók Törlése
      </button>

      {loading && <div className="loading-overlay">Folyamatban...</div>}
      
      <IoClose onClick={() => navigate("/recipes")} className="close-icon" title="Vissza" />
    </div>
  );
};