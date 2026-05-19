import { Route } from 'react-router-dom';

import CadastroFilhoPage from '@/features/responsavel/pages/CadastroFilhoPage';
import CadastroResponsavelPage from '@/features/responsavel/pages/CadastroResponsavelPage';
import PainelResponsavelPage from '@/features/responsavel/pages/PainelResponsavelPage';

export const responsavelRoutes = (
  <>
    <Route path="/register" element={<CadastroResponsavelPage />} />
    <Route path="/cadastro-filho" element={<CadastroFilhoPage />} />
    <Route path="/pai-dashboard" element={<PainelResponsavelPage />} />
  </>
);
