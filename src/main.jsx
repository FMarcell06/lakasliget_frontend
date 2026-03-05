import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { MyUserProvider } from './context/MyUserProvider.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <MyUserProvider>
      <App />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </MyUserProvider>
  </BrowserRouter>
)
