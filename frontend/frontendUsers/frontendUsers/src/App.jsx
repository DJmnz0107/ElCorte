import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import './App.css';

function App() {
  return (
    <Router>
      {/* Navbar visible en todas las páginas excepto Login/Signup */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;