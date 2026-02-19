import { useState } from 'react';
import {  Route, Routes } from 'react-router-dom';
import './App.css';
import { Home } from './pages/Home.jsx';
import { About } from './pages/About.jsx';
import { SignUp } from './pages/SignUp.jsx'
import { Header } from './components/Header.jsx';
import { SignIn } from './pages/SignIn.jsx';
import { ApForm } from './pages/ApForm.jsx';
import { Apartments } from './pages/Apartments.jsx';
import { UserProfile } from './pages/UserProfile.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { NotFound } from './components/NotFound.jsx';
import { Listing } from './pages/Listing.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/about' element={<About/>}></Route>
        <Route path='/signup' element={<SignUp />}></Route>
        <Route path='/signin' element={<SignIn />}></Route>
        <Route path='/addnew' element={<ProtectedRoute><ApForm /></ProtectedRoute>}></Route>
        <Route path='/listings' element={<Apartments />}></Route>
        <Route path='/profile' element={<ProtectedRoute><UserProfile /></ProtectedRoute>}></Route>
        <Route path='/listing/:id' element={<Listing />}></Route>
        <Route path='*' element={<NotFound />}></Route>
      </Routes>
    </div>
  )
}

export default App