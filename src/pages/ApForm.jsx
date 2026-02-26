import React, { useState, useEffect, useContext } from "react";
import {
  FaPlus, FaImages, FaCloudUploadAlt, FaBed, FaDrawPolygon,
  FaMoneyBillWave, FaTools, FaHome, FaDog, FaSmoking, FaCar,
  FaThermometerHalf, FaMapMarkerAlt, FaCalendarAlt, FaAccessibleIcon, FaToilet,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { addHome, uploadToImgBB, readHome, updateHome, deleteGalleryImage } from "../myBackend";
import { MyUserContext } from "../context/MyUserProvider";
import { Header } from "../components/Header";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseApp";
import "./ApForm.css";

const getCoords = async (address) => {
  if (!address || address.length < 5) return null;
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
  try {
    const response = await fetch(url, { headers: { "User-Agent": "IngatlanApp/1.0" } });
    const data = await response.json();
    if (data && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), display: data[0].display_name };
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};

const DEFAULT_EXTRA_FIELDS = {
  buildYear: "", comfort: "", floor: "", buildingLevels: "", lift: "Nincs megadva",
  ceilingHeight: "", airConditioner: "Nincs megadva", furnished: "Nincs megadva",
  moveInDate: "", minRentTime: "", accessible: "Nincs megadva", bathroomWc: "",
  orientation: "", view: "", balconySize: "", gardenAccess: "Nincs megadva",
  attic: "Nincs megadva", equipped: "Nincs megadva", pets: "Nincs megadva",
  smoking: "Nincs megadva", parking: "", heating: "", insulation: "Nincs megadva",
  energyCert: "",
};

export const ApForm = () => {
  const { user } = useContext(MyUserContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [area, setArea] = useState("");
  const [rooms, setRooms] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Lakás");
  const [extraFields, setExtraFields] = useState(DEFAULT_EXTRA_FIELDS);

  const [thumbnailImg, setThumbnailImg] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [home, setHome] = useState(null);
  const [deletingIndex, setDeletingIndex] = useState(null);

  useEffect(() => {
    if (id) readHome(id, setHome);
  }, [id]);

  useEffect(() => {
    if (home) {
      setTitle(home.title || "");
      setAddress(home.address || "");
      setPrice(home.price || "");
      setArea(home.area || "");
      setRooms(home.rooms || "");
      setDescription(home.description || "");
      setCategory(home.category || "Lakás");
      setThumbnailPreview(home.thumbnail?.url || null);

      const loadedExtra = {};
      Object.keys(DEFAULT_EXTRA_FIELDS).forEach((key) => {
        loadedExtra[key] = home[key] ?? DEFAULT_EXTRA_FIELDS[key];
      });
      setExtraFields(loadedExtra);
    }
  }, [home]);

  const handleExtraChange = (e) => {
    const { name, value } = e.target;
    setExtraFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailImg(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const removeThumbnail = () => {
    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    setThumbnailImg(null);
    setThumbnailPreview(null);
    const fileInput = document.getElementById("thumbnail-input");
    if (fileInput) fileInput.value = "";
  };

  const handleGalleryChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeGalleryImage = (index) => {
    URL.revokeObjectURL(previews[index]);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExistingImage = async (imageObj, index) => {
    if (!window.confirm("Biztosan törlöd ezt a képet?")) return;
    setDeletingIndex(index);
    try {
      const updatedImages = await deleteGalleryImage(id, imageObj, home.images);
      setHome((prev) => ({ ...prev, images: updatedImages }));
    } catch (error) {
      alert("Hiba történt a törlés során!");
    } finally {
      setDeletingIndex(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("A hirdetés feladásához be kell jelentkezned!");
    if (!id && !thumbnailImg) return alert("Kérlek tölts fel borítóképet!");
    if (id && !home) return alert("Az ingatlan adatai még nem töltődtek be!");

    setLoading(true);

    try {
      // Kontakt adatok automatikus lekérése a user profiljából
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      const contactData = userDocSnap.exists() ? {
        contactName: userDocSnap.data().contactName || user.displayName || "",
        contactPhone: userDocSnap.data().contactPhone || "",
        contactEmail: userDocSnap.data().contactEmail || user.email || "",
        contactType: userDocSnap.data().contactType || "Magánszemély",
      } : {
        contactName: user.displayName || "",
        contactPhone: "",
        contactEmail: user.email || "",
        contactType: "Magánszemély",
      };

      const coords = await getCoords(address);
      if (!coords) {
        alert("Nem sikerült beazonosítani a címet!");
        return;
      }

      const finalExtraFields = {};
      Object.keys(extraFields).forEach((key) => {
        finalExtraFields[key] = extraFields[key] === "" ? "Nincs megadva" : extraFields[key];
      });

      const apartmentData = {
        title, address,
        lat: coords.lat, lon: coords.lon, fullAddress: coords.display,
        price: Number(price), area: Number(area), rooms: Number(rooms),
        description, category,
        ...finalExtraFields,
        ...contactData,
        thumbnail: home?.thumbnail || null,
        uid: user.uid,
      };

      if (id) {
        await updateHome(
          id,
          { ...apartmentData, images: home?.images || [] },
          thumbnailImg,
          files
        );
      } else {
        let finalThumbnail = null;
        if (thumbnailImg) finalThumbnail = await uploadToImgBB(thumbnailImg);

        let newGalleryImages = [];
        if (files.length > 0) {
          const results = await Promise.all(files.map((f) => uploadToImgBB(f)));
          newGalleryImages = results.filter((res) => res !== null);
        }

        await addHome({ ...apartmentData, thumbnail: finalThumbnail }, newGalleryImages);
      }

      navigate("/listings");

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
        <h1>
          <FaCloudUploadAlt /> {id ? "Hirdetés szerkesztése" : "Ingatlan hirdetés feladása"}
        </h1>
        <p>Töltse ki a részleteket a sikeres bérbeadáshoz</p>
      </div>

      <form className="property-form-card" onSubmit={handleSubmit}>

        <div className="form-section">
          <h3><FaHome /> Alapadatok</h3>
          <div className="form-group">
            <label>Hirdetés címe *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="pl. Modern garzon a Corvin negyedben" required />
          </div>
          <div className="form-group">
            <label><FaMapMarkerAlt /> Pontos cím *</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="pl. 1082 Budapest, Üllői út 25." required />
            <small style={{ color: "#666" }}>A pontos cím alapján számoljuk ki a távolságot az egyetemektől.</small>
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

        <div className="form-section">
          <h3><FaTools /> Műszaki jellemzők</h3>
          <div className="property-grid-inputs">
            <div className="input-group">
              <label>Építés éve</label>
              <input type="number" name="buildYear" value={extraFields.buildYear} onChange={handleExtraChange} />
            </div>
            <div className="input-group">
              <label>Emelet</label>
              <input type="text" name="floor" value={extraFields.floor} onChange={handleExtraChange} placeholder="pl. 2. emelet" />
            </div>
            <div className="input-group">
              <label>Épület szintjei</label>
              <input type="number" name="buildingLevels" value={extraFields.buildingLevels} onChange={handleExtraChange} />
            </div>
            <div className="input-group">
              <label>Energia tanúsítvány</label>
              <input type="text" name="energyCert" value={extraFields.energyCert} onChange={handleExtraChange} placeholder="pl. AA++" />
            </div>
          </div>
          <div className="property-grid-inputs">
            <div className="input-group">
              <label>Lift</label>
              <select name="lift" value={extraFields.lift} onChange={handleExtraChange}>
                <option value="Nincs megadva">Nincs megadva</option>
                <option value="Van">Van</option>
                <option value="Nincs">Nincs</option>
              </select>
            </div>
            <div className="input-group">
              <label><FaThermometerHalf /> Fűtés típusa</label>
              <input type="text" name="heating" value={extraFields.heating} onChange={handleExtraChange} />
            </div>
            <div className="input-group">
              <label>Szigetelés</label>
              <select name="insulation" value={extraFields.insulation} onChange={handleExtraChange}>
                <option value="Nincs megadva">Nincs megadva</option>
                <option value="Van">Van</option>
                <option value="Nincs">Nincs</option>
              </select>
            </div>
            <div className="input-group">
              <label>Tetőtér / Padlás</label>
              <select name="attic" value={extraFields.attic} onChange={handleExtraChange}>
                <option value="Nincs megadva">Nincs megadva</option>
                <option value="Beépített">Beépített</option>
                <option value="Nincs">Nincs</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Komfort és Felszereltség</h3>
          <div className="property-grid-inputs">
            <div className="input-group">
              <label><FaToilet /> Fürdő és WC</label>
              <input type="text" name="bathroomWc" value={extraFields.bathroomWc} onChange={handleExtraChange} placeholder="pl. Külön / Egyben" />
            </div>
            <div className="input-group">
              <label>Komfort fokozat</label>
              <input type="text" name="comfort" value={extraFields.comfort} onChange={handleExtraChange} />
            </div>
            <div className="input-group">
              <label><FaAccessibleIcon /> Akadálymentes</label>
              <select name="accessible" value={extraFields.accessible} onChange={handleExtraChange}>
                <option value="Nincs megadva">Nincs megadva</option>
                <option value="Igen">Igen</option>
                <option value="Nem">Nem</option>
              </select>
            </div>
          </div>
          <div className="property-grid-inputs">
            <div className="input-group">
              <label>Bútorozott</label>
              <select name="furnished" value={extraFields.furnished} onChange={handleExtraChange}>
                <option value="Nincs megadva">Nincs megadva</option>
                <option value="Igen">Igen</option>
                <option value="Nem">Nem</option>
              </select>
            </div>
            <div className="input-group">
              <label>Gépesített</label>
              <select name="equipped" value={extraFields.equipped} onChange={handleExtraChange}>
                <option value="Nincs megadva">Nincs megadva</option>
                <option value="Igen">Igen</option>
                <option value="Nem">Nem</option>
              </select>
            </div>
            <div className="input-group">
              <label>Légkondicionáló</label>
              <select name="airConditioner" value={extraFields.airConditioner} onChange={handleExtraChange}>
                <option value="Nincs megadva">Nincs megadva</option>
                <option value="Van">Van</option>
                <option value="Nincs">Nincs</option>
              </select>
            </div>
          </div>
          <div className="property-grid-inputs">
            <div className="input-group">
              <label>Kilátás</label>
              <input type="text" name="view" value={extraFields.view} onChange={handleExtraChange} />
            </div>
            <div className="input-group">
              <label>Tájolás</label>
              <input type="text" name="orientation" value={extraFields.orientation} onChange={handleExtraChange} />
            </div>
            <div className="input-group">
              <label>Erkély mérete (m²)</label>
              <input type="number" name="balconySize" value={extraFields.balconySize} onChange={handleExtraChange} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Házirend és Bérlés</h3>
          <div className="property-grid-inputs">
            <div className="input-group">
              <label><FaCalendarAlt /> Beköltözhető ekkortól</label>
              <input type="date" name="moveInDate" value={extraFields.moveInDate} onChange={handleExtraChange} />
            </div>
            <div className="input-group">
              <label>Min. bérleti idő</label>
              <input type="text" name="minRentTime" value={extraFields.minRentTime} onChange={handleExtraChange} placeholder="pl. 1 év" />
            </div>
            <div className="input-group">
              <label><FaDog /> Kisállat hozható?</label>
              <select name="pets" value={extraFields.pets} onChange={handleExtraChange}>
                <option value="Nincs megadva">Nincs megadva</option>
                <option value="Igen">Igen</option>
                <option value="Nem">Nem</option>
              </select>
            </div>
          </div>
          <div className="property-grid-inputs">
            <div className="input-group">
              <label><FaSmoking /> Dohányzás</label>
              <select name="smoking" value={extraFields.smoking} onChange={handleExtraChange}>
                <option value="Nincs megadva">Nincs megadva</option>
                <option value="Megengedett">Megengedett</option>
                <option value="Tilos">Tilos</option>
              </select>
            </div>
            <div className="input-group">
              <label><FaCar /> Parkolás</label>
              <input type="text" name="parking" value={extraFields.parking} onChange={handleExtraChange} placeholder="pl. Utcai / Garázs" />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Leírás és Média</h3>
          <div className="form-group full-width">
            <label>Részletes bemutatás *</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="5" required />
          </div>

          <div className="media-section">
            <label className="media-label">Borítókép {!id && "*"}</label>
            <div className="thumbnail-area">
              {thumbnailPreview ? (
                <div className="preview-wrapper">
                  <img src={thumbnailPreview} className="thumbnail-preview" alt="Borítókép" />
                  <button type="button" className="remove-img-btn" onClick={removeThumbnail}>
                    <IoClose size={16} />
                  </button>
                </div>
              ) : (
                <label className="custom-file-btn" htmlFor="thumbnail-input">
                  <FaCloudUploadAlt /> Borítókép feltöltése
                </label>
              )}
              <input id="thumbnail-input" type="file" accept="image/*" onChange={handleThumbnailChange} style={{ display: "none" }} />
            </div>
          </div>

          <div className="media-section">
            <label className="media-label">
              <FaImages /> Galéria{" "}
              {id && <span className="media-hint">(új képek hozzáadása a meglévőkhöz)</span>}
            </label>
            <label className="custom-file-btn" htmlFor="gallery-input">
              <FaPlus /> Képek hozzáadása
            </label>
            <input id="gallery-input" type="file" multiple accept="image/*" onChange={handleGalleryChange} style={{ display: "none" }} />

            {id && home?.images?.length > 0 && (
              <>
                <p className="gallery-section-title">Jelenlegi képek ({home.images.length} db):</p>
                <div className="gallery-grid">
                  {home.images.map((img, index) => (
                    <div className="gallery-item" key={index}>
                      <img src={img.url} alt={`Kép ${index + 1}`} />
                      <button
                        type="button"
                        className={`remove-img-btn ${deletingIndex === index ? "deleting" : ""}`}
                        onClick={() => handleDeleteExistingImage(img, index)}
                        disabled={deletingIndex === index}
                      >
                        {deletingIndex === index ? "..." : <IoClose size={14} />}
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {previews.length > 0 && (
              <>
                <p className="gallery-section-title">Új képek ({previews.length} db):</p>
                <div className="gallery-grid">
                  {previews.map((src, index) => (
                    <div className="gallery-item" key={index}>
                      <img src={src} alt={`Új kép ${index + 1}`} />
                      <button type="button" className="remove-img-btn" onClick={() => removeGalleryImage(index)}>
                        <IoClose size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <button className="submit-btn" disabled={loading}>
          {loading ? "Feltöltés folyamatban..." : id ? "Módosítások mentése" : "Hirdetés közzététele"}
        </button>
      </form>

      {loading && <div className="loading-overlay">Loading…</div>}
    </div>
  );
};