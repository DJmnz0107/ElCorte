import { Routes, Route } from "react-router-dom";
import SignIn from './pages/SignIn';
import RecoveryPassowrd from './pages/RecoveryPassword';
import VerifyCode from './pages/VerifyCode';
import ChangePassword from './pages/ChangePassword';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/forgot-password" element={<RecoveryPassowrd />} />
      <Route path="/verifyCode" element={<VerifyCode />} /> 
      <Route path="/ChangePassword" element={<ChangePassword />} /> 
       
    </Routes>
  );
}

export default App;
