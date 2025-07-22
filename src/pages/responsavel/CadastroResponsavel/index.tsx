import { useState } from 'react';

export default function Register() {
  const [nomePai, setNomePai] = useState('');
  const [nomeMae, setNomeMae] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ nomePai, nomeMae, email, telefone, senha, comum });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold text-center mb-4">Cadastro do Responsável</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nome do Pai"
          value={nomePai}
          onChange={(e) => setNomePai(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="text"
          placeholder="Nome da Mãe"
          value={nomeMae}
          onChange={(e) => setNomeMae(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="tel"
          placeholder="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
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
