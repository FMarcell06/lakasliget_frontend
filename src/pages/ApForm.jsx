import React, { useState, useEffect } from 'react';
import { FaPlus, FaImages, FaCloudUploadAlt, FaBed, FaDrawPolygon, FaEuroSign } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import { addHome, uploadToImgBB, updateRecipe } from '../myBackend'; // A függvénynevek maradhatnak, de a tartalom lakás lesz
import { useContext } from 'react';
import { MyUserProvider } from '../context/MyUserProvider';
import { Header } from '../components/Header';

export const ApForm = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [area, setArea] = useState("");
  const [rooms, setRooms] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Lakás"); // Alapértelmezett kategória
  
  // Képek kezelése
  const [thumbnailImg, setThumbnailImg] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, text: "", type: "" });
  
  const navigate = useNavigate();
  const { id } = useParams();

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailImg(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Thumbnail feltöltése
      let finalThumbnail = null;
      if (thumbnailImg) finalThumbnail = await uploadToImgBB(thumbnailImg);

      // 2. Galéria feltöltése
      let newGalleryImages = [];
      const actualGalleryFiles = files.filter(f => f instanceof File);
      if (actualGalleryFiles.length > 0) {
        const results = await Promise.all(actualGalleryFiles.map(f => uploadToImgBB(f)));
        newGalleryImages = results.filter(res => res !== null);
      }

      const apartmentData = { 
        title, 
        price: Number(price), 
        area: Number(area), 
        rooms: Number(rooms), 
        description, 
        category,
        thumbnail: finalThumbnail,
        uid: "user_id_itt" 
      };

      await addHome(apartmentData, newGalleryImages);

      setToast({ visible: true, text: "Hirdetés sikeresen feladva!", type: "success" });
      setTimeout(() => navigate("/home"), 1500);

    } catch (error) {
      setToast({ visible: true, text: "Hiba történt a mentés során!", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="property-form-container">
        <Header />
      <div className="form-header">
        <h1><FaCloudUploadAlt /> Ingatlan hirdetés feladása</h1>
        <p>Töltse ki az adatokat a sikeres értékesítéshez</p>
      </div>

      <form className="property-form-card" onSubmit={handleSubmit}>
        
        {/* Fő cím */}
        <div className="form-section">
          <label>Hirdetés címe</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="pl. Modern, felújított garzon a belvárosban" required />
        </div>

        {/* Paraméterek rácsban */}
        <div className="property-grid-inputs">
          <div className="input-group">
            <label><FaEuroSign /> Ár (Ft)</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Ár" required />
          </div>
          <div className="input-group">
            <label><FaDrawPolygon /> Alapterület (m²)</label>
            <input type="number" value={area} onChange={(e) => setArea(e.target.value)} placeholder="m2" required />
          </div>
          <div className="input-group">
            <label><FaBed /> Szobák száma</label>
            <input type="number" value={rooms} onChange={(e) => setRooms(e.target.value)} placeholder="Szobák" required />
          </div>
        </div>

        {/* Kategória választó */}
        <div className="form-section">
          <label>Ingatlan típusa</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Lakás">Lakás</option>
            <option value="Ház">Családi ház</option>
            <option value="Telek">Telek</option>
            <option value="Iroda">Iroda</option>
          </select>
        </div>

        {/* Borítókép feltöltése */}
        <div className="upload-box main-upload">
          <label className="upload-label">Kiemelt borítókép (Ezt látják először)</label>
          <input type="file" accept="image/*" onChange={handleThumbnailChange} />
          {thumbnailPreview && <img src={thumbnailPreview} className="thumbnail-preview" alt="Preview" />}
        </div>

        {/* Leírás */}
        <div className="form-section">
          <label>Részletes leírás</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Írja le az ingatlan előnyeit, környékét..." rows="6" required />
        </div>

        {/* Galéria feltöltése */}
        <div className="upload-box gallery-upload">
          <label className="upload-label"><FaImages /> További fotók (Galéria)</label>
          <input type="file" accept="image/*" multiple onChange={handleGalleryChange} />
          <div className="gallery-previews">
            {previews.map((src, index) => (
              <img key={index} src={src} alt="Galéria" />
            ))}
          </div>
        </div>

        <button className="submit-btn" disabled={loading}>
          {loading ? "Feltöltés..." : "Hirdetés közzététele"}
        </button>
      </form>
    </div>
  );
};