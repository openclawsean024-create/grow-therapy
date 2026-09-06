import { describe, it, expect } from 'vitest';
import { formatDate, formatTime, formatDateTime, formatCurrency, getAvailableSlots } from '@/lib/utils';

describe('utils — date formatting', () => {
  it('formatDate handles ISO string', () => {
    expect(formatDate('2024-12-15')).toBe('Dec 15, 2024');
  });

  it('formatDate handles Date object', () => {
    const d = new Date(2024, 5, 15); // June 15, 2024 (local)
    const out = formatDate(d);
    expect(out).toMatch(/Jun 15, 2024/);
  });

  it('formatDate falls back to now() for invalid input', () => {
    const out = formatDate('not-a-date');
    // Should be today's date, just verify it parses
    expect(out).toMatch(/[A-Z][a-z]+ \d+, \d{4}/);
  });

  it('formatTime produces 12h format', () => {
    const out = formatTime('2024-12-15T14:30:00');
    expect(out).toMatch(/\d{1,2}:\d{2} (AM|PM)/);
  });

  it('formatDateTime combines date and time', () => {
    const out = formatDateTime('2024-12-15T14:30:00');
    expect(out).toMatch(/Dec 15, 2024/);
    expect(out).toMatch(/\d{1,2}:\d{2} (AM|PM)/);
  });
});

describe('utils — currency', () => {
  it('formatCurrency formats USD', () => {
    expect(formatCurrency(150)).toBe('$150.00');
  });

  it('formatCurrency handles zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('formatCurrency handles negative', () => {
    expect(formatCurrency(-25.5)).toBe('-$25.50');
  });

  it('formatCurrency handles large numbers with commas', () => {
    const out = formatCurrency(1234567);
    expect(out).toBe('$1,234,567.00');
  });
});

describe('utils — available slots', () => {
  it('returns 7 default slots', () => {
    expect(getAvailableSlots()).toHaveLength(7);
  });

  it('first slot is 9:00 AM', () => {
    expect(getAvailableSlots()[0]).toBe('9:00 AM');
  });

  it('last slot is 4:00 PM', () => {
    expect(getAvailableSlots()[6]).toBe('4:00 PM');
  });

  it('returns fresh array each call (no mutation)', () => {
    const a = getAvailableSlots();
    const b = getAvailableSlots();
    expect(a).not.toBe(b);
    expect(a).toEqual(b);
  });
});
