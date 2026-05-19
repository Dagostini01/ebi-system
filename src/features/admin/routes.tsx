import { Route } from 'react-router-dom';

import AdminDashboardPage from '@/features/admin/pages/AdminDashboardPage';
import AdminPresencasDoDiaPage from '@/features/admin/pages/AdminPresencasDoDiaPage';
import AdminScanQrPage from '@/features/admin/pages/AdminScanQrPage';
import CadastrarCoordenadorPage from '@/features/admin/pages/CadastrarCoordenadorPage';

export const adminRoutes = (
  <>
    <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
    <Route path="/admin/cadastrar-coordenador" element={<CadastrarCoordenadorPage />} />
    <Route path="/admin/escanear" element={<AdminScanQrPage />} />
    <Route path="/admin/presencas-do-dia" element={<AdminPresencasDoDiaPage />} />
  </>
);
