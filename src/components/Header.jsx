import React, { useState, useRef, useEffect } from 'react'
import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import { MyUserContext } from '../context/MyUserProvider';
import { RxAvatar } from 'react-icons/rx';
import { MdClose } from 'react-icons/md';
import { RxHamburgerMenu } from 'react-icons/rx';
import './Header.css';
import { notify } from '../myBackend';

export const Header = () => {
  const { user, isAdmin, logoutUser } = useContext(MyUserContext)
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const menuRef = useRef(null)
  const lastScrollY = useRef(0)
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const HIDE_THRESHOLD = 80;
    const SHOW_THRESHOLD = 60;
    let scrolledDown = 0;
    let scrolledUp = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY.current;

      if (currentScrollY < 10) {
        setVisible(true);
        scrolledDown = 0;
        scrolledUp = 0;
      } else if (diff > 0) {
        scrolledDown += diff;
        scrolledUp = 0;
        if (scrolledDown > HIDE_THRESHOLD) {
          setVisible(false);
          setMenuOpen(false);
          scrolledDown = 0;
        }
      } else {
        scrolledUp += Math.abs(diff);
        scrolledDown = 0;
        if (scrolledUp > SHOW_THRESHOLD) {
          setVisible(true);
          scrolledUp = 0;
        }
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logOut = () => {
    logoutUser()
  }

  const goTo = (path) => {
    navigate(path)
    setMenuOpen(false)
  }

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`header ${visible ? 'header--visible' : 'header--hidden'}`} ref={menuRef}>
      <nav className="navbar">

        {/* Logo */}
        <div className="nav-logo" onClick={() => navigate("/")}>
          Lakás<span>Liget</span>
        </div>

        {/* Nav linkek */}
        <div className="nav-links">
          {[
            { label: "Főoldal", path: "/" },
            { label: "Hirdetések", path: "/listings" },
            { label: "Feltöltés", path: "/addnew", disabled: !user },
            { label: "Rólunk", path: "/about" },
          ].map(({ label, path, disabled }) => (
            <button
              key={path}
              className={`nav-link ${isActive(path) ? "nav-link--active" : ""}`}
              onClick={() => !disabled && goTo(path)}
              disabled={disabled}
            >
              {label}
            </button>
          ))}
          {isAdmin && (
            <button className="nav-link nav-link--admin" onClick={() => goTo("/admin")}>
              Admin
            </button>
          )}
        </div>

        {/* Auth / Profil */}
        <div className="nav-auth">
          {user ? (
            <>
              <div className="nav-avatar" onClick={() => navigate("/profile")}>
                {user?.photoURL
                  ? <img src={user.photoURL} alt="profil" className="nav-avatar-img" />
                  : <RxAvatar size={32} className="nav-avatar-icon" />
                }
                <span className="nav-username">{user.displayName}</span>
              </div>
              <button className="nav-btn-outline" onClick={logOut}>Kijelentkezés</button>
            </>
          ) : (
            <>
              <button className="nav-btn-ghost" onClick={() => navigate("/signin")}>Bejelentkezés</button>
              <button className="nav-btn-fill" onClick={() => navigate("/signup")}>Regisztráció</button>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button className="hamburger-btn" onClick={() => setMenuOpen(prev => !prev)}>
          {menuOpen ? <MdClose size={24} /> : <RxHamburgerMenu size={24} />}
        </button>
      </nav>

      {/* Mobil menü */}
      {menuOpen && (
        <div className="mobile-menu">
          {[
            { label: "Főoldal", path: "/" },
            { label: "Hirdetések", path: "/listings" },
            { label: "Feltöltés", path: "/addnew", disabled: !user },
            { label: "Rólunk", path: "/about" },
          ].map(({ label, path, disabled }) => (
            <button
              key={path}
              className={`mobile-nav-btn ${isActive(path) ? "mobile-nav-btn--active" : ""}`}
              onClick={() => !disabled && goTo(path)}
              disabled={disabled}
            >
              {label}
            </button>
          ))}
          {isAdmin && (
            <button className="mobile-nav-btn mobile-nav-btn--admin" onClick={() => goTo("/admin")}>
              Admin
            </button>
          )}
          <div className="mobile-divider" />
          {user ? (
            <>
              <div className="mobile-user-row" onClick={() => goTo("/profile")}>
                {user?.photoURL
                  ? <img src={user.photoURL} style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover" }} alt="profil" />
                  : <RxAvatar size={34} />
                }
                <span>{user.displayName}</span>
              </div>
              <button className="mobile-nav-btn mobile-logout" onClick={() => { logOut(); setMenuOpen(false); }}>
                Kijelentkezés
              </button>
            </>
          ) : (
            <div className="mobile-auth-row">
              <button className="mobile-nav-btn" onClick={() => goTo("/signin")}>Bejelentkezés</button>
              <button className="mobile-nav-btn mobile-nav-btn--fill" onClick={() => goTo("/signup")}>Regisztráció</button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}