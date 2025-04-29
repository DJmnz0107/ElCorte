import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import Store from './pages/Store';
import ProductDetail from './pages/ProductDetail';
import AboutUs from './pages/AboutUs';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas SIN Navbar */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        
        {/* Rutas CON Navbar */}
        <Route path="/" element={
          <>
            <Navbar />
            <Store />
          </>
        } />
        <Route path="/tienda" element={
          <>
            <Navbar />
            <Store />
          </>
        } />
        <Route path="/product-detail" element={
          <>
            <Navbar/>
            <ProductDetail/>
          </>
        } />
        <Route path="/about-us" element={
          <>
            <Navbar />
            <AboutUs />
          </>
        } />
        
        {/* Ruta 404 */}
        <Route path="*" element={
          <>
            <Navbar />
            <div className="content">
              <h1>404 - Página no encontrada</h1>
            </div>
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;
