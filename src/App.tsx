import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/NavBar';

import Home from './pages/Home';
import Login from './pages/responsavel/LoginResponsavel';
import Register from './pages/responsavel/CadastroResponsavel';
import CadastroFilho from './pages/responsavel/CadastroFilho';
import PainelPai from './pages/responsavel/PainelResponsavel'

import AdminLogin from './pages/admin/LoginAdmin';
import AdminDashboard from './pages/admin/PainelAdmin';
import AdminRegister from './pages/admin/CadastroAdmin';
import AdminScanQR from './pages/admin/ScanQRAdmin';
import AdminPresencasDoDia from './pages/admin/PresencaDiaAdmin';

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
        <Route path="/admin/escanear" element={<AdminScanQR />} />
        <Route path="/admin/presencas-do-dia" element={<AdminPresencasDoDia />} />

      </Routes>
    </Router>
  );
}
