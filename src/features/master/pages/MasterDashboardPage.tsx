import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  fetchAllEbiContextsForDate,
  fetchComunsCongregacao,
  fetchCurrentStaff,
  fetchStaffList
} from '@/domain/ebi/services/ebi';
import type { ComumCongregacao, EbiDayContext, StaffProfile } from '@/domain/ebi/types';
import { StatCard } from '@/shared/ui/StatCard';
import { formatWeekdayList, getWeekdayLabel } from '@/shared/utils/weekday';

export default function MasterDashboardPage() {
  const hoje = new Date().toISOString().split('T')[0];
  const [staff, setStaff] = useState<StaffProfile | null>(null);
  const [comuns, setComuns] = useState<ComumCongregacao[]>([]);
  const [contextos, setContextos] = useState<EbiDayContext[]>([]);
  const [equipe, setEquipe] = useState<StaffProfile[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const [perfil, listaComuns, todosContextos, listaEquipe] = await Promise.all([
        fetchCurrentStaff(),
        fetchComunsCongregacao(),
        fetchAllEbiContextsForDate(hoje),
        fetchStaffList()
      ]);
      setStaff(perfil);
      setComuns(listaComuns);
      setContextos(todosContextos);
      setEquipe(listaEquipe);
    } finally {
      setCarregando(false);
    }
  }, [hoje]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const semAdmin = comuns.filter((c) => !c.adminId).length;
  const abertos = contextos.filter((item) => item.status === 'aberto').length;

  return (
    <div className="space-y-6">
      <section className="page-shell">
        <p className="status-chip bg-slate-900 text-white">Master</p>
        <h1 className="page-title">Gestão do sistema</h1>
        <p className="page-subtitle">
          1) Cadastre a comum com dias e horários do EBI · 2) Vincule um administrador · 3) O admin cadastra coordenadores.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <StatCard label="Comuns ativas" value={String(comuns.length)} />
          <StatCard label="Comuns sem admin" value={String(semAdmin)} valueClassName={semAdmin > 0 ? 'text-amber-600' : 'text-slate-900'} />
          <StatCard label="EBIs abertos hoje" value={String(abertos)} valueClassName="text-emerald-600" />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/master/comuns/nova" className="secondary-button bg-slate-900">
            Nova comum congregação
          </Link>
          <Link to="/master/cadastrar-admin" className="ghost-button">
            Cadastrar administrador
          </Link>
        </div>
      </section>

      <section className="page-shell">
        <h2 className="text-lg font-bold text-slate-900">Comuns cadastradas</h2>
        {carregando ? (
          <p className="mt-4 text-sm text-slate-500">Carregando…</p>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {comuns.map((comum) => {
              const ctx = contextos.find((c) => c.comumId === comum.id);
              const admin = equipe.find((m) => m.id === comum.adminId);
              return (
                <article key={comum.id} className="glass-card">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="font-bold text-slate-900">{comum.nome}</p>
                    {!comum.adminId && (
                      <Link
                        to={`/master/cadastrar-admin?comumId=${comum.id}`}
                        className="text-xs font-semibold text-sky-600 hover:text-sky-800"
                      >
                        + Admin
                      </Link>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    {comum.cidade}/{comum.estado}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    EBI: {formatWeekdayList(comum.diasEbi)} · {comum.horarioInicio}–{comum.horarioFim}
                  </p>
                  <p className="mt-2 text-sm">
                    Admin:{' '}
                    <span className="font-semibold">{admin ? admin.nome : 'pendente'}</span>
                  </p>
                  {ctx && (
                    <p className="mt-1 text-sm text-slate-500">
                      Hoje ({getWeekdayLabel(ctx.weekday)}):{' '}
                      {ctx.status === 'aberto' ? 'EBI aberto' : ctx.status === 'encerrado' ? 'encerrado' : 'fechado'}
                      {!ctx.scheduledToday && ' · sem culto'}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="page-shell">
        <h2 className="text-lg font-bold text-slate-900">Equipe</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="app-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Perfil</th>
                <th>Comum</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {equipe.map((membro) => (
                <tr key={membro.id}>
                  <td>{membro.nome}</td>
                  <td className="capitalize">{membro.role}</td>
                  <td>{membro.comum ?? '—'}</td>
                  <td>{membro.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {staff && <p className="mt-4 text-xs text-slate-400">Logado como master ({staff.email})</p>}
      </section>
    </div>
  );
}
