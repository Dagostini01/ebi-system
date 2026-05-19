import { Route } from 'react-router-dom';

import CoordenadorDashboardPage from '@/features/coordenador/pages/CoordenadorDashboardPage';

export const coordenadorRoutes = (
  <>
    <Route path="/coordenador/dashboard" element={<CoordenadorDashboardPage />} />
  </>
);
