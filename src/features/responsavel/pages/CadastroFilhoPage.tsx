import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { fetchCurrentResponsavel, fetchTodayEbiContextForResponsavel, registerChild } from '@/domain/ebi/services/ebi';
import type { EbiDayContext, ResponsavelProfile } from '@/domain/ebi/types';
import { formatWeekdayList, getWeekdayLabel } from '@/shared/utils/weekday';

export default function CadastroFilhoPage() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [responsavel, setResponsavel] = useState<ResponsavelProfile | null>(null);
  const [contextoHoje, setContextoHoje] = useState<EbiDayContext | null>(null);
  const [carregandoStatus, setCarregandoStatus] = useState(true);

  useEffect(() => {
    let ativo = true;
    setCarregandoStatus(true);

    void Promise.all([fetchCurrentResponsavel(), fetchTodayEbiContextForResponsavel()])
      .then(([responsavelAtual, contexto]) => {
        if (!ativo) return;
        setResponsavel(responsavelAtual);
        setContextoHoje(contexto);
      })
      .catch(() => {
        if (!ativo) return;
        setErro('Não foi possível verificar o status do EBI para sua comum.');
      })
      .finally(() => {
        if (ativo) setCarregandoStatus(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  const cadastroLiberado = contextoHoje?.scheduledToday && contextoHoje.status === 'aberto';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setErro(null);
    try {
      await registerChild({
        nome,
        idade: idade ? Number(idade) : 0,
        dataNascimento: dataNascimento || undefined,
        observacoes: observacoes || undefined
      });
      navigate('/pai-dashboard');
    } catch {
      setErro('Não foi possível cadastrar. Tente de novo.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <section className="page-shell">
        <div className="page-header">
          <div>
            <p className="status-chip-green">Nova criança</p>
            <h1 className="page-title">Cadastrar criança no EBI</h1>
            <p className="page-subtitle">
              O cadastro só fica disponível quando o admin da sua comum abre o EBI do dia.
            </p>
          </div>
          <div className="glass-card w-full max-w-sm">
            <p className="text-sm font-semibold text-slate-700">Sua comum</p>
            <p className="mt-2 text-lg font-bold text-slate-900">{responsavel?.comum ?? 'Carregando...'}</p>
            {contextoHoje && (
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Hoje é {getWeekdayLabel(contextoHoje.weekday)}. Dias configurados: {formatWeekdayList(contextoHoje.diasConfigurados)}.
              </p>
            )}
          </div>
        </div>

        {erro && <p className="mb-5 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{erro}</p>}

        {carregandoStatus && <p className="mb-5 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">Verificando se o EBI da sua comum está liberado…</p>}

        {!carregandoStatus && contextoHoje && !cadastroLiberado && (
          <div className="mb-6 rounded-3xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-amber-700">Cadastro bloqueado</p>
            <h2 className="mt-3 text-xl font-black text-slate-900 sm:text-2xl">
              {!contextoHoje.scheduledToday
                ? 'Hoje não há EBI programado para sua comum.'
                : contextoHoje.status === 'encerrado'
                  ? 'O EBI de hoje já foi encerrado.'
                  : 'O admin ainda não liberou o EBI de hoje.'}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Assim que o admin da comum {contextoHoje.comum} clicar em abrir o EBI, este formulário será liberado automaticamente.
            </p>
          </div>
        )}

        <form onSubmit={(e) => void handleSubmit(e)} className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="app-label" htmlFor="nome">
              Nome da criança
            </label>
            <input id="nome" type="text" placeholder="Nome completo da criança" value={nome} onChange={(e) => setNome(e.target.value)} className="app-input" required disabled={!cadastroLiberado} />
          </div>

          <div>
            <label className="app-label" htmlFor="idade">
              Idade
            </label>
            <input id="idade" type="number" placeholder="Ex.: 6" value={idade} onChange={(e) => setIdade(e.target.value)} className="app-input" min={0} disabled={!cadastroLiberado} />
          </div>

          <div>
            <label className="app-label" htmlFor="dataNascimento">
              Data de nascimento
            </label>
            <input id="dataNascimento" type="date" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} className="app-input" disabled={!cadastroLiberado} />
          </div>

          <div className="md:col-span-2">
            <label className="app-label" htmlFor="comum">
              Comum congregação
            </label>
            <input id="comum" value={responsavel?.comum ?? ''} className="app-input bg-slate-50" disabled readOnly />
          </div>

          <div className="md:col-span-2">
            <label className="app-label" htmlFor="observacoes">
              Observações
            </label>
            <textarea
              id="observacoes"
              placeholder="Alergias, restrições, orientações importantes..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="app-textarea"
              disabled={!cadastroLiberado}
            />
          </div>

          <div className="md:col-span-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              {cadastroLiberado
                ? 'Após salvar, a criança aparecerá no painel com o código de retirada.'
                : 'O formulário será liberado quando o EBI estiver aberto para sua comum.'}
            </p>

            <button type="submit" disabled={enviando || !cadastroLiberado} className="primary-button w-full sm:w-auto">
              {enviando ? 'Cadastrando…' : 'Cadastrar criança'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
