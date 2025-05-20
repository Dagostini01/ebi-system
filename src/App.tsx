import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/NavBar';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CadastroFilho from './pages/CadastroFilho';
import PainelPai from './pages/PaiDashboard'

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRegister from './pages/admin/AdminRegister';

export function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cadastro-filho" element={<CadastroFilho />} />
        <Route path="/pai-dashboard" element={<PainelPai />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/register" element={<AdminRegister />} />

      </Routes>
    </Router>
  );
}
