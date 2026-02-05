import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';

import { Home } from './pages/Home.jsx';
import { SignUp } from './pages/SignUp.jsx'

export default function App() {
  const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/signup", element: <SignUp /> },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}