import { describe, it, expect, beforeEach } from 'vitest';
import { getJSON, setJSON, remove } from './storage';

describe('storage helpers', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('setJSON and getJSON roundtrip', () => {
    setJSON('k', { a: 1, b: 'x' });
    expect(getJSON('k')).toEqual({ a: 1, b: 'x' });
  });

  it('remove deletes key', () => {
    setJSON('x', { ok: true });
    expect(getJSON('x')).not.toBeNull();
    remove('x');
    expect(getJSON('x')).toBeNull();
  });

  it('getJSON returns null for invalid JSON', () => {
    localStorage.setItem('bad', 'not a json');
    expect(getJSON('bad')).toBeNull();
  });
});
