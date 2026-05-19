import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="hero-gradient">
        <div className="relative z-10 max-w-3xl">
          <span className="status-chip bg-white/20 text-white">Cuidado com mais organização</span>
          <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
            Recepção das crianças mais simples, segura e acolhedora.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/90 sm:text-lg">
            O EBI ajuda a registrar entrada, saída e presença do dia para que os responsáveis fiquem tranquilos e a equipe admin trabalhe com mais agilidade.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link to="/register" className="primary-button w-full bg-white text-emerald-700 shadow-white/20 hover:bg-emerald-50 sm:w-auto">
              Começar como responsável
            </Link>
            <Link to="/login" className="ghost-button w-full border-white/40 bg-white/10 text-white hover:bg-white/20 sm:w-auto">
              Entrar no sistema
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="page-shell">
          <div className="page-header">
            <div>
              <p className="status-chip-blue">Fluxo do culto</p>
              <h2 className="page-title">Como o sistema funciona</h2>
              <p className="page-subtitle">
                Cada perfil tem um caminho claro, com menos dúvida e menos retrabalho na porta do EBI.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="glass-card">
              <p className="text-sm font-bold text-emerald-600">1. Responsável</p>
              <h3 className="mt-3 text-lg font-bold text-slate-900">Gera o QR da criança</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Cadastra os filhos, acompanha os horários e apresenta o QR de entrada ou saída quando necessário.
              </p>
            </div>

            <div className="glass-card">
              <p className="text-sm font-bold text-sky-600">2. Equipe</p>
              <h3 className="mt-3 text-lg font-bold text-slate-900">Admin e coordenador</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Administradores gerenciam o EBI da comum; coordenadores apoiam na recepção e leitura dos QR Codes.
              </p>
            </div>

            <div className="glass-card">
              <p className="text-sm font-bold text-amber-600">3. Histórico</p>
              <h3 className="mt-3 text-lg font-bold text-slate-900">Consulta por data</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Visualiza presença do dia e histórico completo para ter controle do que aconteceu em cada culto.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <Link to="/pai-dashboard" className="glass-card block transition hover:-translate-y-1 hover:shadow-lg">
            <p className="status-chip-green">Responsável</p>
            <h3 className="mt-3 text-xl font-bold text-slate-900">Painel das crianças</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Veja os filhos cadastrados, horários de hoje e gere os QR Codes.
            </p>
          </Link>

          <Link to="/admin/escanear" className="glass-card block transition hover:-translate-y-1 hover:shadow-lg">
            <p className="status-chip-blue">Admin</p>
            <h3 className="mt-3 text-xl font-bold text-slate-900">Escanear QR</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              A tela mais usada durante o culto, com foco na rapidez do atendimento.
            </p>
          </Link>

          <Link to="/admin/presencas-do-dia" className="glass-card block transition hover:-translate-y-1 hover:shadow-lg">
            <p className="status-chip-amber">Monitoramento</p>
            <h3 className="mt-3 text-xl font-bold text-slate-900">Presenças do dia</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Veja quem entrou, saiu e em qual horário, tudo em uma lista mais legível.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
