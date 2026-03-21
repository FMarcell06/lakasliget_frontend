import React, { useState, useEffect, useContext } from "react";
import { MdTune, MdSearch, MdSwapVert, MdArrowUpward, MdArrowDownward } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { Header } from "../components/Header";
import { MyUserContext } from "../context/MyUserProvider";
import { ApartCard } from "../components/ApartCard";
import { notify, readHomes } from "../myBackend";
import "./Apartments.css";
import { useRef } from "react";

const SORT_OPTIONS = [
  { value: "timestamp", label: "Legújabb" },
  { value: "price", label: "Ár" },
  { value: "area", label: "Terület" },
  { value: "rooms", label: "Szobák" },
];

export const Apartments = () => {
  const { user } = useContext(MyUserContext);
  const [homes, setHomes] = useState([]);
  const [filteredHomes, setFilteredHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("timestamp");
  const [sortAsc, setSortAsc] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

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

const PAGE_SIZE = 10;
const [page, setPage] = useState(1);
const visibleHomes = filteredHomes.slice(0, page * PAGE_SIZE);

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

  // Rendezés alkalmazása
  const applySort = (list, field, asc) => {
    return [...list].sort((a, b) => {
      let valA, valB;
      if (field === "timestamp") {
        valA = a.timestamp?.seconds || 0;
        valB = b.timestamp?.seconds || 0;
      } else {
        valA = Number(a[field]) || 0;
        valB = Number(b[field]) || 0;
      }
      return asc ? valA - valB : valB - valA;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    const defaultFilters = {
      title: "", minPrice: "", maxPrice: "", minSize: "",
      rooms: "", category: "", furnished: "", pets: "",
      airConditioner: "", lift: ""
    };
    setFilters(defaultFilters);
    setFilteredHomes(applySort(homes, sortBy, sortAsc));
  };

  const handleBegin = () => {
      if(!user){ 
        navigate("/signin")
        notify.warning("Jelentkezz be az ingatlan meghirdetéséhez!")
      }else navigate("/addnew")
  }

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const result = homes.filter((home) => {
      const searchTerm = filters.title.toLowerCase();
      const matchesTitle = !searchTerm || home.title?.toLowerCase().includes(searchTerm) || home.address?.toLowerCase().includes(searchTerm);
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
      return matchesTitle && matchesMinPrice && matchesMaxPrice && matchesSize && matchesRooms && matchesCategory && matchesFurnished && matchesPets && matchesAC && matchesLift;
    });
    setFilteredHomes(applySort(result, sortBy, sortAsc));
  };

  const handleSortChange = (field) => {
    if (field === sortBy) {
      // Ugyanaz a mező — megfordítjuk
      const newAsc = !sortAsc;
      setSortAsc(newAsc);
      setFilteredHomes(prev => applySort(prev, field, newAsc));
    } else {
      // Új mező
      setSortBy(field);
      setSortAsc(field === "timestamp" ? false : true);
      setFilteredHomes(prev => applySort(prev, field, field === "timestamp" ? false : true));
    }
    setSortMenuOpen(false);
  };

const observerRef = useRef(null);
const bottomRef = useRef(null);

// Page reset ha változik a szűrés
useEffect(() => { setPage(1); }, [filteredHomes]);

useEffect(() => {
  if (observerRef.current) observerRef.current.disconnect();
  observerRef.current = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && visibleHomes.length < filteredHomes.length) {
      setPage(p => p + 1);
    }
  }, { threshold: 0.1 });
  if (bottomRef.current) observerRef.current.observe(bottomRef.current);
  return () => observerRef.current?.disconnect();
}, [visibleHomes.length, filteredHomes.length]);

  const currentSortLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label;

  return (
    <div className="apartments-page">
      <Header />
      <main className="apartments-main">
        <div className="info-banner">
          <div className="info-banner-content">
<p>
  Adj fel hirdetést <strong>ingyen</strong>, percek alatt regisztrálj és kezdj el bérlőt keresni még ma!{" "}
  <span className="info-link" onClick={() => handleBegin()}>Hirdetés feladása →</span>
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

              <form className="filter-inputs" onSubmit={handleSearch}>
                <div className="input-field">
                  <label>Keresés</label>
                  <div className="search-wrapper">
                    <MdSearch className="search-icon" />
                    <input type="text" name="title" placeholder="Város, utca vagy cím..." value={filters.title} onChange={handleChange} />
                  </div>
                </div>

                <div className="input-field">
                  <label>Bérleti díj (Ft)</label>
                  <div className="input-row">
                    <input type="number" name="minPrice" placeholder="Min" value={filters.minPrice} onChange={handleChange} className="price-input" />
                    <input type="number" name="maxPrice" placeholder="Max" value={filters.maxPrice} onChange={handleChange} className="price-input" />
                  </div>
                </div>

                <div className="input-row">
                  <div className="input-field">
                    <label>Szobák</label>
                    <select name="rooms" value={filters.rooms} onChange={handleChange}>
                      <option value="">Mind</option>
                      {[1, 2, 3, 4, 5].map((n) => (<option key={n} value={n}>{n}+</option>))}
                    </select>
                  </div>
                  <div className="input-field">
                    <label>Min. m²</label>
                    <input type="number" name="minSize" placeholder="m²" value={filters.minSize} onChange={handleChange} className="no-icon-input" />
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

                <button type="submit" className="apply-btn">Találatok mutatása</button>
                <button type="button" className="sort-btn" onClick={resetFilters} style={{ width: '100%', marginTop: '10px', justifyContent: 'center' }}>
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
                  Az hirdetések a keresési feltételek alapján jelennek meg
                </span>
              </div>
              <div className="meta-right" style={{ position: "relative" }}>
                <button className="sort-btn" onClick={() => setSortMenuOpen(p => !p)}>
                  <MdSwapVert />
                  {currentSortLabel}
                  {sortAsc ? <MdArrowUpward size={14} /> : <MdArrowDownward size={14} />}
                </button>

                {sortMenuOpen && (
                  <div className="sort-dropdown">
                    {SORT_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        className={`sort-dropdown-item ${sortBy === opt.value ? "active" : ""}`}
                        onClick={() => handleSortChange(opt.value)}
                      >
                        {opt.label}
                        {sortBy === opt.value && (
                          sortAsc ? <MdArrowUpward size={14} /> : <MdArrowDownward size={14} />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {loading ? (
              <div className="loader-wrapper">
                <div className="custom-spinner"></div>
                <p>Ingatlanok betöltése...</p>
              </div>
            ) : (
<div className="apartments-list">
  {visibleHomes.map((home) => (
    <div key={home.id} onClick={() => navigate("/listing/" + home.id)} style={{ cursor: 'pointer' }}>
      <ApartCard apartment={home} />
    </div>
  ))}
  <div ref={bottomRef} style={{ height: "40px" }} />  {/* ← ide */}
</div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};