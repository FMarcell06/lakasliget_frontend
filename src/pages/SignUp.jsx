import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MyUserContext } from '../context/MyUserProvider';
import './SignUp.css';

import { FaArrowLeft, FaRegEye, FaRegEyeSlash, FaRegUser, FaRegEnvelope, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const images = [
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1606744888344-493238951221?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1562438668-bcf0ca6578f0?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1615529162924-f8605388461d?auto=format&fit=crop&q=80"
];

export const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);
  
  const navigate = useNavigate();
  const { signUpUser, msg } = useContext(MyUserContext);

  // Automatikus váltás (5 másodpercenként)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentImg((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentImg((prev) => (prev - 1 + images.length) % images.length);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    
    // Hagyományos HTML form kezelés FormData-val
    const data = new FormData(event.currentTarget);
    
    try {
      const email = data.get('email');
      const displayName = data.get('displayName');
      const password = data.get('password');
      
      console.log("Regisztráció adatai:", { email, displayName, password });
      
      await signUpUser(email, displayName, password);
      // Siker esetén navigáció:
      // navigate('/login');
    } catch (error) {
      console.error("Hiba történt:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      
      {/* Vissza gomb */}
      <button 
        className="back-btn" 
        onClick={() => navigate("/")}
      >
        <FaArrowLeft /> Vissza a főoldalra
      </button>

      {/* Bal oldali űrlap szekció */}
      <div className="signup-form-section">
        
        {/* Logo */}
        <div className="logo-container">
          <div className="logo-icon" />
          <h1 className="logo-text">LakásLiget</h1>
        </div>

        {/* Regisztrációs felület */}
        <div className="form-wrapper">
          <p className="subtitle">Kezdjen böngészni</p>
          <h2 className="title">Regisztráció</h2>

          {/* Hibaüzenet */}
          {/*{msg && (
            <div className="alert-error">
              {typeof msg === 'object' ? JSON.stringify(msg) : msg}
            </div>
          )}*/}

          <form onSubmit={handleSubmit} noValidate>
            
            {/* Felhasználónév mező */}
            <div className="input-group">
              <label className="input-label" htmlFor="displayName">Felhasználónév</label>
              <div className="input-wrapper">
                <input
                  id="displayName"
                  className="form-input"
                  name="displayName"
                  placeholder="pelda_felhasznalo"
                  required
                  type="text"
                />
                <span className="input-icon">
                  <FaRegUser />
                </span>
              </div>
            </div>

            {/* E-mail mező */}
            <div className="input-group">
              <label className="input-label" htmlFor="email">E-mail</label>
              <div className="input-wrapper">
                <input
                  id="email"
                  className="form-input"
                  name="email"
                  type="email"
                  placeholder="pelda@email.com"
                  required
                />
                <span className="input-icon">
                  <FaRegEnvelope />
                </span>
              </div>
            </div>

            {/* Jelszó mező */}
            <div className="input-group">
              <label className="input-label" htmlFor="password">Jelszó</label>
              <div className="input-wrapper">
                <input
                  id="password"
                  className="form-input"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="********"
                  required
                />
                <div className="input-icon">
                  <button 
                    type="button" 
                    className="icon-btn" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? <div className="spinner"></div> : "Regisztráció"}
            </button>
          </form>
        </div>

        <p className="login-text">
          Már van fiókja? <a onClick={() => navigate("/signin")} className="login-link">Bejelentkezés!</a>
        </p>
      </div>

      {/* Kép szekció */}
      <div 
        className="image-section" 
        style={{ backgroundImage: `url(${images[currentImg]})` }}
      >
        <div className="slider-controls">
          <button className="slider-arrow" onClick={prevSlide}><FaChevronLeft /></button>
          
          <div className="slider-dots">
            {images.map((_, index) => (
              <span 
                key={index} 
                className={`dot ${index === currentImg ? 'active' : ''}`}
                onClick={() => setCurrentImg(index)}
              />
            ))}
          </div>

          <button className="slider-arrow" onClick={nextSlide}><FaChevronRight /></button>
        </div>
      </div>
    </div>
  );
};