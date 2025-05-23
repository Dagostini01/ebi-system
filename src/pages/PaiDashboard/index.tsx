import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function PaiDashboard() {
  const [filhos, setFilhos] = useState([
    {
      nome: 'Ana Beatriz',
      idade: 6,
      codigo: 'ABC123',
      entrada: '',
      saida: ''
    },
    {
      nome: 'João Pedro',
      idade: 4,
      codigo: 'XYZ789',
      entrada: '',
      saida: ''
    }
  ]);

  const registrarEntrada = (idx: number) => {
    const agora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const atualizados = [...filhos];
    atualizados[idx].entrada = agora;
    setFilhos(atualizados);
  };

  const registrarSaida = (idx: number) => {
    const agora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const atualizados = [...filhos];
    atualizados[idx].saida = agora;
    setFilhos(atualizados);
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Painel do Responsável</h2>

      <div className="mb-4 text-right">
        <Link to="/cadastro-filho" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          + Adicionar novo filho
        </Link>
      </div>

      {filhos.map((filho, idx) => (
        <div key={idx} className="border p-4 rounded mb-4">
          <p><strong>Nome:</strong> {filho.nome}</p>
          <p><strong>Idade:</strong> {filho.idade} anos</p>
          <p><strong>Código de retirada:</strong> <span className="text-blue-600 font-mono">{filho.codigo}</span></p>

          <p><strong>Entrada:</strong> {filho.entrada || '—'}</p>
          <p><strong>Saída:</strong> {filho.saida || '—'}</p>

          <div className="flex gap-2 mt-2">
            <button
              onClick={() => registrarEntrada(idx)}
              className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
            >
              📥 Entrada
            </button>
            <button
              onClick={() => registrarSaida(idx)}
              className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
            >
              📤 Saída
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
