/*
export const SignIn = () => {
  return (
    <div className="signin-container">
      <div className="signin-card">
        <h2 className="signin-title">Sign In</h2>

        <form onSubmit={handleSubmit} className="signin-form">

          <label>Email</label>
          <input
          name='email'
            type="email"
            placeholder='email'
            required

          />

          <label>Password</label>
          <input
          name='password'
            type="password"
            placeholder='password'
            required
          />

          <button type="submit" className="signin-btn">
            Log In
          </button>
        </form>
        <div><p onClick={()=>{navigate("/pwreset");setMsg({})}}>Elfelejtett jelszó</p></div>
      </div>

    </div>
  )
}
*/

import React, { useState, useEffect, useContext } from 'react';
import { MyUserContext } from '../context/MyUserProvider'
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './SignIn.css';

const images = [
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1606744888344-493238951221?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1562438668-bcf0ca6578f0?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1615529162924-f8605388461d?auto=format&fit=crop&q=80"
];

export const SignIn = () => {
  const [currentImg, setCurrentImg] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentImg((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentImg((prev) => (prev - 1 + images.length) % images.length);

  const { signInUser, msg, setMsg } = useContext(MyUserContext);

  const handleSubmit = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    console.log(data.get("email"));
    signInUser(data.get("email"),data.get("password"))
  }

  return (
    <div className="signin-container">
      
      {/* Kép szekció */}
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

      {/* Bejelentkezési űrlap szekció */}
      <div className="signin-form-section">
        <h2 className="signin-title">Sign In</h2>

        <form onSubmit={handleSubmit} className="signin-form">

          <label>Email</label>
          <input
          name='email'
            type="email"
            placeholder='email'
            required

          />

          <label>Password</label>
          <input
          name='password'
            type="password"
            placeholder='password'
            required
          />

          <button type="submit" className="signin-btn">
            Log In
          </button>
        </form>
        <div><p onClick={()=>{navigate("/pwreset");setMsg({})}}>Elfelejtett jelszó</p></div>
      </div>
    </div>
  );
};