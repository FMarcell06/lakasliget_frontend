import React, { useState, useEffect, useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { MyUserContext } from '../context/MyUserProvider';
import { collection, getDocs, doc, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebaseApp';
import { deleteImage } from '../cloudinaryUtils';
import {
  MdSearch, MdDelete, MdEdit, MdVisibility, MdVisibilityOff,
  MdAdminPanelSettings, MdPerson, MdHome, MdClose, MdSave, MdNoPhotography
} from 'react-icons/md';
import { FaHome, FaUsers, FaPhone, FaEnvelope, FaUser, FaBuilding } from 'react-icons/fa';
import './Admin.css';

export const Admin = () => {
  const { user, isAdmin } = useContext(MyUserContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("listings");
  const [listings, setListings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchListings, setSearchListings] = useState("");
  const [searchUsers, setSearchUsers] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userListings, setUserListings] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  if (!isAdmin) return <Navigate to="/" />;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const listingsSnap = await getDocs(query(collection(db, "apartments"), orderBy("timestamp", "desc")));
        setListings(listingsSnap.docs.map(d => ({ ...d.data(), id: d.id })));
        const usersSnap = await getDocs(collection(db, "users"));
        setUsers(usersSnap.docs.map(d => ({ ...d.data(), id: d.id })));
      } catch (err) {
        console.error("Betöltési hiba:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // --- HIRDETÉS MŰVELETEK ---
  const handleDeleteListing = async (id) => {
    if (!window.confirm("Biztosan törölni szeretnéd ezt a hirdetést?")) return;
    try {
      await deleteDoc(doc(db, "apartments", id));
      setListings(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      console.error("Törlési hiba:", err);
    }
  };

  const handleToggleVisibility = async (listing) => {
    try {
      const newVal = !listing.hidden;
      await updateDoc(doc(db, "apartments", listing.id), { hidden: newVal });
      setListings(prev => prev.map(l => l.id === listing.id ? { ...l, hidden: newVal } : l));
    } catch (err) {
      console.error("Láthatóság hiba:", err);
    }
  };

  // --- FELHASZNÁLÓ MŰVELETEK ---
  const handleToggleAdmin = async (u) => {
    try {
      const newVal = !u.isAdmin;
      await updateDoc(doc(db, "users", u.id), { isAdmin: newVal });
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, isAdmin: newVal } : x));
    } catch (err) {
      console.error("Admin hiba:", err);
    }
  };

  const handleDeleteUser = async (u) => {
    if (!window.confirm(`Biztosan törölni szeretnéd ${u.contactName || u.id} felhasználót?`)) return;
    try {
      await deleteDoc(doc(db, "users", u.id));
      setUsers(prev => prev.filter(x => x.id !== u.id));
    } catch (err) {
      console.error("Törlési hiba:", err);
    }
  };

  const handleDeleteAvatar = async (u) => {
    if (!window.confirm(`Biztosan törölni szeretnéd ${u.contactName || "a felhasználó"} profilképét?`)) return;
    try {
      // 1. Cloudinary-ról törlés
      if (u.public_id) await deleteImage(u.public_id);
      // 2. Firestore-ból avatarUrl és public_id törlése
      await updateDoc(doc(db, "users", u.id), { avatarUrl: null, public_id: null });
      // 3. Helyi state frissítése
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, avatarUrl: null, public_id: null } : x));
      // Ha a szerkesztő modal nyitva van, azt is frissítjük
      if (editUser?.id === u.id) setEditUser(prev => ({ ...prev, avatarUrl: null, public_id: null }));
    } catch (err) {
      console.error("Avatar törlési hiba:", err);
    }
  };

  const handleViewUser = (u) => {
    setSelectedUser(u);
    setUserListings(listings.filter(l => l.uid === u.id));
  };

  const handleEditUser = (u) => {
    setEditUser(u);
    setEditForm({
      contactName: u.contactName || "",
      contactEmail: u.contactEmail || "",
      contactPhone: u.contactPhone || "",
      contactType: u.contactType || "Magánszemély",
    });
  };

  const handleSaveUser = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", editUser.id), { ...editForm });
      setUsers(prev => prev.map(x => x.id === editUser.id ? { ...x, ...editForm } : x));
      setEditUser(null);
    } catch (err) {
      console.error("Mentési hiba:", err);
    } finally {
      setSaving(false);
    }
  };

  // --- SZŰRÉS ---
  const filteredListings = listings.filter(l =>
    l.title?.toLowerCase().includes(searchListings.toLowerCase()) ||
    l.address?.toLowerCase().includes(searchListings.toLowerCase()) ||
    l.contactName?.toLowerCase().includes(searchListings.toLowerCase())
  );

  const filteredUsers = users.filter(u =>
    u.contactName?.toLowerCase().includes(searchUsers.toLowerCase()) ||
    u.contactEmail?.toLowerCase().includes(searchUsers.toLowerCase()) ||
    u.id?.toLowerCase().includes(searchUsers.toLowerCase())
  );

  return (
    <div className="admin-page">
      <Header />
      <main className="admin-container">
        <div className="admin-header">
          <h1><MdAdminPanelSettings /> Admin Panel</h1>
          <div className="admin-stats">
            <div className="stat-box"><FaHome /><span>{listings.length} hirdetés</span></div>
            <div className="stat-box"><FaUsers /><span>{users.length} felhasználó</span></div>
          </div>
        </div>

        <div className="admin-tabs">
          <button className={`admin-tab ${activeTab === "listings" ? "active" : ""}`} onClick={() => setActiveTab("listings")}>
            <FaHome /> Hirdetések ({listings.length})
          </button>
          <button className={`admin-tab ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
            <FaUsers /> Felhasználók ({users.length})
          </button>
        </div>

        {loading ? (
          <div className="admin-loader">
            <div className="custom-spinner"></div>
            <p>Adatok betöltése...</p>
          </div>
        ) : (
          <>
            {/* HIRDETÉSEK TAB */}
            {activeTab === "listings" && (
              <div className="admin-section">
                <div className="admin-search">
                  <MdSearch className="search-icon" />
                  <input type="text" placeholder="Keresés cím vagy hirdető neve alapján..." value={searchListings} onChange={e => setSearchListings(e.target.value)} />
                </div>
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Kép</th><th>Cím</th><th>Hirdető</th><th>Ár</th><th>Műveletek</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredListings.map(listing => (
                        <tr key={listing.id} className={listing.hidden ? "row-hidden" : ""}>
                          <td><img src={listing.thumbnail?.url || "https://via.placeholder.com/60x40"} alt={listing.title} className="admin-thumb" /></td>
                          <td>
                            <div className="listing-title-cell">
                              <span className="listing-name">{listing.title || "Névtelen"}</span>
                              <span className="listing-address">{listing.address}</span>
                            </div>
                          </td>
                          <td>
                            <div className="listing-contact-cell">
                              <span>{listing.contactName || "—"}</span>
                              <span className="listing-phone">{listing.contactPhone || ""}</span>
                            </div>
                          </td>
                          <td className="price-cell">{listing.price ? `${Number(listing.price).toLocaleString()} Ft` : "—"}</td>
                          <td>
                            <div className="action-btns">
                              <button className="action-btn edit" onClick={() => navigate("/edit/" + listing.id)} title="Szerkesztés"><MdEdit /></button>
                              <button className="action-btn delete" onClick={() => handleDeleteListing(listing.id)} title="Törlés"><MdDelete /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredListings.length === 0 && <div className="empty-state">Nincs találat.</div>}
                </div>
              </div>
            )}

            {/* FELHASZNÁLÓK TAB */}
            {activeTab === "users" && (
              <div className="admin-section">
                <div className="admin-search">
                  <MdSearch className="search-icon" />
                  <input type="text" placeholder="Keresés név, email vagy uid alapján..." value={searchUsers} onChange={e => setSearchUsers(e.target.value)} />
                </div>
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Avatar</th><th>Név / Email</th><th>Telefon</th><th>Típus</th><th>Admin</th><th>Műveletek</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(u => (
                        <tr key={u.id}>
                          <td>
                            <div className="avatar-cell">
                              {u.avatarUrl
                                ? <img src={u.avatarUrl} alt="avatar" className="admin-avatar" onClick={()=>navigate("/users/"+u.uid)} />
                                : <div className="admin-avatar-placeholder" onClick={()=>navigate("/users/"+u.uid)}><MdPerson /></div>
                              }
                              {u.avatarUrl && (
                                <button
                                  className="avatar-delete-btn"
                                  onClick={() => handleDeleteAvatar(u)}
                                  title="Profilkép törlése"
                                >
                                  <MdNoPhotography />
                                </button>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="listing-title-cell">
                              <span className="listing-name">{u.contactName || "—"}</span>
                              <span className="listing-address">{u.contactEmail || u.id}</span>
                            </div>
                          </td>
                          <td>{u.contactPhone || "—"}</td>
                          <td>{u.contactType || "—"}</td>
                          <td><span className={`status-badge ${u.isAdmin ? "admin" : "user"}`}>{u.isAdmin ? "Admin" : "User"}</span></td>
                          <td>
                            <div className="action-btns">
                              <button className="action-btn view" onClick={() => handleViewUser(u)} title="Hirdetések megtekintése"><MdHome /></button>
                              <button className="action-btn edit" onClick={() => handleEditUser(u)} title="Adatok szerkesztése"><MdEdit /></button>
                              <button className={`action-btn ${u.isAdmin ? "remove-admin" : "make-admin"}`} onClick={() => handleToggleAdmin(u)} title={u.isAdmin ? "Admin jog elvétele" : "Admin jog adása"}><MdAdminPanelSettings /></button>
                              <button className="action-btn delete" onClick={() => handleDeleteUser(u)} title="Törlés" disabled={u.id === user?.uid}><MdDelete /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredUsers.length === 0 && <div className="empty-state">Nincs találat.</div>}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* USER HIRDETÉSEK MODAL */}
      {selectedUser && (
        <div className="admin-modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2><MdPerson /> {selectedUser.contactName || selectedUser.id} hirdetései</h2>
              <button className="modal-close-btn" onClick={() => setSelectedUser(null)}><MdClose /></button>
            </div>
            <div className="modal-body">
              {userListings.length === 0 ? (
                <p className="empty-state">Ennek a felhasználónak nincs hirdetése.</p>
              ) : (
                <div className="modal-listings">
                  {userListings.map(l => (
                    <div key={l.id} className="modal-listing-row" onClick={() => navigate("/listing/" + l.id)}>
                      <img src={l.thumbnail?.url || "https://via.placeholder.com/60x40"} alt={l.title} />
                      <div>
                        <span className="listing-name">{l.title}</span>
                        <span className="listing-address">{l.address}</span>
                      </div>
                      <span className="price-cell">{Number(l.price).toLocaleString()} Ft</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* USER SZERKESZTÉS MODAL */}
      {editUser && (
        <div className="admin-modal-overlay" onClick={() => setEditUser(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-left">
                {editUser.avatarUrl
                  ? <img src={editUser.avatarUrl} alt="avatar" className="modal-avatar" />
                  : <div className="admin-avatar-placeholder"><MdPerson /></div>
                }
                <h2><MdEdit /> {editUser.contactName || editUser.id} szerkesztése</h2>
              </div>
              <button className="modal-close-btn" onClick={() => setEditUser(null)}><MdClose /></button>
            </div>
            <div className="modal-body">
              <div className="edit-user-form">
                <div className="edit-field">
                  <label><FaUser className="cff-icon" /> Név</label>
                  <input type="text" value={editForm.contactName} onChange={e => setEditForm(p => ({ ...p, contactName: e.target.value }))} placeholder="pl. Kiss János" />
                </div>
                <div className="edit-field">
                  <label><FaEnvelope className="cff-icon" /> Email</label>
                  <input type="email" value={editForm.contactEmail} onChange={e => setEditForm(p => ({ ...p, contactEmail: e.target.value }))} placeholder="pl. kiss.janos@email.hu" />
                </div>
                <div className="edit-field">
                  <label><FaPhone className="cff-icon" /> Telefonszám</label>
                  <input type="tel" value={editForm.contactPhone} onChange={e => setEditForm(p => ({ ...p, contactPhone: e.target.value }))} placeholder="pl. +36 30 123 4567" />
                </div>
                <div className="edit-field">
                  <label><FaBuilding className="cff-icon" /> Hirdető típusa</label>
                  <select value={editForm.contactType} onChange={e => setEditForm(p => ({ ...p, contactType: e.target.value }))}>
                    <option value="Magánszemély">Magánszemély</option>
                    <option value="Tulajdonos">Tulajdonos</option>
                    <option value="Ingatlaniroda">Ingatlaniroda</option>
                  </select>
                </div>
                <div className="edit-actions">
                  {editUser.avatarUrl && (
                    <button className="delete-avatar-btn" type="button" onClick={() => handleDeleteAvatar(editUser)}>
                      <MdNoPhotography /> Profilkép törlése
                    </button>
                  )}
                  <button className="save-edit-btn" onClick={handleSaveUser} disabled={saving}>
                    <MdSave /> {saving ? "Mentés..." : "Mentés"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};