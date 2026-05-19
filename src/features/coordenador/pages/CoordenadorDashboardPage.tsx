import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { fetchCurrentStaff, fetchTodayEbiContextForStaff } from '@/domain/ebi/services/ebi';
import type { EbiDayContext, StaffProfile } from '@/domain/ebi/types';
import { StatCard } from '@/shared/ui/StatCard';
import { formatWeekdayList, getWeekdayLabel } from '@/shared/utils/weekday';

export default function CoordenadorDashboardPage() {
  const [coordenador, setCoordenador] = useState<StaffProfile | null>(null);
  const [contexto, setContexto] = useState<EbiDayContext | null>(null);
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const [perfil, ctx] = await Promise.all([fetchCurrentStaff(), fetchTodayEbiContextForStaff()]);
      setCoordenador(perfil);
      setContexto(ctx);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const statusLabel =
    contexto?.status === 'aberto'
      ? 'Aberto — pode escanear'
      : contexto?.status === 'encerrado'
        ? 'Encerrado'
        : 'Aguardando o admin abrir';

  return (
    <div className="space-y-6">
      <section className="page-shell">
        <p className="status-chip-amber">Coordenador</p>
        <h1 className="page-title">Recepção do EBI</h1>
        <p className="page-subtitle">
          {coordenador ? `${coordenador.nome} · ${coordenador.comum}` : 'Carregando…'}
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Seu papel: ler QR Codes e acompanhar o EBI do dia. Abrir ou encerrar o culto é com o administrador.
        </p>

        {carregando ? (
          <p className="mt-6 text-sm text-slate-500">Carregando…</p>
        ) : contexto ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Comum" value={contexto.comum} />
            <StatCard label="Hoje" value={getWeekdayLabel(contexto.weekday)} />
            <StatCard label="Horário EBI" value={`${contexto.horarioInicio}–${contexto.horarioFim}`} />
            <StatCard
              label="Status"
              value={statusLabel}
              valueClassName={contexto.status === 'aberto' ? 'text-emerald-600 text-lg' : 'text-slate-900 text-lg'}
            />
          </div>
        ) : null}

        {contexto && (
          <p className="mt-4 text-sm text-slate-600">
            Dias do EBI nesta comum: {formatWeekdayList(contexto.diasConfigurados)}
            {!contexto.scheduledToday && ' · hoje não há culto programado'}
          </p>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/admin/escanear"
            className={`primary-button ${contexto?.status !== 'aberto' ? 'pointer-events-none opacity-50' : ''}`}
          >
            Escanear QR Code
          </Link>
          <Link to="/admin/presencas-do-dia" className="ghost-button">
            Ver presenças do dia
          </Link>
        </div>
      </section>
    </div>
  );
}
