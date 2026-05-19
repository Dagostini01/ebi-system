import { Routes } from 'react-router-dom';

import { adminRoutes } from '@/features/admin/routes';
import { authRoutes } from '@/features/auth/routes';
import { coordenadorRoutes } from '@/features/coordenador/routes';
import { homeRoutes } from '@/features/home/routes';
import { masterRoutes } from '@/features/master/routes';
import { responsavelRoutes } from '@/features/responsavel/routes';

export function AppRoutes() {
  return (
    <Routes>
      {homeRoutes}
      {authRoutes}
      {responsavelRoutes}
      {adminRoutes}
      {coordenadorRoutes}
      {masterRoutes}
    </Routes>
  );
}
