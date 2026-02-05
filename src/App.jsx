import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import  Home from './pages/Home'
import { Header } from './components/Header'
import './App.css';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Header />
      <Routes>
        <Route path='/' element={<Home/>}></Route>
      </Routes>
    </div>
  )
}

export default App
