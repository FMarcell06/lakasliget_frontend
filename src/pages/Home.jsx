import React, { useState } from 'react';
import { Header } from '../components/Header';

export const Home = () => {
  return (
    <div>
    <Header />
    <div className="hero">
      <div className="hero-content">
        <h1>Lakás <br /> Liget</h1>
        <p>
          teszt <br />
          teszt
        </p>
        <button className="gomb">Learn More</button>
      </div>
    </div>
    </div>
  );
};
