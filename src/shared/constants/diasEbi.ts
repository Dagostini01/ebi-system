import type { Weekday } from '@/domain/ebi/types';

export const DIAS_EBI: Array<{ value: Weekday; label: string }> = [
  { value: 'domingo', label: 'Domingo' },
  { value: 'segunda', label: 'Segunda-feira' },
  { value: 'terca', label: 'Terça-feira' },
  { value: 'quarta', label: 'Quarta-feira' },
  { value: 'quinta', label: 'Quinta-feira' },
  { value: 'sexta', label: 'Sexta-feira' },
  { value: 'sabado', label: 'Sábado' }
];
