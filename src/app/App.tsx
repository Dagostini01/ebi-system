import { BrowserRouter as Router } from 'react-router-dom';

import Navbar from '@/shared/components/NavBar';
import { AppRoutes } from '@/app/routes';

export function App() {
  return (
    <Router>
      <div className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-sky-200/50 via-emerald-100/40 to-transparent" />
        <div className="pointer-events-none absolute -left-16 top-40 -z-10 h-56 w-56 rounded-full bg-emerald-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 top-24 -z-10 h-64 w-64 rounded-full bg-sky-200/60 blur-3xl" />

        <Navbar />

        <main className="relative z-10 px-3 pb-12 pt-4 sm:px-6 sm:pt-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <AppRoutes />
          </div>
        </main>
      </div>
    </Router>
  );
}
