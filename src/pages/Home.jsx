import React, { useState } from 'react';


const Page = () => {
  return (
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
  );
};

function App() {
  return (
    <div className="App">
      <Page />
    </div>
  );
}

export default App;