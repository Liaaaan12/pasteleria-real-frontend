import { describe, it, expect } from 'vitest';
import { formatCLP } from './currency';

const zero = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(0);

describe('formatCLP', () => {
  it('formats a number to CLP', () => {
    expect(formatCLP(1000)).toBe(new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(1000));
  });

  it('returns fallback for null/undefined/NaN', () => {
    expect(formatCLP(null)).toBe(zero);
    expect(formatCLP(undefined)).toBe(zero);
    expect(formatCLP(Number.NaN)).toBe(zero);
  });
});
