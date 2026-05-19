import type {
  AggregatedPresence,
  CheckInEvent,
  Child,
  ChildWithTodayTimes,
  ComumCongregacao,
  EbiDayContext,
  LoginTipo,
  QrPayloadV1,
  ResponsavelProfile,
  StaffProfile,
  Weekday
} from '@/domain/ebi/types';
import { ebiStore } from '@/domain/ebi/mocks/ebiStore';

const MOCK_DELAY_MS = 200;

function delay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
}

export async function fetchResponsavelChildren(): Promise<Child[]> {
  await delay();
  return ebiStore.getResponsavelChildren();
}

export async function fetchResponsavelChildrenWithTodayTimes(): Promise<ChildWithTodayTimes[]> {
  await delay();
  return ebiStore.getResponsavelChildren().map((child) => {
    const todayTimes = ebiStore.getTodayTimesForChild(child.id);
    return { ...child, entradaHoje: todayTimes.entrada, saidaHoje: todayTimes.saida };
  });
}

export async function fetchCheckInsForDate(date: string, comumId?: string): Promise<CheckInEvent[]> {
  await delay();
  return ebiStore.getEventsForDate(date, comumId);
}

export async function fetchAggregatedPresencesForDate(date: string, comumId?: string): Promise<AggregatedPresence[]> {
  await delay();
  return ebiStore.getAggregatedForDate(date, comumId);
}

export async function fetchCurrentStaff(): Promise<StaffProfile> {
  await delay();
  return ebiStore.getCurrentStaff();
}

export async function fetchCurrentAdmin(): Promise<StaffProfile> {
  return fetchCurrentStaff();
}

export async function fetchCurrentResponsavel(): Promise<ResponsavelProfile> {
  await delay();
  return ebiStore.getCurrentResponsavel();
}

export async function fetchTodayEbiContextForStaff(): Promise<EbiDayContext> {
  await delay();
  return ebiStore.getTodayContextForStaff();
}

export async function fetchTodayEbiContextForAdmin(): Promise<EbiDayContext> {
  return fetchTodayEbiContextForStaff();
}

export async function fetchTodayEbiContextForResponsavel(): Promise<EbiDayContext> {
  await delay();
  return ebiStore.getTodayContextForCurrentResponsavel();
}

export async function fetchAllEbiContextsForDate(date: string): Promise<EbiDayContext[]> {
  await delay();
  return ebiStore.listAllEbiContextsForDate(date);
}

export async function fetchComunsCongregacao(): Promise<ComumCongregacao[]> {
  await delay();
  return ebiStore.listComunsCongregacao();
}

export async function fetchComunsSemAdmin(): Promise<ComumCongregacao[]> {
  await delay();
  return ebiStore.listComunsSemAdmin();
}

/** Nomes das comuns ativas (ex.: selects de responsável). */
export async function fetchComuns(): Promise<string[]> {
  await delay();
  return ebiStore.listComunsNomes();
}

export async function fetchStaffList(): Promise<StaffProfile[]> {
  await delay();
  return ebiStore.listStaff();
}

export async function openTodayEbi(): Promise<EbiDayContext> {
  await delay();
  return ebiStore.openTodayEbi();
}

export async function closeTodayEbi(): Promise<EbiDayContext> {
  await delay();
  return ebiStore.closeTodayEbi();
}

export async function registerScan(payload: QrPayloadV1): Promise<CheckInEvent> {
  await delay();
  return ebiStore.appendScanEvent(payload);
}

export async function registerChild(input: {
  nome: string;
  idade: number;
  dataNascimento?: string;
  observacoes?: string;
}): Promise<Child> {
  await delay();
  return ebiStore.createChild(input);
}

export async function login(tipo: LoginTipo, email: string, senha: string): Promise<void> {
  await delay();
  ebiStore.login(tipo, email, senha);
}

export async function loginMaster(email: string, senha: string): Promise<void> {
  await delay();
  ebiStore.loginStaff('master', email, senha);
}

export async function logout(): Promise<void> {
  await delay();
  ebiStore.logout();
}

export async function loginAdmin(email: string, senha: string): Promise<void> {
  await login('admin', email, senha);
}

export async function loginResponsavel(email: string, senha: string): Promise<void> {
  await login('responsavel', email, senha);
}

export async function registerComum(data: {
  nome: string;
  cidade: string;
  estado: string;
  endereco?: string;
  diasEbi: Weekday[];
  horarioInicio: string;
  horarioFim: string;
  observacoes?: string;
}): Promise<ComumCongregacao> {
  await delay();
  return ebiStore.createComum(data);
}

export async function registerResponsavel(data: Record<string, string>): Promise<void> {
  await delay();
  ebiStore.createResponsavel({
    nomePai: data.nomePai,
    nomeMae: data.nomeMae,
    email: data.email,
    telefone: data.telefone,
    comumId: data.comumId,
    senha: data.senha
  });
}

export async function registerAdmin(data: {
  nome: string;
  cpf: string;
  cargo?: string;
  email: string;
  senha: string;
  comumId: string;
}): Promise<StaffProfile> {
  await delay();
  return ebiStore.createStaff({
    nome: data.nome,
    cpf: data.cpf,
    cargo: data.cargo,
    email: data.email,
    senha: data.senha,
    comumId: data.comumId,
    role: 'admin'
  });
}

export async function registerCoordenador(data: {
  nome: string;
  cpf?: string;
  email: string;
  senha: string;
  comumId: string;
}): Promise<StaffProfile> {
  await delay();
  return ebiStore.createStaff({
    nome: data.nome,
    cpf: data.cpf,
    email: data.email,
    senha: data.senha,
    comumId: data.comumId,
    role: 'coordenador'
  });
}

export async function setMasterComumAtivo(comumId: string): Promise<void> {
  await delay();
  ebiStore.setMasterComumAtivo(comumId);
}
