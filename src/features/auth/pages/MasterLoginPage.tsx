import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { loginMaster } from '@/domain/ebi/services/ebi';
import { isMasterConfigured } from '@/shared/lib/env';

export default function MasterLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setErro(null);
    try {
      await loginMaster(email, senha);
      navigate('/master/dashboard');
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Não foi possível entrar.');
    } finally {
      setEnviando(false);
    }
  };

  if (!isMasterConfigured()) {
    return (
      <div className="mx-auto max-w-lg page-shell">
        <h1 className="text-2xl font-black text-slate-900">Acesso não configurado</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Defina <code className="rounded bg-slate-100 px-1">VITE_MASTER_EMAIL</code> e{' '}
          <code className="rounded bg-slate-100 px-1">VITE_MASTER_PASSWORD</code> no arquivo <code className="rounded bg-slate-100 px-1">.env</code> local.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <section className="page-shell">
        <p className="status-chip bg-slate-900 text-white">Acesso restrito</p>
        <h1 className="mt-3 text-2xl font-black text-slate-900">Entrada master</h1>
        <p className="mt-2 text-sm text-slate-600">Área exclusiva. Não compartilhe este endereço.</p>

        {erro && <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{erro}</p>}

        <form onSubmit={(e) => void handleSubmit(e)} className="mt-6 space-y-4">
          <div>
            <label className="app-label" htmlFor="master-email">
              Email
            </label>
            <input
              id="master-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="app-input"
              required
            />
          </div>

          <div>
            <label className="app-label" htmlFor="master-senha">
              Senha
            </label>
            <input
              id="master-senha"
              type="password"
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="app-input"
              required
            />
          </div>

          <button type="submit" disabled={enviando} className="secondary-button w-full bg-slate-900 hover:bg-slate-800">
            {enviando ? 'Validando…' : 'Entrar'}
          </button>
        </form>
      </section>
    </div>
  );
}
