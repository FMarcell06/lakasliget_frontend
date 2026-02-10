import React from 'react'
import { useContext } from 'react'
import { FaHome } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { MyUserContext } from '../context/MyUserProvider'
import { useEffect } from 'react'


export const SignIn = () => {
    const navigate = useNavigate()
    
    const {signInUser,msg,setMsg} = useContext(MyUserContext)

    useEffect(()=>{
        msg && msg?.signIn && navigate("/")
    },[msg])

    const handleSubmit = (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        console.log(data.get("email"));
        
            signInUser(data.get("email"),data.get("password"))

    }
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
