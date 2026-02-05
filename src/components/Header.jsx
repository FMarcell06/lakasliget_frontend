import React from 'react'
import { useNavigate } from 'react-router-dom'

export const Header = () => {
    const navigate = useNavigate()
  return (
    <div className='header'>
         {/*<h1>Header</h1>*/}

        <nav className="navbar">
          <div className="logo"></div>
          <div className="nav-links">
            <button className='home' onClick={()=>navigate("/")}>Home</button>
            <button className='form' onClick={()=>navigate("/addnew")}>Form</button>
            <button className='about' onClick={()=>navigate("/about")}>About</button>
            
            <div className="search-container">
              <input 
                type="text" 
                placeholder="Search..." 
              />
            </div>

            <div className="auth-buttons">
              <button className="btn-signin">Sign In</button>
              <button className="btn-signup">Sign Up</button>
            </div>
          </div>
        </nav>
    </div>
  )
}
