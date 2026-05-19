import { Html5QrcodeScanner } from 'html5-qrcode';
import { useCallback, useEffect, useRef, useState } from 'react';

import { registerScan } from '@/domain/ebi/services/ebi';
import type { CheckInEvent, QrPayloadV1 } from '@/domain/ebi/types';
import { parseQrPayload } from '@/shared/lib/qrPayload';

export default function AdminScanQrPage() {
  const [resultado, setResultado] = useState<QrPayloadV1 | null>(null);
  const [eventoRegistrado, setEventoRegistrado] = useState<CheckInEvent | null>(null);
  const [mensagem, setMensagem] = useState('');
  const ultimaLeituraRef = useRef('');

  const handleScan = useCallback(async (data: string) => {
    if (!data || data === ultimaLeituraRef.current) return;

    const payload = parseQrPayload(data);
    if (!payload) {
      setMensagem('❌ QR Code inválido');
      setTimeout(() => setMensagem(''), 3000);
      return;
    }

    ultimaLeituraRef.current = data;

    try {
      const evento = await registerScan(payload);
      setResultado(payload);
      setEventoRegistrado(evento);
      setMensagem(`✅ ${payload.acao === 'entrada' ? 'Entrada' : 'Saída'} registrada com sucesso às ${evento.horario}`);
      setTimeout(() => setMensagem(''), 6000);
    } catch (error) {
      setResultado(null);
      setEventoRegistrado(null);
      const message = error instanceof Error ? error.message : 'Falha ao registrar';
      setMensagem(`❌ ${message}`);
      setTimeout(() => setMensagem(''), 4000);
    }
  }, []);

  useEffect(() => {
    const qrbox = Math.max(180, Math.min(window.innerWidth - 96, 250));
    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      {
        fps: 10,
        qrbox
      },
      false
    );

    scanner.render(
      (text) => {
        void handleScan(text);
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [handleScan]);

  return (
    <div className="space-y-8">
      <section className="page-shell">
        <div className="page-header">
          <div>
            <p className="status-chip-blue">Leitura em tempo real</p>
            <h1 className="page-title">Escanear QR Code</h1>
            <p className="page-subtitle">
              Use a câmera para registrar a entrada ou saída da criança. O sistema mostra o resultado logo após a leitura.
            </p>
          </div>

          <div className="glass-card max-w-sm">
            <p className="text-sm font-semibold text-slate-700">Fluxo sugerido</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Aponte a câmera para o QR do responsável e aguarde a confirmação verde antes de seguir para o próximo atendimento.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="glass-card">
            <div id="qr-reader" className="mx-auto w-full max-w-md" />
          </div>

          <div className="space-y-4">
            <div className="glass-card">
              <p className="text-sm font-semibold text-slate-500">Status da leitura</p>
              <div
                className={`mt-3 rounded-2xl px-4 py-4 text-sm font-semibold ${
                  mensagem
                    ? mensagem.startsWith('✅')
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-rose-50 text-rose-700'
                    : 'bg-slate-50 text-slate-500'
                }`}
              >
                {mensagem || 'Aguardando leitura da câmera.'}
              </div>
            </div>

            <div className="glass-card">
              <p className="text-sm font-semibold text-slate-500">Boas práticas</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                <li>Centralize o QR na câmera.</li>
                <li>Evite movimentar o celular durante a leitura.</li>
                <li>Confira o nome e o horário antes de liberar a passagem.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {resultado && eventoRegistrado && (
        <section className="page-shell">
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div>
              <p className={resultado.acao === 'entrada' ? 'status-chip-green' : 'status-chip-rose'}>
                {resultado.acao === 'entrada' ? 'Entrada confirmada' : 'Saída confirmada'}
              </p>
              <h2 className="mt-3 text-2xl font-black text-slate-900">Último registro</h2>
            </div>
            <div className="glass-card w-full text-center sm:w-auto sm:min-w-[180px]">
              <p className="text-sm font-semibold text-slate-500">Horário</p>
              <p className="mt-2 text-3xl font-black text-slate-900">{eventoRegistrado.horario}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="glass-card">
              <p className="text-sm font-semibold text-slate-500">Criança</p>
              <p className="mt-2 text-lg font-bold text-slate-900">{eventoRegistrado.nome}</p>
            </div>
            <div className="glass-card">
              <p className="text-sm font-semibold text-slate-500">Ação</p>
              <p className="mt-2 text-lg font-bold capitalize text-slate-900">{resultado.acao}</p>
            </div>
            <div className="glass-card">
              <p className="text-sm font-semibold text-slate-500">Código</p>
              <p className="mt-2 break-all text-base font-black tracking-[0.12em] text-sky-600 sm:text-lg">{eventoRegistrado.codigo}</p>
            </div>
            <div className="glass-card">
              <p className="text-sm font-semibold text-slate-500">Data</p>
              <p className="mt-2 text-lg font-bold text-slate-900">{resultado.data}</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
