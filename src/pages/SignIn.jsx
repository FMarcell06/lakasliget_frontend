import React, { useState, useEffect, useContext } from 'react';
import { MyUserContext } from '../context/MyUserProvider'
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaRegEye, FaRegEyeSlash, FaRegEnvelope, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './SignIn.css';

const images = [
  "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1606744888344-493238951221?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1562438668-bcf0ca6578f0?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1615529162924-f8605388461d?auto=format&fit=crop&q=80"
];

export const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);

  const navigate = useNavigate();
  const { signInUser, msg, setMsg } = useContext(MyUserContext);

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
    const data = new FormData(event.currentTarget);
    try {
      await signInUser(data.get('email'), data.get('password'));
    } catch (error) {
      console.error("Hiba történt:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">

      {/* Kép szekció - eredeti változat */}
      <div className="signin-image-section">
        <div
          className="slider-track"
          style={{ transform: `translateX(-${currentImg * 100}%)` }}
        >
          {images.map((img, index) => (
            <div
              key={index}
              className="slide"
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
        </div>

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

      {/* Jobb oldali űrlap szekció */}
      <div className="signin-form-section">

        {/* Vissza gomb - jobb felül */}
        <button
          className="back-btn"
          onClick={() => navigate("/")}
        >
          <FaArrowLeft /> Vissza a főoldalra
        </button>

        {/* Logo */}
        <div className="logo-container">
          <div className="logo-icon" />
          <h1 className="logo-text2">LakásLiget</h1>
        </div>

        {/* Bejelentkezési felület */}
        <div className="form-wrapper">
          <p className="subtitle">Üdvözöljük!</p>
          <h2 className="title">Bejelentkezés</h2>

          <form onSubmit={handleSubmit} noValidate>

            {/* E-mail mező */}
            <div className="input-group">
              <label className="input-label" htmlFor="email">E-mail</label>
              <div className="input-wrapper">
                <input
                  id="email"
                  className="form-input"
                  name="email"
                  type="email"
                  placeholder="Adja meg e-mail címét"
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
                  placeholder="••••••••••"
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

            {/* Elfelejtett jelszó */}
            <div className="forgot-password">
              <span onClick={() => { navigate("/pwreset"); setMsg({}); }} className="forgot-link">
                Elfelejtett jelszó?
              </span>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? <div className="spinner"></div> : "Bejelentkezés"}
            </button>
          </form>
        </div>

        <p className="register-text">
          Még nincs fiókja? <a onClick={() => navigate("/signup")} className="register-link">Regisztráció!</a>
        </p>
      </div>
    </div>
  );
};
