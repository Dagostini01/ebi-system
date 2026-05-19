import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { login } from '@/domain/ebi/services/ebi';
import type { LoginTipo } from '@/domain/ebi/types';

const TIPOS: { id: LoginTipo; label: string; descricao: string; chip: string }[] = [
  {
    id: 'responsavel',
    label: 'Responsável',
    descricao: 'Pais e responsáveis pelas crianças',
    chip: 'status-chip-green'
  },
  {
    id: 'admin',
    label: 'Administrador',
    descricao: 'Gestão do EBI na sua comum',
    chip: 'status-chip-blue'
  },
  {
    id: 'coordenador',
    label: 'Coordenador',
    descricao: 'Apoio operacional na sua comum',
    chip: 'status-chip-amber'
  }
];

const DESTINO: Record<LoginTipo, string> = {
  responsavel: '/pai-dashboard',
  admin: '/admin/dashboard',
  coordenador: '/coordenador/dashboard'
};

const HERO: Record<LoginTipo, { titulo: string; texto: string }> = {
  responsavel: {
    titulo: 'Acompanhe os filhos e gere o QR com rapidez',
    texto: 'Entre para visualizar as crianças cadastradas, conferir os horários do dia e gerar o QR de entrada ou saída.'
  },
  admin: {
    titulo: 'Administrador da comum',
    texto: 'Abra e encerre o EBI nos dias configurados, cadastre coordenadores e acompanhe o histórico.'
  },
  coordenador: {
    titulo: 'Recepção do EBI',
    texto: 'Leia QR Codes e visualize presenças quando o administrador liberar o EBI do dia.'
  }
};

function parseTipo(value: string | null): LoginTipo {
  if (value === 'admin' || value === 'coordenador' || value === 'responsavel') {
    return value;
  }
  return 'responsavel';
}

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tipoInicial = parseTipo(searchParams.get('tipo'));

  const [tipo, setTipo] = useState<LoginTipo>(tipoInicial);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const hero = useMemo(() => HERO[tipo], [tipo]);
  const tipoAtual = TIPOS.find((item) => item.id === tipo)!;
  const heroGradient = tipo === 'admin' ? 'hero-gradient bg-gradient-to-br from-sky-600 via-cyan-500 to-indigo-600' : 'hero-gradient';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setErro(null);
    try {
      await login(tipo, email, senha);
      navigate(DESTINO[tipo]);
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Não foi possível entrar. Tente de novo.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className={heroGradient}>
          <div className="relative z-10">
            <span className="status-chip bg-white/20 text-white">{tipoAtual.label}</span>
            <h2 className="mt-4 text-3xl font-black">{hero.titulo}</h2>
            <p className="mt-4 text-sm leading-6 text-white/90">{hero.texto}</p>
          </div>
        </section>

        <section className="page-shell">
          <div className="mb-6">
            <p className={tipoAtual.chip}>Entrar no sistema</p>
            <h1 className="mt-3 text-3xl font-black text-slate-900">Login</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">Selecione seu perfil e informe email e senha.</p>
          </div>

          <div className="mb-6 grid gap-2 sm:grid-cols-3">
            {TIPOS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setTipo(item.id);
                  setErro(null);
                }}
                className={`rounded-2xl border px-3 py-3 text-left transition ${
                  tipo === item.id
                    ? 'border-slate-900 bg-slate-900 text-white shadow-lg'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <p className="text-sm font-bold">{item.label}</p>
                <p className={`mt-1 text-xs ${tipo === item.id ? 'text-white/80' : 'text-slate-500'}`}>{item.descricao}</p>
              </button>
            ))}
          </div>

          {erro && <p className="mb-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{erro}</p>}

          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
            <div>
              <label className="app-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                placeholder={
                  tipo === 'responsavel'
                    ? 'familia@exemplo.com'
                    : tipo === 'admin'
                      ? 'admin.suacomum@exemplo.com'
                      : 'coord.suacomum@exemplo.com'
                }
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="app-input"
                required
              />
            </div>

            <div>
              <label className="app-label" htmlFor="senha">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                autoComplete="current-password"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="app-input"
                required
              />
            </div>

            <button
              type="submit"
              disabled={enviando}
              className={`w-full ${tipo === 'responsavel' ? 'primary-button' : 'secondary-button bg-slate-900 hover:bg-slate-800'}`}
            >
              {enviando ? 'Entrando…' : `Entrar como ${tipoAtual.label.toLowerCase()}`}
            </button>
          </form>

          {tipo === 'responsavel' && (
            <p className="mt-6 text-sm text-slate-500">
              Ainda não tem cadastro?{' '}
              <Link to="/register" className="font-semibold text-emerald-600 hover:text-emerald-700">
                Criar conta
              </Link>
            </p>
          )}

          {tipo === 'admin' && (
            <p className="mt-6 text-sm text-slate-500">O cadastro de administradores é feito pelo master do sistema.</p>
          )}
        </section>
      </div>
    </div>
  );
}