import { useState } from 'react';
import { Link } from 'react-router-dom';

import { registerComum } from '@/domain/ebi/services/ebi';
import type { ComumCongregacao, Weekday } from '@/domain/ebi/types';
import { DIAS_EBI } from '@/shared/constants/diasEbi';
import { formatWeekdayList } from '@/shared/utils/weekday';

const ESTADOS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

export default function CadastrarComumPage() {
  const [nome, setNome] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('SP');
  const [endereco, setEndereco] = useState('');
  const [horarioInicio, setHorarioInicio] = useState('19:30');
  const [horarioFim, setHorarioFim] = useState('21:30');
  const [observacoes, setObservacoes] = useState('');
  const [diasEbi, setDiasEbi] = useState<Weekday[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [criada, setCriada] = useState<ComumCongregacao | null>(null);

  const toggleDia = (dia: Weekday) => {
    setDiasEbi((current) => (current.includes(dia) ? current.filter((item) => item !== dia) : [...current, dia]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setErro(null);
    setCriada(null);
    try {
      const comum = await registerComum({
        nome,
        cidade,
        estado,
        endereco: endereco || undefined,
        diasEbi,
        horarioInicio,
        horarioFim,
        observacoes: observacoes || undefined
      });
      setCriada(comum);
      setNome('');
      setCidade('');
      setEndereco('');
      setObservacoes('');
      setDiasEbi([]);
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Não foi possível cadastrar a comum.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <section className="page-shell">
        <p className="status-chip bg-slate-900 text-white">Master</p>
        <h1 className="mt-3 text-2xl font-black text-slate-900">Cadastrar comum congregação</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Defina local, dias e horários do EBI. Depois cadastre o administrador desta comum.
        </p>

        {erro && <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{erro}</p>}
        {criada && (
          <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <p>
              Comum <strong>{criada.nome}</strong> cadastrada. EBI: {formatWeekdayList(criada.diasEbi)} das{' '}
              {criada.horarioInicio} às {criada.horarioFim}.
            </p>
            <Link
              to={`/master/cadastrar-admin?comumId=${criada.id}`}
              className="mt-2 inline-block font-semibold text-emerald-700 hover:text-emerald-900"
            >
              Cadastrar administrador desta comum →
            </Link>
          </div>
        )}

        <form onSubmit={(e) => void handleSubmit(e)} className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="app-label" htmlFor="nome">
              Nome da comum
            </label>
            <input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} className="app-input" required />
          </div>

          <div>
            <label className="app-label" htmlFor="cidade">
              Cidade
            </label>
            <input id="cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} className="app-input" required />
          </div>

          <div>
            <label className="app-label" htmlFor="estado">
              Estado
            </label>
            <select id="estado" value={estado} onChange={(e) => setEstado(e.target.value)} className="app-select" required>
              {ESTADOS.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="app-label" htmlFor="endereco">
              Endereço (opcional)
            </label>
            <input id="endereco" value={endereco} onChange={(e) => setEndereco(e.target.value)} className="app-input" />
          </div>

          <div>
            <label className="app-label" htmlFor="horarioInicio">
              Horário início do EBI
            </label>
            <input
              id="horarioInicio"
              type="time"
              value={horarioInicio}
              onChange={(e) => setHorarioInicio(e.target.value)}
              className="app-input"
              required
            />
          </div>

          <div>
            <label className="app-label" htmlFor="horarioFim">
              Horário fim do EBI
            </label>
            <input
              id="horarioFim"
              type="time"
              value={horarioFim}
              onChange={(e) => setHorarioFim(e.target.value)}
              className="app-input"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="app-label">Dias do EBI</label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {DIAS_EBI.map((dia) => {
                const ativo = diasEbi.includes(dia.value);
                return (
                  <button
                    key={dia.value}
                    type="button"
                    onClick={() => toggleDia(dia.value)}
                    className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                      ativo
                        ? 'border-sky-300 bg-sky-50 text-sky-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {dia.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="app-label" htmlFor="observacoes">
              Observações (opcional)
            </label>
            <textarea
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="app-input min-h-[80px]"
              rows={3}
            />
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-3">
            <button type="submit" disabled={enviando || diasEbi.length === 0} className="secondary-button bg-slate-900">
              {enviando ? 'Salvando…' : 'Cadastrar comum'}
            </button>
            <Link to="/master/dashboard" className="ghost-button">
              Voltar ao painel
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}
