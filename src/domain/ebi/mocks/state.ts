import type {
  AuthSession,
  CheckInEvent,
  Child,
  ComumCongregacao,
  EbiSession,
  ResponsavelProfile,
  StaffProfile
} from '@/domain/ebi/types';
import { loadAuthSession } from '@/shared/lib/authSession';

export const comuns: ComumCongregacao[] = [
  {
    id: 'comum-1',
    nome: 'Vila Ré',
    cidade: 'São Paulo',
    estado: 'SP',
    endereco: 'Rua Exemplo, 100',
    diasEbi: ['quarta', 'domingo'],
    horarioInicio: '19:30',
    horarioFim: '21:30',
    adminId: 'admin-1',
    ativa: true
  },
  {
    id: 'comum-2',
    nome: 'Zona Leste - SP',
    cidade: 'São Paulo',
    estado: 'SP',
    diasEbi: ['domingo'],
    horarioInicio: '18:00',
    horarioFim: '20:00',
    adminId: 'admin-2',
    ativa: true
  }
];

export const responsaveis: ResponsavelProfile[] = [
  {
    id: 'resp-1',
    nomeExibicao: 'João e Maria Silva',
    email: 'familia.vilare@example.com',
    telefone: '(11) 99999-1111',
    comumId: 'comum-1',
    comum: 'Vila Ré'
  },
  {
    id: 'resp-2',
    nomeExibicao: 'Luciana Lima',
    email: 'familia.zonaleste@example.com',
    telefone: '(11) 99999-2222',
    comumId: 'comum-2',
    comum: 'Zona Leste - SP'
  }
];

export const staff: StaffProfile[] = [
  {
    id: 'admin-1',
    nome: 'Mariana Souza',
    cpf: '123.456.789-00',
    cargo: 'Administrador',
    email: 'admin.vilare@example.com',
    comumId: 'comum-1',
    comum: 'Vila Ré',
    role: 'admin'
  },
  {
    id: 'coord-1',
    nome: 'Carlos Mendes',
    cpf: '987.654.321-00',
    cargo: 'Coordenador',
    email: 'coord.vilare@example.com',
    comumId: 'comum-1',
    comum: 'Vila Ré',
    role: 'coordenador'
  },
  {
    id: 'admin-2',
    nome: 'Patrícia Alves',
    cpf: '111.222.333-44',
    cargo: 'Administrador',
    email: 'admin.zonaleste@example.com',
    comumId: 'comum-2',
    comum: 'Zona Leste - SP',
    role: 'admin'
  }
];

export const staffPasswords: Record<string, string> = {
  'admin.vilare@example.com': 'admin123',
  'coord.vilare@example.com': 'coord123',
  'admin.zonaleste@example.com': 'admin123'
};

export const responsavelPasswords: Record<string, string> = {
  'familia.vilare@example.com': 'familia123',
  'familia.zonaleste@example.com': 'familia123'
};

export const responsavelPorChildId: Record<string, string> = {
  'child-1': 'João e Maria Silva',
  'child-2': 'João e Maria Silva',
  'child-3': 'Luciana Lima'
};

export const children: Child[] = [
  {
    id: 'child-1',
    responsavelId: 'resp-1',
    nome: 'Ana Beatriz',
    idade: 6,
    codigoRetirada: 'ABC123',
    comumId: 'comum-1',
    comum: 'Vila Ré'
  },
  {
    id: 'child-2',
    responsavelId: 'resp-1',
    nome: 'João Pedro',
    idade: 4,
    codigoRetirada: 'XYZ789',
    comumId: 'comum-1',
    comum: 'Vila Ré'
  },
  {
    id: 'child-3',
    responsavelId: 'resp-2',
    nome: 'Beatriz Lima',
    idade: 5,
    codigoRetirada: 'BTL001',
    comumId: 'comum-2',
    comum: 'Zona Leste - SP'
  }
];

export const events: CheckInEvent[] = [];
export const sessions: EbiSession[] = [];

const persisted = loadAuthSession();

export const authContext = {
  session: persisted as AuthSession | null,
  masterComumAtivoId: 'comum-1' as string
};
