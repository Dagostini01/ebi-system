import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const [openResponsavel, setOpenResponsavel] = useState(false);
  const [openAdmin, setOpenAdmin] = useState(false);

  const toggleResponsavel = () => {
    setOpenResponsavel(!openResponsavel);
    setOpenAdmin(false);
  };

  const toggleAdmin = () => {
    setOpenAdmin(!openAdmin);
    setOpenResponsavel(false);
  };

  return (
    <nav className="bg-gray-800 text-white px-4 py-3 flex flex-wrap items-center justify-between relative z-50">
      <h1 className="text-lg font-bold">EBI</h1>
      <div className="flex gap-6 relative">
        {/* Menu Responsável */}
        <div className="relative">
          <button onClick={toggleResponsavel} className="hover:underline">
            Responsável
          </button>
          {openResponsavel && (
            <div className="absolute right-0 bg-white text-black rounded shadow mt-2 min-w-[12rem] z-50">
              <Link to="/" className="block px-4 py-2 hover:bg-gray-100">Início</Link>
              <Link to="/login" className="block px-4 py-2 hover:bg-gray-100">Login</Link>
              <Link to="/register" className="block px-4 py-2 hover:bg-gray-100">Cadastro</Link>
              <Link to="/cadastro-filho" className="block px-4 py-2 hover:bg-gray-100">Cadastrar Filho</Link>
              <Link to="/pai-dashboard" className="block px-4 py-2 hover:bg-gray-100">Painel</Link>
            </div>
          )}
        </div>

        {/* Menu Admin */}
        <div className="relative">
          <button onClick={toggleAdmin} className="hover:underline">
            Admin
          </button>
          {openAdmin && (
            <div className="absolute right-0 bg-white text-black rounded shadow mt-2 min-w-[12rem] z-50">
              <Link to="/admin/login" className="block px-4 py-2 hover:bg-gray-100">Login</Link>
              <Link to="/admin/register" className="block px-4 py-2 hover:bg-gray-100">Cadastro</Link>
              <Link to="/admin/dashboard" className="block px-4 py-2 hover:bg-gray-100">Painel</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
