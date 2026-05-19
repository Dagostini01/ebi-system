import { Route } from 'react-router-dom';

import AdminRegisterPage from '@/features/admin/pages/AdminRegisterPage';
import CadastrarComumPage from '@/features/master/pages/CadastrarComumPage';
import MasterDashboardPage from '@/features/master/pages/MasterDashboardPage';

export const masterRoutes = (
  <>
    <Route path="/master/dashboard" element={<MasterDashboardPage />} />
    <Route path="/master/comuns/nova" element={<CadastrarComumPage />} />
    <Route path="/master/cadastrar-admin" element={<AdminRegisterPage />} />
  </>
);
