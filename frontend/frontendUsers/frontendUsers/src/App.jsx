import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/Login';  // Asegúrate de que la ruta esté correcta
import Signup from './pages/Signup';  // Asegúrate de que la ruta esté correcta

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Login />} />  {/* Página de login */}
      <Route path="/registro" element={<Signup />} />  {/* Página de registro */}
    </Routes>
  </Router>
  );
}

export default App;