import React, { useState, useEffect, useContext } from "react";
import { MdTune, MdSearch, MdSwapVert } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { Header } from "../components/Header";
import { MyUserContext } from "../context/MyUserProvider";
import { ApartCard } from "../components/ApartCard";
import { readHomes } from "../myBackend";
import "./Apartments.css";

export const Apartments = () => {
  const { user } = useContext(MyUserContext);
  const [homes, setHomes] = useState([]);
  const [filteredHomes, setFilteredHomes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    title: "",
    minPrice: "",
    maxPrice: "",
    minSize: "",
    rooms: "",
    category: "",
    furnished: "",
    pets: "",
    airConditioner: "",
    lift: ""
  });

  const navigate = useNavigate();

useEffect(() => {
    const load = async () => {
      const data = await readHomes();
      setHomes(data);
      setFilteredHomes(data);
      setLoading(false);
    };
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    const defaultFilters = {
      title: "",
      minPrice: "",
      maxPrice: "",
      minSize: "",
      rooms: "",
      category: "",
      furnished: "",
      pets: "",
      airConditioner: "",
      lift: ""
    };
    setFilters(defaultFilters);
    setFilteredHomes(homes);
  };

  const handleSearch = (e) => {
    // Ha form submit hívta meg, megakadályozzuk az oldal újratöltését
    if (e) e.preventDefault();

    const result = homes.filter((home) => {
      const searchTerm = filters.title.toLowerCase();
      const matchesTitle = 
        !searchTerm || 
        home.title?.toLowerCase().includes(searchTerm) || 
        home.address?.toLowerCase().includes(searchTerm);

      const homePrice = Number(home.price);
      const matchesMinPrice = filters.minPrice === "" || homePrice >= Number(filters.minPrice);
      const matchesMaxPrice = filters.maxPrice === "" || homePrice <= Number(filters.maxPrice);

      const matchesSize = filters.minSize === "" || Number(home.area) >= Number(filters.minSize);
      const matchesRooms = filters.rooms === "" || Number(home.rooms) >= Number(filters.rooms);

      const matchesCategory = filters.category === "" || home.category === filters.category;
      const matchesFurnished = filters.furnished === "" || home.furnished === filters.furnished;
      const matchesPets = filters.pets === "" || home.pets === filters.pets;
      const matchesAC = filters.airConditioner === "" || home.airConditioner === filters.airConditioner;
      const matchesLift = filters.lift === "" || home.lift === filters.lift;

      return (
        matchesTitle && 
        matchesMinPrice && 
        matchesMaxPrice && 
        matchesSize && 
        matchesRooms && 
        matchesCategory && 
        matchesFurnished && 
        matchesPets && 
        matchesAC && 
        matchesLift
      );
    });
    setFilteredHomes(result);
  };

  return (
    <div className="apartments-page">
      <Header />
      <main className="apartments-main">
        <div className="info-banner">
          <div className="info-banner-content">
            <span className="fix-icon">fix 3%</span>
            <p>
              Keresd a <strong>FIX 3%</strong> emblémás hirdetéseket. Ezek
              megfelelhetnek a FIX 3%-os hitel feltételeinek.{" "}
              <span className="info-i">i</span>
            </p>
          </div>
        </div>

        <div className="apartments-layout">
          <aside className="filter-column">
            <div className="filter-container">
              <div className="filter-title">
<MdTune className="icon-orange" />

                <span>Szűrés</span>
              </div>

              {/* FORM HOZZÁADÁSA: Ez teszi lehetővé az Enter-es keresést */}
              <form className="filter-inputs" onSubmit={handleSearch}>
                <div className="input-field">
                  <label>Keresés</label>
                  <div className="search-wrapper">
<MdSearch className="search-icon" />

                    <input
                      type="text"
                      name="title"
                      placeholder="Város, utca vagy cím..."
                      value={filters.title}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="input-field">
                  <label>Bérleti díj (Ft)</label>
                  <div className="input-row">
                    <input
                      type="number"
                      name="minPrice"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={handleChange}
                      className="price-input"
                    />
                    <input
                      type="number"
                      name="maxPrice"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={handleChange}
                      className="price-input"
                    />
                  </div>
                </div>

                <div className="input-row">
                  <div className="input-field">
                    <label>Szobák</label>
                    <select name="rooms" value={filters.rooms} onChange={handleChange}>
                      <option value="">Mind</option>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>{n}+</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-field">
                    <label>Min. m²</label>
                    <input
                      type="number"
                      name="minSize"
                      placeholder="m²"
                      value={filters.minSize}
                      onChange={handleChange}
                      className="no-icon-input"
                    />
                  </div>
                </div>

                <div className="input-field">
                  <label>Ingatlan típusa</label>
                  <select name="category" value={filters.category} onChange={handleChange}>
                    <option value="">Összes kategória</option>
                    <option value="Lakás">Lakás</option>
                    <option value="Ház">Ház</option>
                    <option value="Panel">Panel</option>
                  </select>
                </div>

                <div className="input-row">
                  <div className="input-field">
                    <label>Bútorozott</label>
                    <select name="furnished" value={filters.furnished} onChange={handleChange}>
                      <option value="">Mindegy</option>
                      <option value="Igen">Igen</option>
                      <option value="Nem">Nem</option>
                    </select>
                  </div>
                  <div className="input-field">
                    <label>Kisállat</label>
                    <select name="pets" value={filters.pets} onChange={handleChange}>
                      <option value="">Mindegy</option>
                      <option value="Igen">Hozható</option>
                      <option value="Nem">Nem</option>
                    </select>
                  </div>
                </div>

                <div className="input-row">
                  <div className="input-field">
                    <label>Légkondi</label>
                    <select name="airConditioner" value={filters.airConditioner} onChange={handleChange}>
                      <option value="">Mindegy</option>
                      <option value="Van">Van</option>
                      <option value="Nincs">Nincs</option>
                    </select>
                  </div>
                  <div className="input-field">
                    <label>Lift</label>
                    <select name="lift" value={filters.lift} onChange={handleChange}>
                      <option value="">Mindegy</option>
                      <option value="Van">Van</option>
                      <option value="Nincs">Nincs</option>
                    </select>
                  </div>
                </div>

                {/* Submit típusúra váltva */}
                <button type="submit" className="apply-btn">
                  Találatok mutatása
                </button>
                
                {/* Fontos: A törlés gomb maradjon type="button", különben ez is beküldi a formot */}
                <button 
                  type="button" 
                  className="sort-btn" 
                  onClick={resetFilters} 
                  style={{width: '100%', marginTop: '10px', justifyContent: 'center'}}
                >
                  Szűrők törlése
                </button>
              </form>
            </div>
          </aside>

          <section className="results-column">
            <div className="results-meta">
              <div className="meta-left">
                <h1>Kiadó ingatlanok</h1>
                <p>{filteredHomes.length} találat</p>
                <span className="sponsored-label">
                  A lista fizetett rangsorolást is tartalmaz. <a href="#">Bővebben</a>
                </span>
              </div>
              <div className="meta-right">
                <button className="sort-btn">
                <MdSwapVert />

                  Rendezés
                </button>
              </div>
            </div>

            {loading ? (
              <div className="loader-wrapper">
                <div className="custom-spinner"></div>
                <p>Ingatlanok betöltése...</p>
              </div>
            ) : (
              <div className="apartments-list">
                {filteredHomes.length > 0 ? (
                  filteredHomes.map((home) => (
                    <div
                      key={home.id}
                      onClick={() => navigate("/listing/" + home.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <ApartCard apartment={home} />
                    </div>
                  ))
                ) : (
                  <div className="no-results">
                    <p>Nincs a szűrésnek megfelelő ingatlan.</p>
                    <button type="button" onClick={resetFilters} className="sort-btn" style={{margin: '0 auto'}}>Összes mutatása</button>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};