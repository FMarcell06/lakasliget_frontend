import React from 'react'
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom'
import { MyUserContext } from '../context/MyUserProvider';
import { RxAvatar } from 'react-icons/rx';

export const Header = () => {
    const {user,logoutUser} = useContext(MyUserContext)
    console.log(user);
    
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
            <button className='about' onClick={()=>navigate("/listings")}>Hirdetések</button>
            <button disabled={!user} className='about' onClick={()=>navigate("/addnew")}>Add</button>
            <div className="search-container">
              <input 
                type="text" 
                placeholder="Search..." 
              />
            </div>

        {user?
            <div className='headerBtn-container' style={{position:"absolute",top:"5px",right:"5px"}}>
                <span onClick={()=>navigate("/profile")}>
                    {user?.photoURL ? 
                    <img src={user.photoURL} className="profileIcon" style={{width:"50px",height:"50px",borderRadius:"50%",objectFit:"cover"}} alt="előnézet"  />
                    :
                    <RxAvatar size={50}/>
                }
                </span>
                <h1 className='username'>{user.displayName}</h1>
                <button className='headerBtn' onClick={()=>logoutUser()}>Kijelentkezés</button>
            </div>
            :
             <div className="auth-buttons">
              <button className="btn-signin" onClick={()=>navigate("/signin")}>Sign In</button>
              <button className="btn-signup" onClick={()=>navigate("/signup")}>Sign Up</button>
            </div>
        }
          </div>
        </nav>
    </div>
  )
}
