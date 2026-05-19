import type { CheckInAction, QrPayloadV1 } from '@/domain/ebi/types';

function isAction(value: unknown): value is CheckInAction {
  return value === 'entrada' || value === 'saida';
}

export function parseQrPayload(raw: string): QrPayloadV1 | null {
  try {
    const payload = JSON.parse(raw) as Record<string, unknown>;

    if (
      !isAction(payload.acao) ||
      typeof payload.nome !== 'string' ||
      typeof payload.codigo !== 'string' ||
      typeof payload.data !== 'string'
    ) {
      return null;
    }

    if (payload.version === undefined || payload.version === 1) {
      return {
        version: 1,
        acao: payload.acao,
        nome: payload.nome,
        codigo: payload.codigo,
        data: payload.data
      };
    }

    return null;
  } catch {
    return null;
  }
}

export function buildQrPayload(
  acao: CheckInAction,
  nome: string,
  codigo: string,
  data: string
): QrPayloadV1 {
  return { version: 1, acao, nome, codigo, data };
}
