import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, senha });
    navigate('/admin/dashboard');
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold text-center mb-4">Login do Administrador</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email do administrador"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <button type="submit" className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-900">
          Acessar Painel
        </button>
      </form>
    </div>
  );
}
