import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { fetchCheckInsForDate } from '@/domain/ebi/services/ebi';
import type { CheckInEvent } from '@/domain/ebi/types';
import { StatCard } from '@/shared/ui/StatCard';

export default function AdminPresencasDoDiaPage() {
  const navigate = useNavigate();
  const dataHoje = new Date().toISOString().split('T')[0];
  const [presencas, setPresencas] = useState<CheckInEvent[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    setErro(null);

    void fetchCheckInsForDate(dataHoje)
      .then((rows) => {
        if (ativo) setPresencas(rows);
      })
      .catch(() => {
        if (ativo) setErro('Não foi possível carregar as presenças.');
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [dataHoje]);

  const totalEntradas = presencas.filter((presenca) => presenca.acao === 'entrada').length;
  const totalSaidas = presencas.filter((presenca) => presenca.acao === 'saida').length;

  return (
    <div className="space-y-8">
      <section className="page-shell">
        <div className="page-header">
          <div>
            <p className="status-chip-blue">Operação do dia</p>
            <h1 className="page-title">Presenças de hoje</h1>
            <p className="page-subtitle">
              Acompanhe a movimentação do culto com uma visão mais limpa das entradas e saídas registradas em {dataHoje}.
            </p>
          </div>

          <button type="button" onClick={() => navigate('/admin/dashboard')} className="secondary-button w-full sm:w-auto">
            Ver histórico por data
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Registros do dia" value={presencas.length} />
          <StatCard label="Entradas" value={totalEntradas} valueClassName="text-emerald-600" />
          <StatCard label="Saídas" value={totalSaidas} valueClassName="text-rose-500" />
        </div>
      </section>

      {carregando && <p className="glass-card text-center text-slate-600">Carregando…</p>}
      {erro && <p className="glass-card text-center font-medium text-rose-600">{erro}</p>}

      {!carregando && !erro && presencas.length === 0 ? (
        <p className="glass-card text-center text-slate-500">Nenhuma presença registrada hoje.</p>
      ) : (
        !carregando &&
        !erro && (
          <div className="space-y-4">
            {presencas.map((presenca) => (
              <div key={presenca.id} className="page-shell flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-black text-slate-900">{presenca.nome}</h2>
                    <span className={presenca.acao === 'entrada' ? 'status-chip-green' : 'status-chip-rose'}>
                      {presenca.acao === 'entrada' ? 'Entrada' : 'Saída'}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">Comum: {presenca.comum}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="glass-card text-center">
                    <p className="text-sm font-semibold text-slate-500">Horário</p>
                    <p className="mt-2 text-2xl font-black text-slate-900">{presenca.horario}</p>
                  </div>
                  <div className="glass-card text-center">
                    <p className="text-sm font-semibold text-slate-500">Código</p>
                    <p className="mt-2 break-all text-base font-black tracking-[0.12em] text-sky-600 sm:text-lg">{presenca.codigo}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
