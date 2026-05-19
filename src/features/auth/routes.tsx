import { Navigate, Route } from 'react-router-dom';

import LoginPage from '@/features/auth/pages/LoginPage';
import MasterLoginPage from '@/features/auth/pages/MasterLoginPage';

export const authRoutes = (
  <>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/admin/login" element={<Navigate to="/login?tipo=admin" replace />} />
    <Route path="/admin/register" element={<Navigate to="/master/cadastrar-admin" replace />} />
    <Route path="/acesso-interno" element={<MasterLoginPage />} />
  </>
);
