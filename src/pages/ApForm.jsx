import React, { useState, useEffect, useContext } from 'react';
import { 
  FaPlus, FaImages, FaCloudUploadAlt, FaBed, FaDrawPolygon, 
  FaMoneyBillWave, FaTools, FaHome, FaDog, FaSmoking, FaCar, FaThermometerHalf 
} from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import { addHome, uploadToImgBB } from '../myBackend'; 
import { MyUserContext } from '../context/MyUserProvider';
import { Header } from '../components/Header';
import './ApForm.css';

export const ApForm = () => {
  const { user } = useContext(MyUserContext);
  const navigate = useNavigate();

  // Alapadatok állapota
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [area, setArea] = useState("");
  const [rooms, setRooms] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Lakás");

  // Részletes technikai mezők állapota
  const [extraFields, setExtraFields] = useState({
    buildYear: "", comfort: "", floor: "", buildingLevels: "", lift: "Nincs megadva",
    ceilingHeight: "", airConditioner: "Nincs megadva", furnished: "Nincs megadva",
    moveInDate: "", minRentTime: "", accessible: "Nincs megadva", bathroomWc: "",
    orientation: "", view: "", balconySize: "", gardenAccess: "Nincs megadva",
    attic: "Nincs megadva", equipped: "Nincs megadva", pets: "Nincs megadva",
    smoking: "Nincs megadva", parking: "", heating: "", insulation: "Nincs megadva",
    energyCert: ""
  });

  // Média állapota
  const [thumbnailImg, setThumbnailImg] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Kezelőfüggvények
  const handleExtraChange = (e) => {
    const { name, value } = e.target;
    setExtraFields(prev => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailImg(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const removeThumbnail = () => {
  if (thumbnailPreview) {
    URL.revokeObjectURL(thumbnailPreview); // Memória felszabadítása
  }
  setThumbnailImg(null);
  setThumbnailPreview(null);
  // Reseteljük az input mezőt is, hogy ugyanazt a képet újra ki lehessen választani
  const fileInput = document.getElementById('thumbnail-input');
  if (fileInput) fileInput.value = "";
};

  const handleGalleryChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeGalleryImage = (index) => {
    URL.revokeObjectURL(previews[index]);
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("A hirdetés feladásához be kell jelentkezned!");
    setLoading(true);

    try {
      // 1. Kiemelt kép feltöltése
      let finalThumbnail = null;
      if (thumbnailImg) finalThumbnail = await uploadToImgBB(thumbnailImg);

      // 2. Galéria feltöltése
      let newGalleryImages = [];
      if (files.length > 0) {
        const results = await Promise.all(files.map(f => uploadToImgBB(f)));
        newGalleryImages = results.filter(res => res !== null);
      }

      // Üres extra mezők kitöltése alapértelmezett értékkel
      const finalExtraFields = {};
      Object.keys(extraFields).forEach(key => {
        finalExtraFields[key] = extraFields[key] === "" ? "Nincs megadva" : extraFields[key];
      });

      const apartmentData = { 
        title, 
        price: Number(price), 
        area: Number(area), 
        rooms: Number(rooms), 
        description, 
        category,
        ...finalExtraFields,
        thumbnail: finalThumbnail,
        uid: user.uid, 
      };

      await addHome(apartmentData, newGalleryImages);
      navigate("/home");

    } catch (error) {
      console.error(error);
      alert("Hiba történt a mentés során!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="property-form-container">
      <Header />
      <div className="form-header">
        <h1><FaCloudUploadAlt /> Ingatlan hirdetés feladása</h1>
        <p>Töltse ki a részleteket a sikeres bérbeadáshoz</p>
      </div>

      <form className="property-form-card" onSubmit={handleSubmit}>
        
        {/* 1. SZEKCIÓ: ALAPOK */}
        <div className="form-section">
          <h3><FaHome /> Alapadatok</h3>
          <div className="form-group">
            <label>Hirdetés címe *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="pl. Modern garzon a Corvin negyedben" required />
          </div>
          <div className="property-grid-inputs">
            <div className="input-group">
              <label><FaMoneyBillWave /> Havi bérleti díj (Ft)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div className="input-group">
              <label><FaDrawPolygon /> Alapterület (m²)</label>
              <input type="number" value={area} onChange={(e) => setArea(e.target.value)} required />
            </div>
            <div className="input-group">
              <label><FaBed /> Szobák száma</label>
              <input type="number" value={rooms} onChange={(e) => setRooms(e.target.value)} required />
            </div>
          </div>
        </div>

        {/* 2. SZEKCIÓ: MŰSZAKI PARAMÉTEREK */}
        <div className="form-section">
          <h3><FaTools /> Műszaki jellemzők</h3>
          <div className="property-grid-inputs">
            <div className="input-group">
              <label>Építés éve</label>
              <input type="number" name="buildYear" onChange={handleExtraChange} />
            </div>
            <div className="input-group">
              <label>Emelet</label>
              <input type="text" name="floor" onChange={handleExtraChange} placeholder="pl. 2. emelet" />
            </div>
            <div className="input-group">
              <label>Épület szintjei</label>
              <input type="number" name="buildingLevels" onChange={handleExtraChange} />
            </div>
            <div className="input-group">
              <label>Belmagasság (m)</label>
              <input type="text" name="ceilingHeight" onChange={handleExtraChange} />
            </div>
          </div>

          <div className="property-grid-inputs">
            <div className="input-group">
              <label>Lift</label>
              <select name="lift" onChange={handleExtraChange}>
                <option value="Nincs megadva">Nincs megadva</option>
                <option value="Van">Van</option>
                <option value="Nincs">Nincs</option>
              </select>
            </div>
            <div className="input-group">
              <label><FaThermometerHalf /> Fűtés típusa</label>
              <input type="text" name="heating" onChange={handleExtraChange} placeholder="pl. Házközponti" />
            </div>
            <div className="input-group">
              <label>Szigetelés</label>
              <select name="insulation" onChange={handleExtraChange}>
                <option value="Nincs megadva">Nincs megadva</option>
                <option value="Van">Van</option>
                <option value="Nincs">Nincs</option>
              </select>
            </div>
            <div className="input-group">
              <label>Légkondicionáló</label>
              <select name="airConditioner" onChange={handleExtraChange}>
                <option value="Nincs megadva">Nincs megadva</option>
                <option value="Van">Van</option>
                <option value="Nincs">Nincs</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. SZEKCIÓ: KÉNYELEM ÉS EXTRÁK */}
        <div className="form-section">
          <h3>Komfort és Felszereltség</h3>
          <div className="property-grid-inputs">
            <div className="input-group">
              <label>Komfort</label>
              <input type="text" name="comfort" onChange={handleExtraChange} placeholder="pl. Összkomfortos" />
            </div>
            <div className="input-group">
              <label>Bútorozott</label>
              <select name="furnished" onChange={handleExtraChange}>
                <option value="Nincs megadva">Nincs megadva</option>
                <option value="Igen">Igen</option>
                <option value="Nem">Nem</option>
                <option value="Részben">Részben</option>
              </select>
            </div>
            <div className="input-group">
              <label>Gépesített</label>
              <select name="equipped" onChange={handleExtraChange}>
                <option value="Nincs megadva">Nincs megadva</option>
                <option value="Igen">Igen</option>
                <option value="Nem">Nem</option>
              </select>
            </div>
          </div>

          <div className="property-grid-inputs">
            <div className="input-group">
                <label>Kilátás</label>
                <input type="text" name="view" onChange={handleExtraChange} placeholder="pl. Utcai / Kerti" />
            </div>
            <div className="input-group">
                <label>Tájolás</label>
                <input type="text" name="orientation" onChange={handleExtraChange} />
            </div>
            <div className="input-group">
                <label>Erkély mérete (m²)</label>
                <input type="number" name="balconySize" onChange={handleExtraChange} />
            </div>
            <div className="input-group">
                <label>Kertkapcsolatos</label>
                <select name="gardenAccess" onChange={handleExtraChange}>
                    <option value="Nincs megadva">Nincs megadva</option>
                    <option value="Igen">Igen</option>
                    <option value="Nem">Nem</option>
                </select>
            </div>
          </div>
        </div>

        {/* 4. SZEKCIÓ: SZABÁLYOK ÉS ÉLETMÓD */}
        <div className="form-section">
          <h3>Házirend és Bérlés</h3>
          <div className="property-grid-inputs">
            <div className="input-group">
              <label><FaDog /> Kisállat hozható?</label>
              <select name="pets" onChange={handleExtraChange}>
                <option value="Nincs megadva">Nincs megadva</option>
                <option value="Igen">Igen</option>
                <option value="Nem">Nem</option>
              </select>
            </div>
            <div className="input-group">
              <label><FaSmoking /> Dohányzás</label>
              <select name="smoking" onChange={handleExtraChange}>
                <option value="Nincs megadva">Nincs megadva</option>
                <option value="Megengedett">Megengedett</option>
                <option value="Tilos">Tilos</option>
              </select>
            </div>
            <div className="input-group">
                <label>Min. bérleti idő</label>
                <input type="text" name="minRentTime" onChange={handleExtraChange} placeholder="pl. 1 év" />
            </div>
            <div className="input-group">
              <label><FaCar /> Parkolás</label>
              <input type="text" name="parking" onChange={handleExtraChange} placeholder="pl. Utcai / Teremgarázs" />
            </div>
          </div>
        </div>

        {/* 5. SZEKCIÓ: LEÍRÁS ÉS FOTÓK */}
        <div className="form-section">
          <h3>Leírás és Média</h3>
          <div className="form-group full-width">
            <label>Részletes bemutatás *</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="5" required />
          </div>

          <div className="upload-grid">
<div className="upload-box">
    <label className="upload-label">Borítókép *</label>
    <input 
      id="thumbnail-input" // Fontos az azonosító a reseteléshez
      type="file" 
      accept="image/*"
      onChange={handleThumbnailChange} 
    />
    
    {thumbnailPreview && (
        <div className="main-preview-container" style={{ position: 'relative', marginTop: '10px' }}>
            <img src={thumbnailPreview} className="preview-small" alt="Fő kép" />
            <button 
                type="button" 
                className="delete-preview-btn" 
                style={{ top: '-5px', right: '-5px' }} // Pozicionálás a kép sarkára
                onClick={removeThumbnail}
            >
                <IoClose size={14} />
            </button>
        </div>
    )}
</div>

            <div className="upload-box">
                <label className="upload-label"><FaImages /> Galéria</label>
                <input type="file" multiple onChange={handleGalleryChange} />
                
                <div className="gallery-preview-container">
                    {previews.length > 0 && (
                        <div className="mini-previews-grid">
                            {previews.map((url, index) => (
                                <div key={index} className="preview-item">
                                    <img src={url} alt={`Galéria ${index}`} className="preview-small" />
                                    <button type="button" className="delete-preview-btn" onClick={() => removeGalleryImage(index)}>
                                        <IoClose size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="image-count-footer">
                        {previews.length} kép kiválasztva
                    </div>
                </div>
            </div>
          </div>
        </div>

        <button className="submit-btn" disabled={loading}>
          {loading ? "Feltöltés folyamatban..." : "Hirdetés közzététele"}
        </button>
      </form>
    </div>
  );
};