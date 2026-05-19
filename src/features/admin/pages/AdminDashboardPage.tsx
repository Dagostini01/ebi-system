import { useCallback, useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import {
  closeTodayEbi,
  fetchAggregatedPresencesForDate,
  fetchCurrentStaff,
  fetchTodayEbiContextForStaff,
  openTodayEbi
} from '@/domain/ebi/services/ebi';
import type { AggregatedPresence, EbiDayContext, StaffProfile } from '@/domain/ebi/types';
import { canOpenCloseEbi, canRegisterCoordenador } from '@/domain/ebi/auth/permissions';
import { StatCard } from '@/shared/ui/StatCard';
import { formatWeekdayList, getWeekdayLabel } from '@/shared/utils/weekday';

export default function AdminDashboardPage() {
  const hoje = new Date().toISOString().split('T')[0];
  const [dataSelecionada, setDataSelecionada] = useState(hoje);
  const [presencas, setPresencas] = useState<AggregatedPresence[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [admin, setAdmin] = useState<StaffProfile | null>(null);
  const [contextoHoje, setContextoHoje] = useState<EbiDayContext | null>(null);
  const [carregandoHoje, setCarregandoHoje] = useState(true);
  const [acaoErro, setAcaoErro] = useState<string | null>(null);
  const [executandoAcao, setExecutandoAcao] = useState(false);

  const carregarResumoHoje = useCallback(async () => {
    setCarregandoHoje(true);
    setAcaoErro(null);
    try {
      const [adminAtual, contexto] = await Promise.all([fetchCurrentStaff(), fetchTodayEbiContextForStaff()]);
      setAdmin(adminAtual);
      setContextoHoje(contexto);
    } catch {
      setAcaoErro('Não foi possível carregar o status do EBI de hoje.');
    } finally {
      setCarregandoHoje(false);
    }
  }, []);

  useEffect(() => {
    void carregarResumoHoje();
  }, [carregarResumoHoje]);

  useEffect(() => {
    if (!dataSelecionada) {
      setPresencas([]);
      setErro(null);
      return;
    }

    let ativo = true;
    setCarregando(true);
    setErro(null);

    void fetchAggregatedPresencesForDate(dataSelecionada)
      .then((rows) => {
        if (ativo) setPresencas(rows);
      })
      .catch(() => {
        if (ativo) setErro('Não foi possível carregar o histórico.');
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [dataSelecionada]);

  const totalRegistros = presencas.length;
  const comEntrada = presencas.filter((item) => item.entrada).length;
  const comSaida = presencas.filter((item) => item.saida).length;
  const podeOperarEbi = admin ? canOpenCloseEbi(admin.role) : false;
  const podeCadastrarCoord = admin ? canRegisterCoordenador(admin.role) && admin.role === 'admin' : false;

  const handleAbrir = async () => {
    setExecutandoAcao(true);
    setAcaoErro(null);
    try {
      const contexto = await openTodayEbi();
      setContextoHoje(contexto);
    } catch (error) {
      setAcaoErro(error instanceof Error ? error.message : 'Não foi possível abrir o EBI.');
    } finally {
      setExecutandoAcao(false);
    }
  };

  const handleEncerrar = async () => {
    setExecutandoAcao(true);
    setAcaoErro(null);
    try {
      const contexto = await closeTodayEbi();
      setContextoHoje(contexto);
    } catch (error) {
      setAcaoErro(error instanceof Error ? error.message : 'Não foi possível encerrar o EBI.');
    } finally {
      setExecutandoAcao(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="page-shell">
        <div className="page-header">
          <div>
            <p className="status-chip-blue">Administrador</p>
            <h1 className="page-title">Painel da comum</h1>
            <p className="page-subtitle">
              Abra e encerre o EBI nos dias da comum, consulte histórico e cadastre coordenadores para a recepção.
            </p>
          </div>

          <div className="glass-card w-full sm:w-auto">
            <label className="app-label" htmlFor="dataSelecionada">
              Selecione a data
            </label>
            <input
              id="dataSelecionada"
              type="date"
              value={dataSelecionada}
              onChange={(e) => setDataSelecionada(e.target.value)}
              className="app-input w-full sm:min-w-[240px]"
            />
          </div>
        </div>

        {podeCadastrarCoord && (
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/admin/cadastrar-coordenador" className="ghost-button">
              Cadastrar coordenador
            </Link>
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="glass-card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-500">Comum congregação</p>
                <h2 className="mt-2 text-2xl font-black text-slate-900">{admin?.comum ?? 'Carregando...'}</h2>
              </div>
              {contextoHoje && (
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
                        : 'EBI fechado'}
                </span>
              )}
            </div>

            {carregandoHoje ? (
              <p className="mt-4 text-sm text-slate-500">Carregando status de hoje…</p>
            ) : (
              <>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Dias configurados: {contextoHoje ? formatWeekdayList(contextoHoje.diasConfigurados) : 'nenhum dia selecionado'}.
                </p>
                {contextoHoje && (
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Hoje é {getWeekdayLabel(contextoHoje.weekday)} · horário {contextoHoje.horarioInicio}–{contextoHoje.horarioFim}.
                    {contextoHoje.scheduledToday
                      ? ' Abra o EBI para os coordenadores escanearem os QR Codes.'
                      : ' Não há EBI programado para hoje nesta comum.'}
                  </p>
                )}
              </>
            )}
          </div>

          {podeOperarEbi && (
            <div className="glass-card">
              <p className="text-sm font-semibold text-slate-500">Controle do EBI hoje</p>
              {acaoErro && <p className="mt-3 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{acaoErro}</p>}

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={() => void handleAbrir()}
                  disabled={executandoAcao || carregandoHoje || !contextoHoje?.scheduledToday || contextoHoje.status !== 'fechado'}
                  className="secondary-button w-full sm:w-auto"
                >
                  {executandoAcao && contextoHoje?.status === 'fechado' ? 'Abrindo…' : 'Abrir EBI de hoje'}
                </button>
                <button
                  type="button"
                  onClick={() => void handleEncerrar()}
                  disabled={executandoAcao || carregandoHoje || contextoHoje?.status !== 'aberto'}
                  className="danger-button w-full sm:w-auto"
                >
                  {executandoAcao && contextoHoje?.status === 'aberto' ? 'Encerrando…' : 'Encerrar EBI'}
                </button>
              </div>

              {contextoHoje?.abertoEm && (
                <p className="mt-4 text-sm text-slate-500">
                  Aberto às {contextoHoje.abertoEm}
                  {contextoHoje.encerradoEm ? ` e encerrado às ${contextoHoje.encerradoEm}` : ''}.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Crianças com registro" value={totalRegistros} />
          <StatCard label="Com entrada" value={comEntrada} valueClassName="text-emerald-600" />
          <StatCard label="Com saída" value={comSaida} valueClassName="text-rose-500" />
        </div>
      </section>

      {dataSelecionada && carregando && <p className="glass-card text-slate-600">Carregando…</p>}
      {dataSelecionada && erro && <p className="glass-card font-medium text-rose-600">{erro}</p>}

      {dataSelecionada && !carregando && !erro && presencas.length > 0 ? (
        <section className="space-y-4">
          {presencas.map((presenca) => (
            <div key={`${presenca.date}-${presenca.childId}`} className="page-shell">
              <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900 sm:text-2xl">{presenca.nomeCrianca}</h2>
                  <p className="mt-2 text-sm text-slate-500">Responsável: {presenca.responsavel}</p>
                </div>
                <span className="status-chip-blue self-start sm:self-auto">{presenca.comum}</span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="glass-card">
                  <p className="text-sm font-semibold text-slate-500">Entrada</p>
                  <p className="mt-2 text-2xl font-black text-emerald-600 sm:text-3xl">{presenca.entrada || '—'}</p>
                </div>
                <div className="glass-card">
                  <p className="text-sm font-semibold text-slate-500">Saída</p>
                  <p className="mt-2 text-2xl font-black text-rose-500 sm:text-3xl">{presenca.saida || '—'}</p>
                </div>
              </div>
            </div>
          ))}
        </section>
      ) : dataSelecionada && !carregando && !erro ? (
        <p className="glass-card text-slate-500">Nenhuma presença registrada para esta data.</p>
      ) : (
        !dataSelecionada && <p className="glass-card text-slate-500">Selecione uma data para visualizar o histórico.</p>
      )}
    </div>
  );
}
