import { useState } from 'react';

export default function AdminDashboard() {
  const [dataSelecionada, setDataSelecionada] = useState('');
  
  const presencasMock = [
    {
      data: '2025-05-20',
      nomeCrianca: 'Ana Beatriz',
      entrada: '19:45',
      saida: '21:00',
      responsavel: 'João e Maria Silva',
      comum: 'Vila Ré'
    },
    {
      data: '2025-05-20',
      nomeCrianca: 'João Pedro',
      entrada: '19:50',
      saida: '',
      responsavel: 'Carlos Mendes',
      comum: 'Campinas - SP'
    },
    {
      data: '2025-05-19',
      nomeCrianca: 'Beatriz Lima',
      entrada: '19:30',
      saida: '20:50',
      responsavel: 'Luciana Lima',
      comum: 'Zona Leste - SP'
    }
  ];

  const presencasFiltradas = presencasMock.filter(p => p.data === dataSelecionada);

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Painel do Administrador</h2>

      <div className="mb-6">
        <label className="block mb-1 font-medium text-gray-700">Selecione uma data:</label>
        <input
          type="date"
          value={dataSelecionada}
          onChange={(e) => setDataSelecionada(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-64"
        />
      </div>

      {dataSelecionada && presencasFiltradas.length > 0 ? (
        <div>
          <h3 className="text-lg font-semibold mb-4">Presenças em {dataSelecionada}</h3>
          {presencasFiltradas.map((p, idx) => (
            <div key={idx} className="border p-4 rounded mb-3 bg-gray-50">
              <p><strong>Criança:</strong> {p.nomeCrianca}</p>
              <p><strong>Responsável:</strong> {p.responsavel}</p>
              <p><strong>Comum:</strong> {p.comum}</p>
              <p><strong>Entrada:</strong> {p.entrada || '—'} | <strong>Saída:</strong> {p.saida || '—'}</p>
            </div>
          ))}
        </div>
      ) : dataSelecionada ? (
        <p className="text-gray-500 italic">Nenhuma presença registrada para esta data.</p>
      ) : (
        <p className="text-gray-500 italic">Selecione uma data para visualizar o histórico.</p>
      )}
    </div>
  );
}
