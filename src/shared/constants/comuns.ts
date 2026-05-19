export const COMUNS = [
  'Vila Ré',
  'Central - SP',
  'Zona Leste - SP',
  'Campinas - SP',
  'Belo Horizonte - MG',
  'Porto Alegre - RS'
] as const;

export type Comum = (typeof COMUNS)[number];
