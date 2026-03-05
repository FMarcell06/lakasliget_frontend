import React, { useState, useRef, useEffect } from 'react'
import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import { MyUserContext } from '../context/MyUserProvider';
import { RxAvatar } from 'react-icons/rx';
import { RxHamburgerMenu } from 'react-icons/rx';
import { MdClose } from 'react-icons/md';
import './Header.css';

export const Header = () => {
  const { user, isAdmin, logoutUser } = useContext(MyUserContext)
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
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

  const goTo = (path) => {
    navigate(path)
    setMenuOpen(false)
  }

  return (
    <div className='header' ref={menuRef}>
      <nav className="navbar">
        <div className="logo"></div>

        {/* Eredeti nav linkek — nagy képernyőn */}
        <div className="nav-links">
          <button className='home' onClick={() => navigate("/")}>Főoldal</button>
          <button className='about' onClick={() => navigate("/listings")}>Hirdetések</button>
          <button disabled={!user} className='about' onClick={() => navigate("/addnew")}>Feltöltés</button>
          <button className='about' onClick={() => navigate("/about")}>Rólunk</button>
          {isAdmin && <button className='about adminBtn' onClick={() => navigate("/admin")}>Admin</button>}
        </div>

        {/* Eredeti auth / profil — nagy képernyőn */}
        {user ? (
          <div className='headerBtn-container'>
            <span onClick={() => navigate("/profile")}>
              {user?.photoURL
                ? <img src={user.photoURL} className="profileIcon" style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }} alt="előnézet" />
                : <RxAvatar className='noProfileIcon' size={50} />
              }
            </span>
            <h3 className='username'>{user.displayName}</h3>
            <button className='headerBtn' onClick={() => logoutUser()}>Kijelentkezés</button>
          </div>
        ) : (
          <div className="auth-buttons">
            <button className="btn-signin" onClick={() => navigate("/signin")}>Sign In</button>
            <button className="btn-signup" onClick={() => navigate("/signup")}>Sign Up</button>
          </div>
        )}

        {/* Hamburger gomb — csak mobilon látszik */}
        <button className="hamburger-btn" onClick={() => setMenuOpen(prev => !prev)}>
          {menuOpen ? <MdClose size={26} /> : <RxHamburgerMenu size={26} />}
        </button>
      </nav>

      {/* Mobil legördülő menü */}
      {menuOpen && (
        <div className="mobile-menu">
          <button className="mobile-nav-btn" onClick={() => goTo("/")}>Főoldal</button>
          <button className="mobile-nav-btn" onClick={() => goTo("/listings")}>Hirdetések</button>
          <button className="mobile-nav-btn" disabled={!user} onClick={() => goTo("/addnew")}>Feltöltés</button>
          <button className="mobile-nav-btn" onClick={() => goTo("/about")}>Rólunk</button>
          {isAdmin && <button className="mobile-nav-btn adminBtn" onClick={() => goTo("/admin")}>Admin</button>}
          <div className="mobile-divider" />
          {user ? (
            <>
              <div className="mobile-user-row" onClick={() => goTo("/profile")}>
                {user?.photoURL
                  ? <img src={user.photoURL} style={{ width: "34px", height: "34px", borderRadius: "50%", objectFit: "cover" }} alt="profil" />
                  : <RxAvatar size={34} />
                }
                <span>{user.displayName}</span>
              </div>
              <button className="mobile-nav-btn mobile-logout" onClick={() => { logoutUser(); setMenuOpen(false) }}>
                Kijelentkezés
              </button>
            </>
          ) : (
            <div className="mobile-auth-row">
              <button className="mobile-nav-btn" onClick={() => goTo("/signin")}>Sign In</button>
              <button className="mobile-nav-btn" onClick={() => goTo("/signup")}>Sign Up</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}