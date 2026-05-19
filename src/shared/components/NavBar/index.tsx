import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  const [openResponsavel, setOpenResponsavel] = useState(false);
  const [openEquipe, setOpenEquipe] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenus = () => {
    setOpenEquipe(false);
    setOpenResponsavel(false);
    setMobileMenuOpen(false);
  };

  const toggleResponsavel = () => {
    setOpenResponsavel(!openResponsavel);
    setOpenEquipe(false);
  };

  const toggleEquipe = () => {
    setOpenEquipe(!openEquipe);
    setOpenResponsavel(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" onClick={closeMenus} className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-sky-500 text-xl font-black text-white shadow-lg shadow-emerald-500/20">
            E
          </div>
          <div>
            <p className="text-lg font-black tracking-tight text-slate-900">EBI System</p>
            <p className="text-xs font-medium text-slate-500">Espaço Bíblico Infantil</p>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((value) => !value)}
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm sm:hidden"
        >
          {mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
        </button>

        <div className={`${mobileMenuOpen ? 'flex' : 'hidden'} w-full flex-col gap-3 sm:flex sm:w-auto sm:flex-row sm:flex-wrap sm:items-center`}>
          <NavLink
            to="/"
            onClick={closeMenus}
            className={({ isActive }) =>
              `w-full rounded-full px-4 py-2 text-center text-sm font-semibold transition sm:w-auto ${
                isActive ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
              }`
            }
          >
            Início
          </NavLink>

          <Link
            to="/login"
            onClick={closeMenus}
            className="w-full rounded-full bg-slate-900 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
          >
            Entrar
          </Link>

          <div className="relative w-full sm:w-auto">
            <button
              type="button"
              onClick={toggleResponsavel}
              className="w-full rounded-full bg-emerald-100 px-4 py-2 text-center text-sm font-semibold text-emerald-700 transition hover:bg-emerald-200 sm:w-auto"
            >
              Responsável
            </button>
            {openResponsavel && (
              <div className="mt-3 w-full rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-900/10 sm:absolute sm:right-0 sm:min-w-[15rem]">
                <Link to="/register" onClick={closeMenus} className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700">
                  Criar cadastro
                </Link>
                <Link to="/cadastro-filho" onClick={closeMenus} className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700">
                  Cadastrar criança
                </Link>
                <Link to="/pai-dashboard" onClick={closeMenus} className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700">
                  Painel da família
                </Link>
              </div>
            )}
          </div>

          <div className="relative w-full sm:w-auto">
            <button
              type="button"
              onClick={toggleEquipe}
              className="w-full rounded-full bg-sky-100 px-4 py-2 text-center text-sm font-semibold text-sky-700 transition hover:bg-sky-200 sm:w-auto"
            >
              Equipe EBI
            </button>
            {openEquipe && (
              <div className="mt-3 w-full rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-900/10 sm:absolute sm:right-0 sm:min-w-[15rem]">
                <p className="px-3 pb-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Admin / Coordenador</p>
                <Link to="/login?tipo=admin" onClick={closeMenus} className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700">
                  Login administrador
                </Link>
                <Link to="/login?tipo=coordenador" onClick={closeMenus} className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700">
                  Login coordenador
                </Link>
                <Link to="/admin/dashboard" onClick={closeMenus} className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700">
                  Painel admin
                </Link>
                <Link to="/coordenador/dashboard" onClick={closeMenus} className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700">
                  Painel coordenador
                </Link>
                <Link to="/admin/escanear" onClick={closeMenus} className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700">
                  Escanear QR
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
