import { describe, it, expect } from 'vitest';
import { parseAmount, parseDay, sanitizeText } from './sanitize.js';

describe('sanitizeText', () => {
  it('removes angle brackets and hidden characters', () => {
    expect(sanitizeText('<script>alert(1)</script>')).toBe('scriptalert(1)/script');
    expect(sanitizeText('hi\u0000there')).toBe('hithere');
  });
  it('squeezes spaces, trims and limits length', () => {
    expect(sanitizeText('  a   b  ')).toBe('a b');
    expect(sanitizeText('abcdefghij', 4)).toBe('abcd');
  });
  it('handles empty values', () => {
    expect(sanitizeText(null)).toBe('');
    expect(sanitizeText(undefined)).toBe('');
  });
});

describe('parseAmount', () => {
  it('accepts normal amounts', () => {
    expect(parseAmount('250')).toBe(250);
    expect(parseAmount('12.5')).toBe(12.5);
  });
  it('rejects zero, negative, empty, text and huge values', () => {
    expect(parseAmount('0')).toBeNull();
    expect(parseAmount('-5')).toBeNull();
    expect(parseAmount('')).toBeNull();
    expect(parseAmount('abc')).toBeNull();
    expect(parseAmount('99999999')).toBeNull();
    expect(parseAmount(Infinity)).toBeNull();
  });
});

describe('parseDay', () => {
  it('accepts whole days from 1 to 30', () => {
    expect(parseDay('1')).toBe(1);
    expect(parseDay(30)).toBe(30);
  });
  it('rejects everything else', () => {
    expect(parseDay(0)).toBeNull();
    expect(parseDay(31)).toBeNull();
    expect(parseDay(2.5)).toBeNull();
    expect(parseDay('x')).toBeNull();
  });
});
