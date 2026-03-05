import React, { useState, useEffect, useContext } from 'react';
import { MyUserContext } from '../context/MyUserProvider';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaRegEnvelope, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './SignIn.css';
import { notify } from '../myBackend';

const images = [
  "https://images.unsplash.com/photo-1618221520382-3d68e64f58ff?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1691745034385-d5376238a97c?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1691036561573-4b76998b60de?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1721630175454-0ca4517bb530?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1649511134921-67afc567280c?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80"
];

export const PwReset = () => {
  const [loading, setLoading] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);
  const { msg, resetPassword, setMsg } = useContext(MyUserContext);
  const navigate = useNavigate();

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
    await resetPassword(data.get('email'));
    notify.success("Jelszó-visszaállító email elküldve!");
    navigate("/signin");
  } catch (error) {
    notify.error("Hiba történt, ellenőrizd az email címet!");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="signin-container">

      {/* Kép szekció */}
      <div className="signin-image-section">
        <div className="slider-track" style={{ transform: `translateX(-${currentImg * 100}%)` }}>
          {images.map((img, index) => (
            <div key={index} className="slide" style={{ backgroundImage: `url(${img})` }} />
          ))}
        </div>
        <div className="slider-controls">
          <button className="slider-arrow" onClick={prevSlide}><FaChevronLeft /></button>
          <div className="slider-dots">
            {images.map((_, index) => (
              <span key={index} className={`dot ${index === currentImg ? 'active' : ''}`} onClick={() => setCurrentImg(index)} />
            ))}
          </div>
          <button className="slider-arrow" onClick={nextSlide}><FaChevronRight /></button>
        </div>
      </div>

      {/* Jobb oldali form */}
      <div className="signin-form-section">

        <button className="back-btn" onClick={() => { navigate("/signin"); setMsg({}); }}>
          <FaArrowLeft /> Vissza a bejelentkezéshez
        </button>

        <div className="logo-container">
          <div className="logo-icon" />
          <h1 className="logo-text2">LakásLiget</h1>
        </div>

        <div className="form-wrapper">
          <p className="subtitle">Elfelejtette jelszavát?</p>
          <h2 className="title">Jelszó visszaállítás</h2>

          {msg?.resetPw ? (
            <div className="pw-reset-success">
              <div className="pw-reset-icon">✉️</div>
              <p>{msg.resetPw}</p>
              <button className="submit-btn" onClick={() => { navigate("/signin"); setMsg({}); }}>
                Vissza a bejelentkezéshez
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <p className="pw-reset-desc">
                Adja meg regisztrált e-mail címét, és küldünk egy jelszó-visszaállító linket.
              </p>

              <div className="input-group">
                <label className="input-label" htmlFor="email">E-mail cím</label>
                <div className="input-wrapper">
                  <input
                    id="email"
                    className="form-input"
                    name="email"
                    type="email"
                    placeholder="Adja meg e-mail címét"
                    required
                  />
                  <span className="input-icon"><FaRegEnvelope /></span>
                </div>
              </div>

              {msg?.err && <p className="error-msg">{msg.err}</p>}

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? <div className="spinner"></div> : "Link küldése"}
              </button>
            </form>
          )}
        </div>

        <p className="register-text">
          Eszébe jutott? <a onClick={() => { navigate("/signin"); setMsg({}); }} className="register-link">Bejelentkezés</a>
        </p>
      </div>
    </div>
  );
};