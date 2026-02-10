import { useState } from 'react';
import {  Route, Routes } from 'react-router-dom';
import './App.css';
import { Home } from './pages/Home.jsx';
import { SignUp } from './pages/SignUp.jsx'
import { Header } from './components/Header.jsx';
import { SignIn } from './pages/SignIn.jsx';
import { ApForm } from './pages/ApForm.jsx';
import { Apartments } from './pages/Apartments.jsx';
import { UserProfile } from './pages/UserProfile.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/signup' element={<SignUp />}></Route>
        <Route path='/signin' element={<SignIn />}></Route>
        <Route path='/addnew' element={<ApForm />}></Route>
        <Route path='/listings' element={<Apartments />}></Route>
        <Route path='/profile' element={<UserProfile />}></Route>

      </Routes>
    </div>
  )
}

export default App