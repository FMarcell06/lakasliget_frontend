import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FavoriteBorder, CameraAltOutlined, LocationOnOutlined } from '@mui/icons-material';
import { MdDeleteForever, MdModeEditOutline } from "react-icons/md";
import { MyUserContext } from "../context/MyUserProvider";
import { deleteHome } from "../myBackend";
import './ApartCard.css';

export const ApartCard = ({ apartment }) => {
  const { user } = useContext(MyUserContext);
  const navigate = useNavigate();

  const { 
    id, 
    title,
    price, 
    area,
    rooms,
    thumbnail, 
    images, 
    category,
    floor,
    address,
    fullAddress, // Vedd fel a destructuring-be!
    uid 
  } = apartment;

  // KERÜLET KINYERÉSE (ugyanaz a logika, mint a Listing-nél)
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
          <CameraAltOutlined className="cam-icon" />
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
                <button className="rc-icon-mini rc-edit" onClick={(e) => { stopNav(e); navigate("/edit/" + id); }} title="Szerkesztés">
                  <MdModeEditOutline size={20} />
                </button>
                <button className="rc-icon-mini rc-delete" onClick={handleDelete} title="Törlés">
                  <MdDeleteForever size={20} />
                </button>
              </div>
            ) : (
              <button className="fav-button">
                <FavoriteBorder />
              </button>
            )}
          </div>
        </div>

        <div className="address-section">
          {/* KERÜLET MEGJELENÍTÉSE A CÍM FELETT VAGY MELLETT */}
          {district && <div className="district-badge">{district}</div>}
          
          <h3 className="apartment-title">
            <LocationOnOutlined className="loc-icon" />
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