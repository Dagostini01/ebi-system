import type { CheckInEvent } from '@/domain/ebi/types';
import { events } from '@/domain/ebi/mocks/state';

interface SeedOptions {
  todayIso: () => string;
  newId: (prefix: string) => string;
}

export function seedMockEbiState({ todayIso, newId }: SeedOptions) {
  if (events.length > 0) {
    return;
  }

  const hoje = todayIso();
  const seedEvents: CheckInEvent[] = [
    {
      id: newId('evt'),
      childId: 'child-1',
      nome: 'Ana Beatriz',
      codigo: 'ABC123',
      comumId: 'comum-1',
      comum: 'Vila Ré',
      acao: 'entrada',
      horario: '19:45',
      date: hoje
    },
    {
      id: newId('evt'),
      childId: 'child-2',
      nome: 'João Pedro',
      codigo: 'XYZ789',
      comumId: 'comum-1',
      comum: 'Vila Ré',
      acao: 'saida',
      horario: '21:00',
      date: hoje
    },
    {
      id: newId('evt'),
      childId: 'child-1',
      nome: 'Ana Beatriz',
      codigo: 'ABC123',
      comumId: 'comum-1',
      comum: 'Vila Ré',
      acao: 'entrada',
      horario: '19:45',
      date: '2026-05-20'
    },
    {
      id: newId('evt'),
      childId: 'child-1',
      nome: 'Ana Beatriz',
      codigo: 'ABC123',
      comumId: 'comum-1',
      comum: 'Vila Ré',
      acao: 'saida',
      horario: '21:00',
      date: '2026-05-20'
    },
    {
      id: newId('evt'),
      childId: 'child-2',
      nome: 'João Pedro',
      codigo: 'XYZ789',
      comumId: 'comum-1',
      comum: 'Vila Ré',
      acao: 'entrada',
      horario: '19:50',
      date: '2026-05-20'
    },
    {
      id: newId('evt'),
      childId: 'child-3',
      nome: 'Beatriz Lima',
      codigo: 'BTL001',
      comumId: 'comum-2',
      comum: 'Zona Leste - SP',
      acao: 'entrada',
      horario: '19:30',
      date: '2026-05-19'
    },
    {
      id: newId('evt'),
      childId: 'child-3',
      nome: 'Beatriz Lima',
      codigo: 'BTL001',
      comumId: 'comum-2',
      comum: 'Zona Leste - SP',
      acao: 'saida',
      horario: '20:50',
      date: '2026-05-19'
    }
  ];

  events.push(...seedEvents);
}
