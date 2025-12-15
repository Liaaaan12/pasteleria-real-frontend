import { describe, it, expect, beforeEach } from 'vitest';
import { readUsers, writeUsers, createUser, findUserByEmail, isDuocEmail, isBirthdayToday } from './registro';

describe('registro utils', () => {
  beforeEach(() => {
    localStorage.clear();
    writeUsers([]);
  });

  it('readUsers and writeUsers roundtrip', () => {
    const u = [{ run: '1', name: 'A', lastname: 'B', email: 'a@b.com', birthdate: '2000-01-01', password: 'pw', createdAt: new Date().toISOString() }];
    writeUsers(u as any);
    expect(readUsers()).toEqual(u);
  });

  it('createUser returns ok and prevents duplicate emails', () => {
    writeUsers([]);
    const payload = { run: '2', name: 'C', lastname: 'D', email: 'dup@x.com', birthdate: '1990-01-01', password: 'pw' } as any;
    const r1 = createUser(payload);
    expect((r1 as any).ok).toBe(true);
    const r2 = createUser(payload);
    expect((r2 as any).ok).toBe(false);
    expect((r2 as any).error).toBe('email_exists');
  });

  it('findUserByEmail finds user', () => {
    writeUsers([{ run: '3', name: 'N', lastname: 'L', email: 'find@x.com', birthdate: '1990-01-01', password: 'pw', createdAt: new Date().toISOString() } as any]);
    const f = findUserByEmail('find@x.com');
    expect(f).toBeDefined();
    expect(f?.email).toBe('find@x.com');
  });

  it('isDuocEmail works for subdomains and other domains', () => {
    expect(isDuocEmail('usuario@duoc.cl')).toBe(true);
    expect(isDuocEmail('profesor@profesor.duoc.cl')).toBe(true);
    expect(isDuocEmail('test@gmail.com')).toBe(false);
  });

  it('isBirthdayToday returns true for today', () => {
    const t = new Date();
    const y = t.getFullYear();
    const m = String(t.getMonth() + 1).padStart(2, '0');
    const d = String(t.getDate()).padStart(2, '0');
    const today = `${y}-${m}-${d}`;
    expect(isBirthdayToday(today)).toBe(true);
    expect(isBirthdayToday('2000-01-02')).toBe(false);
  });
});
