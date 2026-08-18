import {
  getMonthDays,
  isCurrentMonth,
  isSameDay,
  isSameMonth,
  isBefore,
  isAfter,
  getPreviousMonth,
  getNextMonth,
  getToday,
  formatCalendarDate
} from './calendar.utils';

describe('Calendar Domain Utilities', () => {

  describe('toDate Normalization', () => {
    it('should throw error on invalid date string', () => {
      expect(() => getMonthDays('not-a-date')).toThrowError(/Invalid date provided/);
    });

    it('should throw error on invalid date object', () => {
      expect(() => getMonthDays(new Date('invalid'))).toThrowError(/Invalid date provided/);
    });

    it('should process valid ISO string with Z (UTC)', () => {
      // Debería poder parsear y no lanzar error
      const result = isSameMonth('2026-08-18T12:30:00Z', '2026-08-15T12:00:00Z');
      expect(result).toBeTrue();
    });

    it('should process valid Date object', () => {
      const result = isSameMonth(new Date('2026-08-18T12:30:00Z'), new Date('2026-08-15T12:00:00Z'));
      expect(result).toBeTrue();
    });
  });

  describe('getMonthDays (Grid)', () => {
    it('should return a grid starting on Monday for a leap year February (2024)', () => {
      // Febrero 2024 empezó un jueves.
      const grid = getMonthDays('2024-02-15T12:00:00Z');
      expect(grid.length % 7).toBe(0);
      
      const firstDay = grid[0];
      // 1 en JS = Lunes para Date.getDay()
      expect(firstDay.getDay()).toBe(1);
      expect(firstDay.getDate()).toBe(29); // 29 de Enero
      expect(firstDay.getMonth()).toBe(0); // Enero
    });

    it('should return a grid starting on Monday for a month starting on Monday (Sep 2025)', () => {
      // Septiembre 2025 empieza un Lunes.
      const grid = getMonthDays('2025-09-01T12:00:00Z');
      const firstDay = grid[0];
      expect(firstDay.getDay()).toBe(1);
      expect(firstDay.getDate()).toBe(1);
      expect(firstDay.getMonth()).toBe(8); // Septiembre
    });

    it('should return a grid starting on Monday for a month starting on Sunday (Feb 2026)', () => {
      // Febrero 2026 empieza un Domingo.
      const grid = getMonthDays('2026-02-01T12:00:00Z');
      const firstDay = grid[0];
      expect(firstDay.getDay()).toBe(1);
      expect(firstDay.getDate()).toBe(26); // 26 de Enero 2026
      expect(firstDay.getMonth()).toBe(0); // Enero
    });
  });

  describe('isCurrentMonth', () => {
    it('should identify a date in the same month', () => {
      expect(isCurrentMonth('2026-08-18T12:30:00Z', '2026-08-01T12:00:00Z')).toBeTrue();
    });

    it('should identify a date in the previous month', () => {
      expect(isCurrentMonth('2026-07-31T23:59:59Z', '2026-08-01T12:00:00Z')).toBeFalse();
    });

    it('should identify a date in the next month', () => {
      expect(isCurrentMonth('2026-09-01T12:00:00Z', '2026-08-01T12:00:00Z')).toBeFalse();
    });
  });

  describe('Comparisons', () => {
    it('should correctly compare same day', () => {
      expect(isSameDay('2026-08-18T10:30:00', '2026-08-18T20:45:00')).toBeTrue();
      expect(isSameDay('2026-08-18T10:30:00', '2026-08-19T10:30:00')).toBeFalse();
    });

    it('should correctly check isBefore', () => {
      expect(isBefore('2026-08-17T00:00:00', '2026-08-18T00:00:00')).toBeTrue();
      expect(isBefore('2026-08-19T00:00:00', '2026-08-18T00:00:00')).toBeFalse();
    });

    it('should correctly check isAfter', () => {
      expect(isAfter('2026-08-19T00:00:00', '2026-08-18T00:00:00')).toBeTrue();
      expect(isAfter('2026-08-17T00:00:00', '2026-08-18T00:00:00')).toBeFalse();
    });
  });

  describe('Navigation', () => {
    it('should get previous month', () => {
      const prev = getPreviousMonth('2026-01-15T00:00:00');
      expect(prev.getMonth()).toBe(11); // Diciembre
      expect(prev.getFullYear()).toBe(2025);
    });

    it('should get next month', () => {
      const next = getNextMonth('2026-12-15T00:00:00');
      expect(next.getMonth()).toBe(0); // Enero
      expect(next.getFullYear()).toBe(2027);
    });

    it('should get today deterministically based on local time', () => {
      const today = getToday();
      const actualToday = new Date();
      expect(today.getFullYear()).toBe(actualToday.getFullYear());
      expect(today.getMonth()).toBe(actualToday.getMonth());
      expect(today.getDate()).toBe(actualToday.getDate());
      expect(today.getHours()).toBe(0);
      expect(today.getMinutes()).toBe(0);
    });
  });

  describe('Formatting', () => {
    it('should format date using spanish locale', () => {
      // 18 de agosto de 2026 es Martes
      const formatted = formatCalendarDate('2026-08-18T10:00:00', 'EEEE d MMMM yyyy');
      // date-fns en español retorna minúsculas habitualmente, ajustamos a la expectativa
      expect(formatted.toLowerCase()).toContain('martes');
      expect(formatted.toLowerCase()).toContain('agosto');
      expect(formatted).toContain('18');
      expect(formatted).toContain('2026');
    });

    it('should format short day names', () => {
      const formatted = formatCalendarDate('2026-08-18T10:00:00', 'EEEEEE'); // ma (martes) o similar
      expect(formatted.toLowerCase().startsWith('ma')).toBeTrue();
    });
  });

});
