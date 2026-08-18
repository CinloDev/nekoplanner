import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth as dateFnsIsSameMonth,
  isSameDay as dateFnsIsSameDay,
  isBefore as dateFnsIsBefore,
  isAfter as dateFnsIsAfter,
  addMonths,
  subMonths,
  startOfDay,
  format,
  isValid
} from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Normaliza un valor Date o string (ISO) a un objeto Date válido.
 * Lanza un error si la fecha resultante no es válida.
 */
function toDate(value: Date | string): Date {
  const date = typeof value === 'string' ? new Date(value) : value;
  if (!isValid(date)) {
    throw new Error(`Invalid date provided: ${value}`);
  }
  return date;
}

/**
 * Devuelve el inicio del día actual local.
 */
export function getToday(): Date {
  return startOfDay(new Date());
}

/**
 * Devuelve la cuadrícula de días para el mes proporcionado,
 * completando las semanas inicial y final con días de los
 * meses adyacentes. El inicio de semana es el Lunes.
 */
export function getMonthDays(referenceMonth: Date | string): Date[] {
  const month = toDate(referenceMonth);
  const firstDay = startOfMonth(month);
  const lastDay = endOfMonth(month);

  const gridStart = startOfWeek(firstDay, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(lastDay, { weekStartsOn: 1 });

  return eachDayOfInterval({ start: gridStart, end: gridEnd });
}

/**
 * Verifica si un día pertenece al mes de referencia.
 */
export function isCurrentMonth(date: Date | string, referenceMonth: Date | string): boolean {
  return dateFnsIsSameMonth(toDate(date), toDate(referenceMonth));
}

export function isSameDay(dateLeft: Date | string, dateRight: Date | string): boolean {
  return dateFnsIsSameDay(toDate(dateLeft), toDate(dateRight));
}

export function isSameMonth(dateLeft: Date | string, dateRight: Date | string): boolean {
  return dateFnsIsSameMonth(toDate(dateLeft), toDate(dateRight));
}

export function isBefore(date: Date | string, dateToCompare: Date | string): boolean {
  return dateFnsIsBefore(toDate(date), toDate(dateToCompare));
}

export function isAfter(date: Date | string, dateToCompare: Date | string): boolean {
  return dateFnsIsAfter(toDate(date), toDate(dateToCompare));
}

export function getPreviousMonth(date: Date | string): Date {
  return subMonths(toDate(date), 1);
}

export function getNextMonth(date: Date | string): Date {
  return addMonths(toDate(date), 1);
}

/**
 * Formatea una fecha utilizando el locale español.
 */
export function formatCalendarDate(date: Date | string, formatString: string): string {
  return format(toDate(date), formatString, { locale: es });
}
