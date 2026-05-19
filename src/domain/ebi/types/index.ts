export type CheckInAction = 'entrada' | 'saida';
export type EbiSessionStatus = 'fechado' | 'aberto' | 'encerrado';
export type Weekday = 'domingo' | 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado';

export type StaffRole = 'master' | 'admin' | 'coordenador';
export type LoginTipo = 'responsavel' | 'admin' | 'coordenador';

/** Comum congregação configurada pelo master para operar o EBI. */
export interface ComumCongregacao {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
  endereco?: string;
  /** Dias da semana em que o EBI acontece nesta comum. */
  diasEbi: Weekday[];
  horarioInicio: string;
  horarioFim: string;
  observacoes?: string;
  /** Um único administrador por comum. */
  adminId?: string;
  ativa: boolean;
}

export interface QrPayloadV1 {
  version: 1;
  acao: CheckInAction;
  nome: string;
  codigo: string;
  data: string;
}

export interface Child {
  id: string;
  responsavelId: string;
  nome: string;
  idade: number;
  codigoRetirada: string;
  comumId: string;
  comum: string;
  dataNascimento?: string;
  observacoes?: string;
}

export interface CheckInEvent {
  id: string;
  childId: string;
  nome: string;
  codigo: string;
  comumId: string;
  comum: string;
  acao: CheckInAction;
  horario: string;
  date: string;
}

export interface AggregatedPresence {
  date: string;
  childId: string;
  nomeCrianca: string;
  responsavel: string;
  comumId: string;
  comum: string;
  entrada: string;
  saida: string;
}

export interface ChildWithTodayTimes extends Child {
  entradaHoje: string;
  saidaHoje: string;
}

export interface StaffProfile {
  id: string;
  nome: string;
  cpf?: string;
  cargo?: string;
  email: string;
  comumId: string | null;
  comum: string | null;
  role: StaffRole;
}

/** @deprecated Use StaffProfile */
export type AdminProfile = StaffProfile;

export interface ResponsavelProfile {
  id: string;
  nomeExibicao: string;
  email: string;
  telefone?: string;
  comumId: string;
  comum: string;
}

export interface EbiSession {
  id: string;
  comumId: string;
  comum: string;
  date: string;
  status: EbiSessionStatus;
  abertoPorStaffId?: string;
  abertoEm?: string;
  encerradoEm?: string;
}

export interface EbiDayContext {
  comumId: string;
  comum: string;
  date: string;
  weekday: Weekday;
  diasConfigurados: Weekday[];
  scheduledToday: boolean;
  horarioInicio: string;
  horarioFim: string;
  status: EbiSessionStatus;
  abertoEm?: string;
  encerradoEm?: string;
}

export type AuthSession =
  | { kind: 'staff'; staffId: string; role: StaffRole }
  | { kind: 'responsavel'; responsavelId: string };
