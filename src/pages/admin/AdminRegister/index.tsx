// src/pages/admin/AdminRegister.tsx
import { useState } from 'react';

export default function AdminRegister() {
  const [nome, setNome] = useState('');
  const [cargo, setCargo] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [comum, setComum] = useState('');

  const comuns = [
    'Vila Ré',
    'Central - SP',
    'Zona Leste - SP',
    'Campinas - SP',
    'Belo Horizonte - MG',
    'Porto Alegre - RS'
  ];

  const cargos = [
    'Auxiliar Espaço Infantil',
    'Coordenador'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ nome, cpf, cargo, email, senha, comum });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold text-center mb-4">Cadastro de Administrador</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <select
          value={cargo}
          onChange={(e) => setCargo(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        >
          <option value="">Selecione o cargo</option>
          {cargos.map((c, idx) => (
            <option key={idx} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={comum}
          onChange={(e) => setComum(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        >
          <option value="">Selecione a comum</option>
          {comuns.map((nome, idx) => (
            <option key={idx} value={nome}>{nome}</option>
          ))}
        </select>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}
