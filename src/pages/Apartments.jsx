import React, { useState, useEffect, useContext } from "react";
import { Tune, Search, SwapVert } from "@mui/icons-material";

import { Header } from "../components/Header";
import { MyUserContext } from "../context/MyUserProvider";
import { ApartCard } from "../components/ApartCard";
import { readHomes } from "../myBackend";
import "./Apartments.css";
import { useNavigate } from "react-router-dom";

export const Apartments = () => {
  const { user } = useContext(MyUserContext);
  const [homes, setHomes] = useState([]);
  const [filteredHomes, setFilteredHomes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    title: "",
    maxPrice: 1000000,
    minSize: "",
    rooms: "",
    type: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = readHomes((data) => {
      setHomes(data);
      setFilteredHomes(data);
      setLoading(false);
    }, setLoading);
    return () =>
      unsubscribe && typeof unsubscribe === "function" && unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    const result = homes.filter((home) => {
      return (
        home.name?.toLowerCase().includes(filters.title.toLowerCase()) &&
        Number(home.price) <= filters.maxPrice &&
        (filters.minSize === "" ||
          Number(home.size) >= Number(filters.minSize)) &&
        (filters.rooms === "" ||
          Number(home.rooms) === Number(filters.rooms)) &&
        (filters.type === "" || home.type === filters.type)
      );
    });
    setFilteredHomes(result);
  };

  return (
    <div className="apartments-page">
      <Header />
      <main className="apartments-main">
        {/* Kék infó sáv (mint a screenshoton) */}
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
          {/* BAL OLDAL - SZŰRŐ (igazítva a modernebb stílushoz) */}
          <aside className="filter-column">
            <div className="filter-container">
              <div className="filter-title">
                <Tune className="icon" />
                <span>Szűrés</span>
              </div>

              <div className="filter-inputs">
                <div className="input-field">
                  <label>Helyszín vagy név</label>
                  <div className="search-wrapper">
                    <Search className="search-icon" />
                    <input
                      type="text"
                      name="title"
                      placeholder="Város, kerület..."
                      value={filters.title}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="input-field">
                  <label>
                    Max bérleti díj: {filters.maxPrice.toLocaleString()} Ft
                  </label>
                  <input
                    type="range"
                    name="maxPrice"
                    className="price-slider"
                    min="50000"
                    max="1500000"
                    step="10000"
                    value={filters.maxPrice}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-row">
                  <div className="input-field">
                    <label>Szobák</label>
                    <select
                      name="rooms"
                      value={filters.rooms}
                      onChange={handleChange}
                    >
                      <option value="">Mind</option>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n}+
                        </option>
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
                    />
                  </div>
                </div>

                <button className="apply-btn" onClick={handleSearch}>
                  Találatok mutatása
                </button>
              </div>
            </div>
          </aside>

          {/* JOBB OLDAL - EREDMÉNYEK */}
          <section className="results-column">
            <div className="results-meta">
              <div className="meta-left">
                <h1>Kiadó budapesti lakások, albérletek</h1>
                <p>{filteredHomes.length} találat</p>
                <span className="sponsored-label">
                  A lista fizetett rangsorolást is tartalmaz.{" "}
                  <a href="#">Bővebben</a>
                </span>
              </div>
              <div className="meta-right">
                <button className="sort-btn">
                  <SwapVert />
                  Rendezés: Alap rendezés
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
                    >
                      <ApartCard apartment={home} />
                    </div>
                  ))
                ) : (
                  <div className="no-results">
                    Nincs a szűrésnek megfelelő ingatlan.
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
