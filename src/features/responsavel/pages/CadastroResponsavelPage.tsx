import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { fetchComunsCongregacao, registerResponsavel } from '@/domain/ebi/services/ebi';
import type { ComumCongregacao } from '@/domain/ebi/types';

export default function CadastroResponsavelPage() {
  const [nomePai, setNomePai] = useState('');
  const [nomeMae, setNomeMae] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [comumId, setComumId] = useState('');
  const [comuns, setComuns] = useState<ComumCongregacao[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    void fetchComunsCongregacao().then(setComuns);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setOk(false);
    try {
      await registerResponsavel({ nomePai, nomeMae, email, telefone, senha, comumId });
      setOk(true);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <section className="page-shell">
        <div className="page-header">
          <div>
            <p className="status-chip-green">Cadastro</p>
            <h1 className="page-title">Criar conta do responsável</h1>
            <p className="page-subtitle">
              Cadastre a família para liberar o acesso ao painel, geração de QR Code e futuros registros no back-end.
            </p>
          </div>
          <div className="glass-card max-w-sm">
            <p className="text-sm font-semibold text-slate-700">Depois do cadastro</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Você poderá cadastrar as crianças e gerar o QR de entrada e saída para cada culto.
            </p>
          </div>
        </div>

        {ok && <p className="mb-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">Cadastro enviado com sucesso (mock).</p>}

        <form onSubmit={(e) => void handleSubmit(e)} className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="app-label" htmlFor="nomePai">
              Nome do pai
            </label>
            <input id="nomePai" type="text" placeholder="Nome do pai" value={nomePai} onChange={(e) => setNomePai(e.target.value)} className="app-input" />
          </div>

          <div>
            <label className="app-label" htmlFor="nomeMae">
              Nome da mãe
            </label>
            <input id="nomeMae" type="text" placeholder="Nome da mãe" value={nomeMae} onChange={(e) => setNomeMae(e.target.value)} className="app-input" />
          </div>

          <div>
            <label className="app-label" htmlFor="email">
              Email
            </label>
            <input id="email" type="email" placeholder="familia@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} className="app-input" required />
          </div>

          <div>
            <label className="app-label" htmlFor="telefone">
              Telefone
            </label>
            <input id="telefone" type="tel" placeholder="(11) 99999-9999" value={telefone} onChange={(e) => setTelefone(e.target.value)} className="app-input" />
          </div>

          <div>
            <label className="app-label" htmlFor="senha">
              Senha
            </label>
            <input id="senha" type="password" placeholder="Crie uma senha" value={senha} onChange={(e) => setSenha(e.target.value)} className="app-input" required />
          </div>

          <div>
            <label className="app-label" htmlFor="comumId">
              Comum congregação
            </label>
            <select id="comumId" value={comumId} onChange={(e) => setComumId(e.target.value)} className="app-select" required>
              <option value="">Selecione a comum</option>
              {comuns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome} — {c.cidade}/{c.estado}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Já possui acesso?{' '}
              <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
                Entrar agora
              </Link>
            </p>

            <button type="submit" disabled={enviando} className="primary-button w-full sm:w-auto">
              {enviando ? 'Enviando…' : 'Cadastrar responsável'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
