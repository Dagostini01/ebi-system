import { useState } from 'react';
import { Link } from 'react-router-dom';
import * as QRCode from 'qrcode';

export default function PaiDashboard() {
  const [qrFilhoIndex, setQrFilhoIndex] = useState<number | null>(null);
  const [qrTipo, setQrTipo] = useState<'entrada' | 'saida' | null>(null);
  const [qrImagem, setQrImagem] = useState<string | null>(null);

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

  const gerarQRCode = async (idx: number, tipo: 'entrada' | 'saida') => {
    setQrFilhoIndex(idx);
    setQrTipo(tipo);

    const filho = filhos[idx];
    const dataAtual = new Date().toISOString().split('T')[0];

    const qrData = JSON.stringify({
      acao: tipo,
      nome: filho.nome,
      codigo: filho.codigo,
      data: dataAtual
    });

    try {
      const url = await QRCode.toDataURL(qrData);
      setQrImagem(url);
    } catch (err) {
      console.error('Erro ao gerar QR Code', err);
    }
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
        <div key={idx} className="border p-4 rounded mb-6 bg-gray-50 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <p><strong>Nome:</strong> {filho.nome}</p>
            <p><strong>Idade:</strong> {filho.idade} anos</p>
            <p><strong>Código de retirada:</strong> <span className="text-blue-600 font-mono">{filho.codigo}</span></p>
            <p><strong>Entrada:</strong> {filho.entrada || '—'}</p>
            <p><strong>Saída:</strong> {filho.saida || '—'}</p>

            <div className="flex gap-2 mt-3">
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
          </div>

          {qrFilhoIndex === idx && qrTipo && qrImagem && (
            <div className="bg-white p-2 rounded border">
              <img src={qrImagem} alt="QR Code" width={100} height={100} />
              <p className="text-sm text-center mt-1 text-gray-600">
                {qrTipo === 'entrada' ? 'Entrada' : 'Saída'}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
