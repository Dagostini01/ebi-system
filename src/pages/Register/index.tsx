import { useState } from 'react';

export default function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [igreja, setIgreja] = useState('');

  const igrejasDisponiveis = [
    'Central - SP',
    'Zona Leste - SP',
    'Campinas - SP',
    'Belo Horizonte - MG',
    'Porto Alegre - RS'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ nome, email, telefone, senha, igreja });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold text-center mb-4">Cadastro do Responsável</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nome completo"
          value={nome}
          onChange={e => setNome(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="tel"
          placeholder="Telefone"
          value={telefone}
          onChange={e => setTelefone(e.target.value)}
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
        <select
          value={igreja}
          onChange={e => setIgreja(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        >
          <option value="">Selecione sua igreja</option>
          {igrejasDisponiveis.map((nome, index) => (
            <option key={index} value={nome}>{nome}</option>
          ))}
        </select>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Cadastrar
        </button>
      </form>
    </div>
  );
}
