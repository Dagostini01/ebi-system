import { useState } from 'react';

export default function CadastroFilho() {
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [observacoes, setObservacoes] = useState('');
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
    console.log({ nome, idade, dataNascimento, observacoes, comum });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold text-center mb-4">Cadastro de Criança</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nome da criança"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Idade"
          value={idade}
          onChange={(e) => setIdade(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="date"
          placeholder="Data de nascimento"
          value={dataNascimento}
          onChange={(e) => setDataNascimento(e.target.value)}
          className="w-full px-3 py-2 border rounded"
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
        <textarea
          placeholder="Observações (alergias, etc.)"
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          className="w-full px-3 py-2 border rounded"
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
