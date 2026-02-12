import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MyUserContext } from '../context/MyUserProvider';
import './SignUp.css';

import { FaArrowLeft, FaRegEye, FaRegEyeSlash, FaRegUser, FaRegEnvelope } from 'react-icons/fa';

export const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { signUpUser, msg } = useContext(MyUserContext);

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
      <div className="image-section" />
    </div>
  );
};