import React from 'react'
import { useNavigate } from 'react-router-dom'

export const Header = () => {
    const navigate = useNavigate()
  return (
    <div>
        <h1>Header</h1>
        <button onClick={()=>navigate("/")}>home</button>
        <button onClick={()=>navigate("/addnew")}>form</button>
    </div>
  )
}
