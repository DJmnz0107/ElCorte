import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Login from './pages/Login';
import SignUp from './pages/Signup';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta para login sin navbar */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        
        {/* Otras rutas con navbar */}
        <Route path="*" element={
          <>
            <Navbar />
            {/* Aquí puedes agregar el contenido de otras páginas */}
            <div className="content">
              <h1>Bienvenido a El Corté</h1>
            </div>
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;