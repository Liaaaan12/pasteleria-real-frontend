import { describe, it, expect, beforeEach } from 'vitest';
import { isAdminEmail } from './roles';
import { writeUsers } from './registro';
import { setJSON } from './storage';

describe('roles helpers', () => {
  beforeEach(() => {
    localStorage.clear();
    writeUsers([]);
  });

  it('returns true for primary admin email', () => {
    expect(isAdminEmail('pasteleriamilsabores.fm@gmail.com')).toBe(true);
  });

  it('returns true for a registered user with Administrador role', () => {
    writeUsers([{
      run: '9', name: 'Admin', lastname: 'One', email: 'admin@site.com', birthdate: '1990-01-01', password: 'pw', role: 'Administrador', createdAt: new Date().toISOString()
    } as any]);
    expect(isAdminEmail('admin@site.com')).toBe(true);
  });

  it('returns true for legacy usuarios store with rol Administrador', () => {
    setJSON('usuarios', [{ correo: 'legacy@x.com', rol: 'Administrador' }]);
    expect(isAdminEmail('legacy@x.com')).toBe(true);
  });

  it('returns false for non-admin emails', () => {
    expect(isAdminEmail('user@x.com')).toBe(false);
  });
});
