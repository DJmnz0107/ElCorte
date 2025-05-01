import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import Store from './pages/Store';
import ProductDetail from './pages/ProductDetail';
import ConfirmPayment from './pages/ConfirmPayment';
import AboutUs from './pages/AboutUs';
import TermsAndConditions from './pages/TermsAndConditions';
import Home from './pages/Home';
import News from './pages/NewsPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas SIN Navbar */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Rutas CON Navbar */}
        <Route path="/" element={
          <>
            <Navbar />
            <Home />
            <Footer />
          </>
        } />
        <Route path="/tienda" element={
          <>
            <Navbar />
            <Store />
            <Footer />
          </>
        } />
        <Route path="/product-detail" element={
          <>
            <Navbar/>
            <ProductDetail/>
            <Footer />
          </>
        }/>
         <Route path="/confirm-payment" element = {
          <>
          <Navbar/>
          <ConfirmPayment/>
          <Footer />
          </>
        }/>
        <Route path="/about-us" element={
          <>
            <Navbar />
            <AboutUs />
            <Footer />
          </>
        } />
        <Route path="/TermsAndConditions" element={
          <>
            <Navbar/>
            <TermsAndConditions/>
            <Footer />
          </>
        } />
          <Route path="/News" element={
          <>
            <Navbar/>
            <News/>
            <Footer />
          </>
        } />
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
