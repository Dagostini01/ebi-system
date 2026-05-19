import type { StaffRole } from '@/domain/ebi/types';

export function canManageAllComuns(role: StaffRole): boolean {
  return role === 'master';
}

export function canRegisterComum(role: StaffRole): boolean {
  return role === 'master';
}

export function canRegisterAdmin(role: StaffRole): boolean {
  return role === 'master';
}

export function canRegisterCoordenador(role: StaffRole): boolean {
  return role === 'master' || role === 'admin';
}

/** Admin (e master) abrem/fecham a sessão do EBI no dia. */
export function canOpenCloseEbi(role: StaffRole): boolean {
  return role === 'master' || role === 'admin';
}

/** Coordenador: leitura de QR e consulta de EBIs. */
export function canScanQr(role: StaffRole): boolean {
  return role === 'coordenador';
}

export function canViewPresences(role: StaffRole): boolean {
  return canScanQr(role) || role === 'master';
}
