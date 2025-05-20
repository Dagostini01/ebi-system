// src/pages/PaiDashboard.tsx
import { Link } from 'react-router-dom';

export default function PaiDashboard() {
  const filhosMock = [
    {
      nome: 'Ana Beatriz',
      idade: 6,
      codigo: 'ABC123',
      entrada: '19:45',
      saida: ''
    },
    {
      nome: 'João Pedro',
      idade: 4,
      codigo: 'XYZ789',
      entrada: '19:48',
      saida: '21:00'
    }
  ];

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Painel do Responsável</h2>

      <div className="mb-4 text-right">
        <Link to="/cadastro-filho" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          + Adicionar novo filho
        </Link>
      </div>

      {filhosMock.map((filho, idx) => (
        <div key={idx} className="border p-4 rounded mb-4">
          <p><strong>Nome:</strong> {filho.nome}</p>
          <p><strong>Idade:</strong> {filho.idade} anos</p>
          <p><strong>Código de retirada:</strong> <span className="text-blue-600 font-mono">{filho.codigo}</span></p>
          <p><strong>Entrada:</strong> {filho.entrada || '—'}</p>
          <p><strong>Saída:</strong> {filho.saida || '—'}</p>
        </div>
      ))}
    </div>
  );
}
