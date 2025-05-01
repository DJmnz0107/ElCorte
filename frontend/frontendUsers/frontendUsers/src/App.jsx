import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import Store from './pages/Store';
import ProductDetail from './pages/ProductDetail';
<<<<<<< HEAD
import ConfirmPayment from './pages/ConfirmPayment';
=======
import AboutUs from './pages/AboutUs';
import TermsAndConditions from './pages/TermsAndConditions';

>>>>>>> Marcos

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
<<<<<<< HEAD
        }/>
         <Route path="/confirm-payment" element = {
          <>
          <Navbar/>
          <ConfirmPayment/>
          </>
        }/>
=======
        } />
        <Route path="/about-us" element={
          <>
            <Navbar />
            <AboutUs />
          </>
        } />
        <Route path="/TermsAndConditions" element={
          <>
            <Navbar/>
            <TermsAndConditions/>
          </>
        } />
        
        {/* Ruta 404 */}
>>>>>>> Marcos
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
