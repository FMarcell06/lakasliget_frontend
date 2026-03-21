import React from 'react'
import { Header } from './Header'

export const NotFound = () => {
  return (
    <div>
        <Header />
      <div style={{height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:"5px"}}>
            <h1>404 error</h1>
            <p style={{fontSize:"2rem"}}>Az oldal nem található!</p>
      </div>
    </div>  )
}
