import { useState } from 'react';
import { Link } from 'react-router-dom';
import QRCode from 'react-qr-code';

export default function PaiDashboard() {
  const [qrFilhoIndex, setQrFilhoIndex] = useState<number | null>(null);
  const [qrTipo, setQrTipo] = useState<'entrada' | 'saida' | null>(null);

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

  const gerarQRCode = (idx: number, tipo: 'entrada' | 'saida') => {
    setQrFilhoIndex(idx);
    setQrTipo(tipo);
  };

  const getQrData = (idx: number, tipo: 'entrada' | 'saida') => {
    const filho = filhos[idx];
    const dataAtual = new Date().toISOString().split('T')[0];
    return JSON.stringify({
      acao: tipo,
      nome: filho.nome,
      codigo: filho.codigo,
      data: dataAtual
    });
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Painel do Responsável</h2>

      <div className="mb-4 text-right">
        <Link to="/cadastro-filho" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          + Adicionar novo filho
        </Link>
      </div>

      {filhos.map((filho, idx) => (
        <div key={idx} className="border p-4 rounded mb-6 bg-gray-50">
          <p><strong>Nome:</strong> {filho.nome}</p>
          <p><strong>Idade:</strong> {filho.idade} anos</p>
          <p><strong>Código de retirada:</strong> <span className="text-blue-600 font-mono">{filho.codigo}</span></p>
          <p><strong>Entrada:</strong> {filho.entrada || '—'}</p>
          <p><strong>Saída:</strong> {filho.saida || '—'}</p>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => gerarQRCode(idx, 'entrada')}
                className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
              >
                📥 QR Entrada
              </button>
              <button
                onClick={() => gerarQRCode(idx, 'saida')}
                className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
              >
                📤 QR Saída
              </button>
            </div>

            {qrFilhoIndex === idx && qrTipo && (
              <div className="bg-white p-2 rounded border">
                <QRCode value={getQrData(idx, qrTipo)} size={100} />
                <p className="text-sm text-center mt-1 text-gray-600">
                  {qrTipo === 'entrada' ? 'Entrada' : 'Saída'}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
