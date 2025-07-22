import { useNavigate } from 'react-router-dom';

export default function AdminPresencasDoDia() {
  const navigate = useNavigate();
  const dataHoje = new Date().toISOString().split('T')[0];

  const presencasHoje = [
    {
      nome: 'Ana Beatriz',
      codigo: 'ABC123',
      acao: 'entrada',
      horario: '19:45',
      comum: 'Vila Ré'
    },
    {
      nome: 'João Pedro',
      codigo: 'XYZ789',
      acao: 'saida',
      horario: '21:00',
      comum: 'Campinas - SP'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold text-center mb-4">
        Presenças do Dia – {dataHoje}
      </h2>

      {presencasHoje.length === 0 ? (
        <p className="text-center text-gray-500">Nenhuma presença registrada hoje.</p>
      ) : (
        <ul className="space-y-3">
          {presencasHoje.map((p, idx) => (
            <li key={idx} className="border p-4 rounded bg-gray-50">
              <p><strong>Criança:</strong> {p.nome}</p>
              <p><strong>Ação:</strong> {p.acao === 'entrada' ? '🟢 Entrada' : '🔴 Saída'}</p>
              <p><strong>Horário:</strong> {p.horario}</p>
              <p><strong>Comum:</strong> {p.comum}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="text-right mt-6">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ver histórico por data
        </button>
      </div>
    </div>
  );
}
