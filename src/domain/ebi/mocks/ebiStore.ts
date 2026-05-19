import type {
  AggregatedPresence,
  CheckInEvent,
  Child,
  ComumCongregacao,
  EbiDayContext,
  EbiSession,
  LoginTipo,
  QrPayloadV1,
  ResponsavelProfile,
  StaffProfile,
  StaffRole,
  Weekday
} from '@/domain/ebi/types';
import {
  authContext,
  children,
  comuns,
  events,
  responsaveis,
  responsavelPasswords,
  responsavelPorChildId,
  sessions,
  staff,
  staffPasswords
} from '@/domain/ebi/mocks/state';
import { seedMockEbiState } from '@/domain/ebi/mocks/seed';
import { getMasterEmail, getMasterPassword, isMasterConfigured } from '@/shared/lib/env';
import { saveAuthSession } from '@/shared/lib/authSession';

function todayIso(): string {
  return new Date().toISOString().split('T')[0];
}

function randomCodigo(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let value = '';
  for (let i = 0; i < 6; i++) value += chars[Math.floor(Math.random() * chars.length)];
  return value;
}

function newId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

function horarioAgora(): string {
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function compareHorario(a: string, b: string): number {
  const [ha, ma] = a.split(':').map(Number);
  const [hb, mb] = b.split(':').map(Number);
  return ha * 60 + ma - (hb * 60 + mb);
}

function getWeekday(date: string): Weekday {
  const day = new Date(`${date}T12:00:00`).getDay();
  return ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'][day] as Weekday;
}

function findComum(comumId: string): ComumCongregacao | undefined {
  return comuns.find((item) => item.id === comumId);
}

function requireComum(comumId: string): ComumCongregacao {
  const comum = findComum(comumId);
  if (!comum) throw new Error('Comum não encontrada.');
  return comum;
}

seedMockEbiState({ todayIso, newId });

function setSession(session: typeof authContext.session): void {
  authContext.session = session;
  saveAuthSession(session);
}

function getStaffComumId(member: StaffProfile): string {
  if (member.role === 'master') {
    return authContext.masterComumAtivoId;
  }
  if (!member.comumId) {
    throw new Error('Usuário sem comum vinculada.');
  }
  return member.comumId;
}

function getCurrentStaff(): StaffProfile {
  const session = authContext.session;
  if (session?.kind === 'staff') {
    if (session.role === 'master') {
      return {
        id: 'master-session',
        nome: 'Master',
        email: getMasterEmail() || 'master@interno',
        comumId: null,
        comum: null,
        role: 'master'
      };
    }
    const found = staff.find((item) => item.id === session.staffId);
    if (found) return found;
  }
  return staff.find((item) => item.role === 'admin') ?? staff[0];
}

function getCurrentResponsavel(): ResponsavelProfile {
  const session = authContext.session;
  if (session?.kind === 'responsavel') {
    const found = responsaveis.find((item) => item.id === session.responsavelId);
    if (found) return found;
  }
  return responsaveis[0];
}

function getStoredSession(comumId: string, date: string): EbiSession | undefined {
  return sessions.find((session) => session.comumId === comumId && session.date === date);
}

function getDayContext(comumId: string, date: string): EbiDayContext {
  const congregacao = requireComum(comumId);
  const session = getStoredSession(comumId, date);
  const weekday = getWeekday(date);

  return {
    comumId,
    comum: congregacao.nome,
    date,
    weekday,
    diasConfigurados: congregacao.diasEbi,
    scheduledToday: congregacao.diasEbi.includes(weekday),
    horarioInicio: congregacao.horarioInicio,
    horarioFim: congregacao.horarioFim,
    status: session?.status ?? 'fechado',
    abertoEm: session?.abertoEm,
    encerradoEm: session?.encerradoEm
  };
}

export const ebiStore = {
  getCurrentStaff(): StaffProfile {
    return getCurrentStaff();
  },

  getCurrentResponsavel(): ResponsavelProfile {
    return getCurrentResponsavel();
  },

  getAuthRole(): StaffRole | 'responsavel' | null {
    const session = authContext.session;
    if (!session) return null;
    return session.kind === 'staff' ? session.role : 'responsavel';
  },

  logout(): void {
    setSession(null);
  },

  loginStaff(role: StaffRole, email: string, senha: string): StaffProfile {
    const normalized = email.trim().toLowerCase();

    if (role === 'master') {
      if (!isMasterConfigured()) {
        throw new Error('Acesso master não configurado no servidor.');
      }
      if (normalized !== getMasterEmail() || senha !== getMasterPassword()) {
        throw new Error('Credenciais inválidas.');
      }
      setSession({ kind: 'staff', staffId: 'master-session', role: 'master' });
      return getCurrentStaff();
    }

    const member = staff.find((item) => item.email.toLowerCase() === normalized && item.role === role);
    if (!member) {
      throw new Error('Usuário não encontrado para este perfil.');
    }
    if (staffPasswords[normalized] !== senha) {
      throw new Error('Senha incorreta.');
    }

    setSession({ kind: 'staff', staffId: member.id, role: member.role });
    return member;
  },

  loginResponsavel(email: string, senha: string): ResponsavelProfile {
    const normalized = email.trim().toLowerCase();
    const responsavel = responsaveis.find((item) => item.email.toLowerCase() === normalized);
    if (!responsavel) {
      throw new Error('Responsável não encontrado.');
    }
    if (responsavelPasswords[normalized] !== senha) {
      throw new Error('Senha incorreta.');
    }
    setSession({ kind: 'responsavel', responsavelId: responsavel.id });
    return responsavel;
  },

  login(tipo: LoginTipo, email: string, senha: string): void {
    if (tipo === 'responsavel') {
      this.loginResponsavel(email, senha);
      return;
    }
    this.loginStaff(tipo, email, senha);
  },

  setMasterComumAtivo(comumId: string): void {
    requireComum(comumId);
    authContext.masterComumAtivoId = comumId;
  },

  listComunsCongregacao(): ComumCongregacao[] {
    return comuns.filter((item) => item.ativa);
  },

  listComunsSemAdmin(): ComumCongregacao[] {
    return comuns.filter((item) => item.ativa && !item.adminId);
  },

  listComunsNomes(): string[] {
    return comuns.filter((item) => item.ativa).map((item) => item.nome);
  },

  listAllEbiContextsForDate(date: string): EbiDayContext[] {
    return comuns.filter((item) => item.ativa).map((item) => getDayContext(item.id, date));
  },

  createComum(input: {
    nome: string;
    cidade: string;
    estado: string;
    endereco?: string;
    diasEbi: Weekday[];
    horarioInicio: string;
    horarioFim: string;
    observacoes?: string;
  }): ComumCongregacao {
    const actor = getCurrentStaff();
    if (actor.role !== 'master') {
      throw new Error('Somente o master pode cadastrar comuns.');
    }

    const nomeNormalizado = input.nome.trim();
    if (comuns.some((item) => item.nome.toLowerCase() === nomeNormalizado.toLowerCase())) {
      throw new Error('Já existe uma comum com este nome.');
    }
    if (input.diasEbi.length === 0) {
      throw new Error('Selecione ao menos um dia de EBI.');
    }

    const congregacao: ComumCongregacao = {
      id: newId('comum'),
      nome: nomeNormalizado,
      cidade: input.cidade.trim(),
      estado: input.estado.trim().toUpperCase(),
      endereco: input.endereco?.trim(),
      diasEbi: input.diasEbi,
      horarioInicio: input.horarioInicio,
      horarioFim: input.horarioFim,
      observacoes: input.observacoes?.trim(),
      ativa: true
    };

    comuns.push(congregacao);
    return congregacao;
  },

  getResponsavelChildren(): Child[] {
    const responsavel = getCurrentResponsavel();
    return children.filter((child) => child.responsavelId === responsavel.id);
  },

  getChildByCodigo(codigo: string): Child | undefined {
    return children.find((child) => child.codigoRetirada === codigo);
  },

  getEventsForDate(date: string, comumIdFiltro?: string): CheckInEvent[] {
    const member = getCurrentStaff();
    const comumId =
      member.role === 'master' ? comumIdFiltro ?? authContext.masterComumAtivoId : getStaffComumId(member);

    return events
      .filter((event) => event.date === date && event.comumId === comumId)
      .sort((a, b) => compareHorario(a.horario, b.horario));
  },

  getAggregatedForDate(date: string, comumIdFiltro?: string): AggregatedPresence[] {
    const member = getCurrentStaff();
    const comumId =
      member.role === 'master' ? comumIdFiltro ?? authContext.masterComumAtivoId : getStaffComumId(member);

    const day = events.filter((event) => event.date === date && event.comumId === comumId);
    const byChild = new Map<string, CheckInEvent[]>();

    for (const event of day) {
      const list = byChild.get(event.childId) ?? [];
      list.push(event);
      byChild.set(event.childId, list);
    }

    const rows: AggregatedPresence[] = [];
    for (const [childId, childEvents] of byChild) {
      const sorted = [...childEvents].sort((a, b) => compareHorario(a.horario, b.horario));
      const entradas = sorted.filter((event) => event.acao === 'entrada');
      const saidas = sorted.filter((event) => event.acao === 'saida');
      const first = sorted[0];

      rows.push({
        date,
        childId,
        nomeCrianca: first.nome,
        responsavel: responsavelPorChildId[childId] ?? '—',
        comumId: first.comumId,
        comum: first.comum,
        entrada: entradas.length ? entradas[0].horario : '',
        saida: saidas.length ? saidas[saidas.length - 1].horario : ''
      });
    }

    return rows.sort((a, b) => a.nomeCrianca.localeCompare(b.nomeCrianca, 'pt-BR'));
  },

  getTodayTimesForChild(childId: string): { entrada: string; saida: string } {
    const hoje = todayIso();
    const day = events.filter((event) => event.childId === childId && event.date === hoje);
    const entradas = day.filter((event) => event.acao === 'entrada');
    const saidas = day.filter((event) => event.acao === 'saida');

    return {
      entrada: entradas.length ? entradas[entradas.length - 1].horario : '',
      saida: saidas.length ? saidas[saidas.length - 1].horario : ''
    };
  },

  getTodayContextForStaff(): EbiDayContext {
    const member = getCurrentStaff();
    return getDayContext(getStaffComumId(member), todayIso());
  },

  getTodayContextForCurrentResponsavel(): EbiDayContext {
    const responsavel = getCurrentResponsavel();
    return getDayContext(responsavel.comumId, todayIso());
  },

  openTodayEbi(): EbiDayContext {
    const member = getCurrentStaff();
    if (member.role === 'coordenador') {
      throw new Error('Coordenadores não abrem o EBI. Peça ao administrador da comum.');
    }

    const comumId = getStaffComumId(member);
    const date = todayIso();
    const context = getDayContext(comumId, date);

    if (!context.scheduledToday) {
      throw new Error('Hoje não é um dia configurado para o EBI desta comum.');
    }

    const congregacao = requireComum(comumId);
    const existing = getStoredSession(comumId, date);
    if (existing?.status === 'encerrado') {
      throw new Error('O EBI de hoje já foi encerrado.');
    }

    if (existing) {
      existing.status = 'aberto';
      existing.abertoPorStaffId = member.id;
      existing.abertoEm = horarioAgora();
      existing.encerradoEm = undefined;
    } else {
      sessions.push({
        id: newId('sess'),
        comumId,
        comum: congregacao.nome,
        date,
        status: 'aberto',
        abertoPorStaffId: member.id,
        abertoEm: horarioAgora()
      });
    }

    return getDayContext(comumId, date);
  },

  closeTodayEbi(): EbiDayContext {
    const member = getCurrentStaff();
    if (member.role === 'coordenador') {
      throw new Error('Coordenadores não encerram o EBI.');
    }

    const comumId = getStaffComumId(member);
    const existing = getStoredSession(comumId, todayIso());

    if (!existing || existing.status !== 'aberto') {
      throw new Error('Não há um EBI aberto para encerrar hoje.');
    }

    existing.status = 'encerrado';
    existing.encerradoEm = horarioAgora();
    return getDayContext(comumId, todayIso());
  },

  appendScanEvent(payload: QrPayloadV1): CheckInEvent {
    const member = getCurrentStaff();
    if (member.role === 'master') {
      throw new Error('O master não realiza leitura de QR. Use um perfil de coordenador.');
    }

    const comumId = getStaffComumId(member);
    const context = getDayContext(comumId, payload.data);

    if (!context.scheduledToday) {
      throw new Error('O EBI não está programado para hoje nesta comum.');
    }
    if (context.status !== 'aberto') {
      throw new Error('O EBI ainda não foi aberto pelo administrador hoje.');
    }

    const child = this.getChildByCodigo(payload.codigo);
    if (!child) {
      throw new Error('Criança não encontrada para este código');
    }
    if (child.comumId !== comumId) {
      throw new Error('Esta criança pertence a outra comum.');
    }

    const event: CheckInEvent = {
      id: newId('evt'),
      childId: child.id,
      nome: child.nome,
      codigo: child.codigoRetirada,
      comumId: child.comumId,
      comum: child.comum,
      acao: payload.acao,
      horario: horarioAgora(),
      date: payload.data
    };

    events.push(event);
    return event;
  },

  createChild(input: {
    nome: string;
    idade: number;
    dataNascimento?: string;
    observacoes?: string;
  }): Child {
    const responsavel = getCurrentResponsavel();
    const context = getDayContext(responsavel.comumId, todayIso());

    if (!context.scheduledToday || context.status !== 'aberto') {
      throw new Error('O EBI da sua comum ainda não foi liberado hoje.');
    }

    const child: Child = {
      id: newId('child'),
      responsavelId: responsavel.id,
      nome: input.nome,
      idade: input.idade,
      codigoRetirada: randomCodigo(),
      comumId: responsavel.comumId,
      comum: responsavel.comum,
      dataNascimento: input.dataNascimento,
      observacoes: input.observacoes
    };

    children.push(child);
    responsavelPorChildId[child.id] = responsavel.nomeExibicao;
    return child;
  },

  createStaff(input: {
    nome: string;
    cpf?: string;
    cargo?: string;
    email: string;
    senha: string;
    comumId: string;
    role: 'admin' | 'coordenador';
  }): StaffProfile {
    const actor = getCurrentStaff();
    const congregacao = requireComum(input.comumId);

    if (input.role === 'admin') {
      if (actor.role !== 'master') {
        throw new Error('Somente o master cadastra o administrador da comum.');
      }
      if (congregacao.adminId) {
        throw new Error('Esta comum já possui um administrador. Cada comum tem apenas um admin.');
      }
    }

    if (input.role === 'coordenador') {
      if (actor.role !== 'master' && actor.role !== 'admin') {
        throw new Error('Sem permissão para cadastrar coordenadores.');
      }
      if (actor.role === 'admin' && actor.comumId !== input.comumId) {
        throw new Error('Você só pode cadastrar coordenadores da sua comum.');
      }
    }

    const member: StaffProfile = {
      id: newId(input.role === 'admin' ? 'admin' : 'coord'),
      nome: input.nome,
      cpf: input.cpf,
      cargo: input.cargo ?? (input.role === 'admin' ? 'Administrador' : 'Coordenador'),
      email: input.email.trim(),
      comumId: input.comumId,
      comum: congregacao.nome,
      role: input.role
    };

    staff.push(member);
    staffPasswords[input.email.trim().toLowerCase()] = input.senha;

    if (input.role === 'admin') {
      congregacao.adminId = member.id;
    }

    return member;
  },

  createResponsavel(input: {
    nomePai?: string;
    nomeMae?: string;
    email: string;
    telefone?: string;
    comumId: string;
    senha?: string;
  }): ResponsavelProfile {
    const congregacao = requireComum(input.comumId);
    const nomeExibicao = [input.nomePai, input.nomeMae].filter(Boolean).join(' e ') || 'Responsável';
    const responsavel: ResponsavelProfile = {
      id: newId('resp'),
      nomeExibicao,
      email: input.email.trim(),
      telefone: input.telefone,
      comumId: input.comumId,
      comum: congregacao.nome
    };

    responsaveis.push(responsavel);
    responsavelPasswords[input.email.trim().toLowerCase()] = input.senha ?? '123456';
    setSession({ kind: 'responsavel', responsavelId: responsavel.id });
    return responsavel;
  },

  listStaff(): StaffProfile[] {
    const actor = getCurrentStaff();
    if (actor.role === 'master') return [...staff];
    if (actor.role === 'admin') {
      return staff.filter((item) => item.comumId === actor.comumId);
    }
    return staff.filter((item) => item.id === actor.id);
  }
};
