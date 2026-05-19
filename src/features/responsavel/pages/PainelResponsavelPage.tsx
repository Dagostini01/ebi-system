import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as QRCode from 'qrcode';

import {
  fetchCurrentResponsavel,
  fetchResponsavelChildrenWithTodayTimes,
  fetchTodayEbiContextForResponsavel
} from '@/domain/ebi/services/ebi';
import type { ChildWithTodayTimes, EbiDayContext, ResponsavelProfile } from '@/domain/ebi/types';
import { buildQrPayload } from '@/shared/lib/qrPayload';
import { StatCard } from '@/shared/ui/StatCard';
import { formatWeekdayList, getWeekdayLabel } from '@/shared/utils/weekday';

export default function PainelResponsavelPage() {
  const [filhos, setFilhos] = useState<ChildWithTodayTimes[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [responsavel, setResponsavel] = useState<ResponsavelProfile | null>(null);
  const [contextoHoje, setContextoHoje] = useState<EbiDayContext | null>(null);
  const [qrFilhoIndex, setQrFilhoIndex] = useState<number | null>(null);
  const [qrTipo, setQrTipo] = useState<'entrada' | 'saida' | null>(null);
  const [qrImagem, setQrImagem] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);

    try {
      const [childrenData, responsavelAtual, contexto] = await Promise.all([
        fetchResponsavelChildrenWithTodayTimes(),
        fetchCurrentResponsavel(),
        fetchTodayEbiContextForResponsavel()
      ]);
      setFilhos(childrenData);
      setResponsavel(responsavelAtual);
      setContextoHoje(contexto);
    } catch {
      setErro('Não foi possível carregar as crianças.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const gerarQRCode = async (idx: number, tipo: 'entrada' | 'saida') => {
    setQrFilhoIndex(idx);
    setQrTipo(tipo);

    const filho = filhos[idx];
    const dataAtual = new Date().toISOString().split('T')[0];
    const payload = buildQrPayload(tipo, filho.nome, filho.codigoRetirada, dataAtual);
    const qrData = JSON.stringify(payload);

    try {
      const url = await QRCode.toDataURL(qrData);
      setQrImagem(url);
    } catch (error) {
      console.error('Erro ao gerar QR Code', error);
    }
  };

  const totalFilhos = filhos.length;
  const comEntradaHoje = filhos.filter((filho) => filho.entradaHoje).length;
  const comSaidaHoje = filhos.filter((filho) => filho.saidaHoje).length;
  const ebiAberto = contextoHoje?.scheduledToday && contextoHoje.status === 'aberto';

  return (
    <div className="space-y-8">
      <section className="page-shell">
        <div className="page-header">
          <div>
            <p className="status-chip-green">Painel da família</p>
            <h1 className="page-title">Acompanhe as crianças e gere o QR na hora certa</h1>
            <p className="page-subtitle">
              Visualize rapidamente quem já entrou, quem já saiu e deixe o QR pronto para agilizar o atendimento no EBI.
            </p>
          </div>

          {ebiAberto ? (
            <Link to="/cadastro-filho" className="primary-button w-full sm:w-auto">
              + Adicionar nova criança
            </Link>
          ) : (
            <span className="w-full rounded-2xl bg-slate-200 px-5 py-3 text-center text-sm font-semibold text-slate-500 sm:w-auto">
              Cadastro liberado quando o EBI abrir
            </span>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <StatCard label="Crianças cadastradas" value={totalFilhos} />
          <StatCard label="Entradas hoje" value={comEntradaHoje} valueClassName="text-emerald-600" />
          <StatCard label="Saídas hoje" value={comSaidaHoje} valueClassName="text-rose-500" />
          <StatCard
            label="EBI hoje"
            value={
              !contextoHoje?.scheduledToday
                ? 'Sem programação'
                : contextoHoje.status === 'aberto'
                  ? 'Aberto'
                  : contextoHoje.status === 'encerrado'
                    ? 'Encerrado'
                    : 'Fechado'
            }
            valueClassName="text-slate-900 text-xl"
          />
        </div>

        {contextoHoje && (
          <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-500">Comum congregação</p>
                <p className="mt-1 text-xl font-black text-slate-900">{responsavel?.comum ?? contextoHoje.comum}</p>
              </div>
              <span
                className={
                  !contextoHoje.scheduledToday
                    ? 'status-chip-amber'
                    : contextoHoje.status === 'aberto'
                      ? 'status-chip-green'
                      : contextoHoje.status === 'encerrado'
                        ? 'status-chip-rose'
                        : 'status-chip-blue'
                }
              >
                {!contextoHoje.scheduledToday
                  ? 'Hoje sem EBI'
                  : contextoHoje.status === 'aberto'
                    ? 'EBI aberto'
                    : contextoHoje.status === 'encerrado'
                      ? 'EBI encerrado'
                      : 'Aguardando liberação'}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Hoje é {getWeekdayLabel(contextoHoje.weekday)}. Dias configurados: {formatWeekdayList(contextoHoje.diasConfigurados)}.
            </p>
            {!ebiAberto && (
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Cadastro de crianças e geração de QR ficam disponíveis somente depois que o admin abrir o EBI da sua comum.
              </p>
            )}
          </div>
        )}
      </section>

      {carregando && <p className="glass-card text-center text-slate-600">Carregando…</p>}
      {erro && <p className="glass-card text-center font-medium text-rose-600">{erro}</p>}

      {!carregando &&
        !erro &&
        filhos.map((filho, idx) => {
          const statusHoje = filho.saidaHoje ? 'finalizado' : filho.entradaHoje ? 'em andamento' : 'aguardando';
          const statusClass =
            statusHoje === 'finalizado'
              ? 'status-chip-rose'
              : statusHoje === 'em andamento'
                ? 'status-chip-green'
                : 'status-chip-amber';

          return (
            <section key={filho.id} className="page-shell grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-black text-slate-900">{filho.nome}</h2>
                  <span className={statusClass}>
                    {statusHoje === 'finalizado'
                      ? 'Saída registrada'
                      : statusHoje === 'em andamento'
                        ? 'Dentro do EBI'
                        : 'Aguardando entrada'}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="glass-card">
                    <p className="text-sm font-semibold text-slate-500">Idade</p>
                    <p className="mt-2 text-xl font-bold text-slate-900">{filho.idade} anos</p>
                  </div>
                  <div className="glass-card">
                    <p className="text-sm font-semibold text-slate-500">Código de retirada</p>
                    <p className="mt-2 break-all text-lg font-black tracking-[0.12em] text-sky-600 sm:text-xl sm:tracking-[0.2em]">
                      {filho.codigoRetirada}
                    </p>
                  </div>
                  <div className="glass-card">
                    <p className="text-sm font-semibold text-slate-500">Entrada de hoje</p>
                    <p className="mt-2 text-xl font-bold text-emerald-600">{filho.entradaHoje || '—'}</p>
                  </div>
                  <div className="glass-card">
                    <p className="text-sm font-semibold text-slate-500">Saída de hoje</p>
                    <p className="mt-2 text-xl font-bold text-rose-500">{filho.saidaHoje || '—'}</p>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <button type="button" onClick={() => gerarQRCode(idx, 'entrada')} className="primary-button w-full sm:w-auto" disabled={!ebiAberto}>
                    Gerar QR de entrada
                  </button>
                  <button type="button" onClick={() => gerarQRCode(idx, 'saida')} className="danger-button w-full sm:w-auto" disabled={!ebiAberto}>
                    Gerar QR de saída
                  </button>
                </div>
              </div>

              <div className="glass-card flex min-h-[220px] flex-col items-center justify-center text-center sm:min-h-[260px]">
                {!ebiAberto ? (
                  <>
                    <span className="status-chip-amber">QR bloqueado</span>
                    <p className="mt-4 text-lg font-semibold text-slate-900">Aguardando abertura do EBI</p>
                    <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                      Quando o admin abrir o EBI da comum {responsavel?.comum ?? contextoHoje?.comum}, os botões de QR serão liberados.
                    </p>
                  </>
                ) : qrFilhoIndex === idx && qrTipo && qrImagem ? (
                  <>
                    <span className={qrTipo === 'entrada' ? 'status-chip-green' : 'status-chip-rose'}>
                      {qrTipo === 'entrada' ? 'QR de entrada' : 'QR de saída'}
                    </span>
                    <img src={qrImagem} alt="QR Code" width={190} height={190} className="mt-4 w-full max-w-[190px] rounded-3xl bg-white p-3 shadow-sm" />
                    <p className="mt-4 text-sm leading-6 text-slate-500">
                      Apresente este QR para a equipe do EBI registrar {qrTipo === 'entrada' ? 'a chegada' : 'a retirada'}.
                    </p>
                  </>
                ) : (
                  <>
                    <span className="status-chip-blue">QR pronto em 1 clique</span>
                    <p className="mt-4 text-lg font-semibold text-slate-900">Selecione o tipo de QR acima</p>
                    <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                      O código será gerado aqui para facilitar a leitura no momento do atendimento.
                    </p>
                  </>
                )}
              </div>
            </section>
          );
        })}
    </div>
  );
}
