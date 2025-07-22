import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect, useRef, useState } from 'react';

export default function AdminScanQR() {
  const [resultado, setResultado] = useState<any>(null);
  const [horaRegistro, setHoraRegistro] = useState('');
  const [ultimaLeitura, setUltimaLeitura] = useState('');
  const [mensagem, setMensagem] = useState('');
  const scannerRef = useRef<HTMLDivElement>(null);

  const handleScan = (data: string) => {
    if (!data || data === ultimaLeitura) return;

    try {
      const obj = JSON.parse(data);
      setResultado(obj);
      setUltimaLeitura(data);

      const hora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setHoraRegistro(hora);
      setMensagem(`✅ ${obj.acao === 'entrada' ? 'Entrada' : 'Saída'} registrada com sucesso às ${hora}`);

      setTimeout(() => setMensagem(''), 6000);
    } catch (e) {
      setMensagem('❌ QR Code inválido');
      setTimeout(() => setMensagem(''), 3000);
    }
  };

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      {
        fps: 10,
        qrbox: 250
      },
      false // verbose desativado
    );


    scanner.render(
      (text) => handleScan(text),
      (error) => { } // Silencia erros de leitura contínuos
    );

    return () => {
      scanner.clear().catch(() => { });
    };
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 bg-white rounded shadow text-center">
      <h2 className="text-2xl font-bold mb-4">Leitor de QR Code - Admin</h2>

      <div id="qr-reader" ref={scannerRef} className="mb-4" />

      {mensagem && (
        <div className={`mt-4 font-semibold ${mensagem.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
          {mensagem}
        </div>
      )}

      {resultado && (
        <div className="mt-6 text-left">
          <h3 className="text-lg font-semibold mb-2">📋 Dados lidos:</h3>
          <p><strong>Ação:</strong> {resultado.acao}</p>
          <p><strong>Nome:</strong> {resultado.nome}</p>
          <p><strong>Código:</strong> {resultado.codigo}</p>
          <p><strong>Data:</strong> {resultado.data}</p>
          <p><strong>Horário registrado:</strong> {horaRegistro}</p>
        </div>
      )}
    </div>
  );
}
