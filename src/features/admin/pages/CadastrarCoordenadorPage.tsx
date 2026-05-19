import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { fetchComunsCongregacao, fetchCurrentStaff, registerCoordenador } from '@/domain/ebi/services/ebi';
import type { ComumCongregacao, StaffProfile } from '@/domain/ebi/types';
import { canRegisterCoordenador } from '@/domain/ebi/auth/permissions';

export default function CadastrarCoordenadorPage() {
  const [actor, setActor] = useState<StaffProfile | null>(null);
  const [comuns, setComuns] = useState<ComumCongregacao[]>([]);
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [comumId, setComumId] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [criado, setCriado] = useState<StaffProfile | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    void Promise.all([fetchCurrentStaff(), fetchComunsCongregacao()]).then(([perfil, lista]) => {
      setActor(perfil);
      setComuns(lista);
      if (perfil.comumId) setComumId(perfil.comumId);
    });
  }, []);

  const podeCadastrar = actor ? canRegisterCoordenador(actor.role) : false;
  const comunsDisponiveis =
    actor?.role === 'master' ? comuns : comuns.filter((c) => c.id === actor?.comumId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setErro(null);
    setCriado(null);
    try {
      const coord = await registerCoordenador({ nome, cpf, email, senha, comumId });
      setCriado(coord);
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Não foi possível cadastrar.');
    } finally {
      setEnviando(false);
    }
  };

  if (actor && !podeCadastrar) {
    return (
      <div className="mx-auto max-w-lg page-shell">
        <h1 className="text-xl font-bold text-slate-900">Sem permissão</h1>
        <p className="mt-2 text-sm text-slate-600">Seu perfil não pode cadastrar coordenadores.</p>
        <Link to="/login" className="mt-4 inline-block font-semibold text-sky-600">
          Voltar ao login
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl page-shell">
      <p className="status-chip-amber">Coordenador</p>
      <h1 className="mt-3 text-2xl font-black text-slate-900">Cadastrar coordenador</h1>
      <p className="mt-2 text-sm text-slate-600">
        O coordenador lê QR Codes e consulta os EBIs da comum. Cadastro feito pelo admin ou master.
      </p>

      {erro && <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{erro}</p>}
      {criado && (
        <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Coordenador <strong>{criado.nome}</strong> cadastrado para {criado.comum} ({criado.email}).
        </p>
      )}

      <form onSubmit={(e) => void handleSubmit(e)} className="mt-6 space-y-4">
        {actor?.role === 'master' && (
          <div>
            <label className="app-label" htmlFor="comumId">
              Comum
            </label>
            <select
              id="comumId"
              value={comumId}
              onChange={(e) => setComumId(e.target.value)}
              className="app-select"
              required
            >
              <option value="">Selecione</option>
              {comunsDisponiveis.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>
        )}

        {actor?.role === 'admin' && actor.comum && (
          <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Comum: <strong>{actor.comum}</strong>
          </p>
        )}

        <div>
          <label className="app-label" htmlFor="nome">
            Nome
          </label>
          <input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} className="app-input" required />
        </div>
        <div>
          <label className="app-label" htmlFor="cpf">
            CPF
          </label>
          <input id="cpf" value={cpf} onChange={(e) => setCpf(e.target.value)} className="app-input" />
        </div>
        <div>
          <label className="app-label" htmlFor="email">
            Email
          </label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="app-input" required />
        </div>
        <div>
          <label className="app-label" htmlFor="senha">
            Senha inicial
          </label>
          <input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} className="app-input" required />
        </div>
        <button type="submit" disabled={enviando || !comumId} className="secondary-button w-full bg-slate-900">
          {enviando ? 'Salvando…' : 'Cadastrar coordenador'}
        </button>
      </form>
    </div>
  );
}
