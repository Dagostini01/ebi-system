import { useState } from 'react';

export default function CadastroFilho() {
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ nome, idade, dataNascimento, observacoes });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold text-center mb-4">Cadastro de Criança</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nome da criança"
          value={nome}
          onChange={e => setNome(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Idade"
          value={idade}
          onChange={e => setIdade(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="date"
          value={dataNascimento}
          onChange={(e) => setDataNascimento(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />

        <textarea
          placeholder="Observações (alergias, necessidades, etc)"
          value={observacoes}
          onChange={e => setObservacoes(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          rows={3}
        ></textarea>
        <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
          Cadastrar Criança
        </button>
      </form>
    </div>
  );
}