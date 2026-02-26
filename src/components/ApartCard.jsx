import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdCameraAlt, MdLocationOn } from "react-icons/md";
import { MdDeleteForever, MdModeEditOutline } from "react-icons/md";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { MyUserContext } from "../context/MyUserProvider";
import { deleteHome } from "../myBackend";
import { useFavourites } from "../useFavourites";
import './ApartCard.css';

export const ApartCard = ({ apartment }) => {
  const { user } = useContext(MyUserContext);
  const navigate = useNavigate();
  const { toggle, isFav } = useFavourites();

  const { 
    id, title, price, area, rooms,
    thumbnail, images, category,
    floor, address, fullAddress, uid 
  } = apartment;

  const fav = isFav(id);

  const getDistrict = (addr, fullAddr) => {
    const textToSearch = fullAddr || addr || "";
    if (!textToSearch) return "";
    const parts = textToSearch.split(',').map(p => p.trim());
    const districtPart = parts.find(p => p.toLowerCase().includes('kerület'));
    if (districtPart) return districtPart;
    const zipMatch = textToSearch.match(/1(\d{2})\d/);
    if (zipMatch) {
      const districtNum = parseInt(zipMatch[1], 10);
      const romanDistricts = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI", "XXII", "XXIII"];
      return districtNum > 0 && districtNum <= 23 ? `${romanDistricts[districtNum - 1]}. kerület` : "";
    }
    return "";
  };

  const district = getDistrict(address, fullAddress);
  const stopNav = (e) => e.stopPropagation();

  const handleDelete = async (e) => {
    stopNav(e);
    if (window.confirm("Biztosan törölni szeretnéd ezt a hirdetést?")) {
      try {
        await deleteHome(id, thumbnail?.delete_url, images);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleFav = (e) => {
    stopNav(e);
    toggle(id);
  };

  return (
    <div className="ingatlan-card" onClick={() => navigate("/listing/" + id)}>
      <div className="card-image-wrapper">
        <img 
          src={thumbnail?.url || 'https://via.placeholder.com/400x300'} 
          alt={title} 
          className="main-image"
        />
        
        {category && <div className="badge-new">{category}</div>}

        <div className="image-count-badge">
            <MdCameraAlt className="cam-icon" />
          <span>{(images?.length || 0) + (thumbnail ? 1 : 0)}</span>
        </div>
      </div>

      <div className="card-info">
        <div className="card-header">
          <div className="price-tag">
            {price ? `${Number(price).toLocaleString()} Ft/hó` : "Ár nincs megadva"}
          </div>
          
          <div className="card-actions-area" onClick={stopNav}>
            {user && user.uid === uid ? (
              <div className="rc-actions-inline">
                <button
                  className="rc-icon-mini rc-edit"
                  onClick={(e) => { stopNav(e); navigate("/edit/" + id); }}
                  title="Szerkesztés"
                >
                <MdModeEditOutline size={20} />

                </button>
                <button className="rc-icon-mini rc-delete" onClick={handleDelete} title="Törlés">
                  <MdDeleteForever size={20} />
                </button>
              </div>
            ) : (
              // Csak bejelentkezett, nem saját hirdetésnél jelenik meg
              user && (
                <button
                  className={`fav-btn ${fav ? "active" : ""}`}
                  onClick={handleFav}
                  title={fav ? "Eltávolítás a kedvencekből" : "Hozzáadás a kedvencekhez"}
                >
                  {fav ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
                </button>
              )
            )}
          </div>
        </div>

        <div className="address-section">
          {district && <div className="district-badge">{district}</div>}
          <h3 className="apartment-title">
<MdLocationOn className="loc-icon" />

            {address || "Cím nélküli hirdetés"}
          </h3>
          {floor && floor !== "Nincs megadva" && (
            <span className="floor-info">{floor}</span>
          )}
        </div>

        <div className="specs-row">
          <div className="spec-item">
            <span className="spec-label">Alapterület</span>
            <span className="spec-value">{area || 0} m²</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Szobák</span>
            <span className="spec-value">{rooms || 0}</span>
          </div>
          {apartment.bathroomWc && apartment.bathroomWc !== "Nincs megadva" && (
            <div className="spec-item">
              <span className="spec-label">WC/Fürdő</span>
              <span className="spec-value">{apartment.bathroomWc}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};