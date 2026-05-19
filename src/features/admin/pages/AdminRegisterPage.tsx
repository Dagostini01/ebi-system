import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { fetchComunsSemAdmin, fetchCurrentStaff, registerAdmin } from '@/domain/ebi/services/ebi';
import type { ComumCongregacao, StaffProfile } from '@/domain/ebi/types';
import { canRegisterAdmin } from '@/domain/ebi/auth/permissions';
import { formatWeekdayList } from '@/shared/utils/weekday';

export default function AdminRegisterPage() {
  const [searchParams] = useSearchParams();
  const comumIdInicial = searchParams.get('comumId') ?? '';

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [comumId, setComumId] = useState(comumIdInicial);
  const [comunsDisponiveis, setComunsDisponiveis] = useState<ComumCongregacao[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [adminCriado, setAdminCriado] = useState<StaffProfile | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [actor, setActor] = useState<StaffProfile | null>(null);

  useEffect(() => {
    void Promise.all([fetchCurrentStaff(), fetchComunsSemAdmin()]).then(([perfil, comuns]) => {
      setActor(perfil);
      setComunsDisponiveis(comuns);
      if (comumIdInicial && comuns.some((c) => c.id === comumIdInicial)) {
        setComumId(comumIdInicial);
      }
    });
  }, [comumIdInicial]);

  const comumSelecionada = comunsDisponiveis.find((c) => c.id === comumId);
  const podeCadastrar = actor ? canRegisterAdmin(actor.role) : false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setErro(null);
    setAdminCriado(null);
    try {
      const admin = await registerAdmin({ nome, cpf, email, senha, comumId });
      setAdminCriado(admin);
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Não foi possível cadastrar.');
    } finally {
      setEnviando(false);
    }
  };

  if (actor && !podeCadastrar) {
    return (
      <div className="mx-auto max-w-lg page-shell">
        <h1 className="text-xl font-bold text-slate-900">Acesso restrito</h1>
        <p className="mt-2 text-sm text-slate-600">Somente o master cadastra administradores.</p>
        <Link to="/master/dashboard" className="mt-4 inline-block font-semibold text-sky-600">
          Voltar ao painel
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl page-shell">
      <p className="status-chip-blue">Master · 1 admin por comum</p>
      <h1 className="mt-3 text-2xl font-black text-slate-900">Cadastrar administrador</h1>
      <p className="mt-2 text-sm text-slate-600">
        O administrador abre e encerra o EBI nos dias configurados na comum.
      </p>

      {comunsDisponiveis.length === 0 && (
        <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Não há comuns sem administrador.{' '}
          <Link to="/master/comuns/nova" className="font-semibold underline">
            Cadastre uma comum primeiro
          </Link>
          .
        </p>
      )}

      {erro && <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{erro}</p>}
      {adminCriado && (
        <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Admin <strong>{adminCriado.nome}</strong> vinculado à comum {adminCriado.comum}.
        </p>
      )}

      <form onSubmit={(e) => void handleSubmit(e)} className="mt-6 space-y-4">
        <div>
          <label className="app-label" htmlFor="comumId">
            Comum congregação
          </label>
          <select
            id="comumId"
            value={comumId}
            onChange={(e) => setComumId(e.target.value)}
            className="app-select"
            required
            disabled={comunsDisponiveis.length === 0}
          >
            <option value="">Selecione a comum</option>
            {comunsDisponiveis.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome} — {c.cidade}/{c.estado}
              </option>
            ))}
          </select>
          {comumSelecionada && (
            <p className="mt-2 text-sm text-slate-500">
              EBI: {formatWeekdayList(comumSelecionada.diasEbi)} · {comumSelecionada.horarioInicio}–
              {comumSelecionada.horarioFim}
            </p>
          )}
        </div>

        <div>
          <label className="app-label" htmlFor="nome">
            Nome completo
          </label>
          <input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} className="app-input" required />
        </div>

        <div>
          <label className="app-label" htmlFor="cpf">
            CPF
          </label>
          <input id="cpf" value={cpf} onChange={(e) => setCpf(e.target.value)} className="app-input" required />
        </div>

        <div>
          <label className="app-label" htmlFor="email">
            Email de acesso
          </label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="app-input" required />
        </div>

        <div>
          <label className="app-label" htmlFor="senha">
            Senha inicial
          </label>
          <input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} className="app-input" required />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={enviando || !comumId || comunsDisponiveis.length === 0}
            className="secondary-button bg-slate-900"
          >
            {enviando ? 'Salvando…' : 'Cadastrar administrador'}
          </button>
          <Link to="/master/dashboard" className="ghost-button">
            Voltar
          </Link>
        </div>
      </form>
    </div>
  );
}
