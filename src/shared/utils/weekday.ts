import { DIAS_EBI } from '@/shared/constants/diasEbi';
import type { Weekday } from '@/domain/ebi/types';

const weekdayLabels = new Map<Weekday, string>(DIAS_EBI.map((day) => [day.value, day.label]));

export function getWeekdayLabel(day: Weekday): string {
  return weekdayLabels.get(day) ?? day;
}

export function formatWeekdayList(days: Weekday[]): string {
  return days.length > 0 ? days.map(getWeekdayLabel).join(', ') : 'nenhum';
}
