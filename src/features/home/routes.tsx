import { Route } from 'react-router-dom';

import HomePage from '@/features/home/pages/HomePage';

export const homeRoutes = (
  <>
    <Route path="/" element={<HomePage />} />
  </>
);
