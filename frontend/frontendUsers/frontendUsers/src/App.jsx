// Importación de componentes necesarios de React Router
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Importación de componentes comunes
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Importación de páginas del sitio
import Login from './pages/Login';
import SignUp from './pages/Signup';
import Store from './pages/Store';
import ProductDetail from './pages/ProductDetail';
import ConfirmPayment from './pages/ConfirmPayment';
import AboutUs from './pages/AboutUs';
import TermsAndConditions from './pages/TermsAndConditions';
import Home from './pages/Home';
import News from './pages/NewsPage';
import ContactUs from './pages/ContactUs';
import Cart from './pages/Cart';

// Importación de estilos globales
import './App.css';

// Componente principal de la aplicación
function App() {
  return (
    // Envolvemos la app con el Router para habilitar rutas
    <Router>
      <Routes>

        {/* Rutas SIN Navbar ni Footer (generalmente usadas para login o registro) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Ruta de inicio (con Navbar y Footer) */}
        <Route path="/" element={
          <>
            <Navbar />
            <Home />
            <Footer />
          </>
        } />

        {/* Ruta Tienda */}
        <Route path="/tienda" element={
          <>
            <Navbar />
            <Store />
            <Footer />
          </>
        } />

        {/* Ruta Contacto */}
        <Route path="/contact" element={
          <>
            <Navbar />
            <ContactUs />
            <Footer />
          </>
        } />

        {/* Ruta Carrito */}
        <Route path="/cart" element={
          <>
            <Navbar />
            <Cart />
            <Footer />
          </>
        } />

        {/* Ruta Detalle de Producto */}
        <Route path="/product-detail" element={
          <>
            <Navbar />
            <ProductDetail />
            <Footer />
          </>
        } />

        {/* Ruta Confirmación de Pago */}
        <Route path="/confirm-payment" element={
          <>
            <Navbar />
            <ConfirmPayment />
            <Footer />
          </>
        } />

        {/* Ruta Sobre Nosotros */}
        <Route path="/about-us" element={
          <>
            <Navbar />
            <AboutUs />
            <Footer />
          </>
        } />

        {/* Ruta Términos y Condiciones */}
        <Route path="/TermsAndConditions" element={
          <>
            <Navbar />
            <TermsAndConditions />
            <Footer />
          </>
        } />

        {/* Ruta Noticias */}
        <Route path="/News" element={
          <>
            <Navbar />
            <News />
            <Footer />
          </>
        } />
        <Route path="/ContactUs" element={
          <>
            <Navbar/>
            <ContactUs/>
            <Footer />
          </>
        } />

        {/* Ruta comodín para páginas no encontradas (404) */}
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

// Exportamos el componente para su uso en index.js
export default App;
