import { describe, it, expect } from 'vitest';
import { formatearRun, validarRun, emailDominioValido } from './validation';

describe('formatearRun', () => {
  it('formatea RUT correctamente', () => {
    expect(formatearRun('123456789')).toBe('12.345.678-9');
    expect(formatearRun('12345678k')).toBe('12.345.678-K');
    expect(formatearRun('1234567890')).toBe('123456789-0'); // 10 dígitos, cuerpo de 9
  });

  it('maneja caracteres especiales y espacios', () => {
    expect(formatearRun('12.345.678-9')).toBe('12.345.678-9');
    expect(formatearRun('12 345 678 k')).toBe('12.345.678-K');
    expect(formatearRun('  123456789  ')).toBe('12.345.678-9');
  });

  it('maneja casos edge', () => {
    expect(formatearRun('')).toBe('');
    expect(formatearRun('1')).toBe('1');
    expect(formatearRun('12')).toBe('1-2');
  });

  it('maneja RUTs de 8 dígitos', () => {
    expect(formatearRun('12345678')).toBe('1.234.567-8');
    expect(formatearRun('87654321')).toBe('8.765.432-1');
  });
});

describe('validarRun', () => {
  it('valida RUTs correctos', () => {
    expect(validarRun('12.345.678-5')).toBe(true);
    expect(validarRun('11.111.111-1')).toBe(true);
    expect(validarRun('22.222.222-2')).toBe(true);
  });

  it('rechaza RUTs inválidos', () => {
    expect(validarRun('12.345.678-9')).toBe(false); // DV incorrecto
    expect(validarRun('123456789')).toBe(false); // Sin formato
    expect(validarRun('12.345.678')).toBe(false); // Sin DV
    expect(validarRun('')).toBe(false); // Vacío
  });

  it('maneja tipos de entrada inválidos', () => {
    expect(validarRun(null as any)).toBe(false);
    expect(validarRun(undefined as any)).toBe(false);
    expect(validarRun(123 as any)).toBe(false);
  });
});

describe('emailDominioValido', () => {
  it('acepta dominios permitidos', () => {
    expect(emailDominioValido('usuario@duoc.cl')).toBe(true);
    expect(emailDominioValido('profesor@profesor.duoc.cl')).toBe(true);
    expect(emailDominioValido('test@gmail.com')).toBe(true);
  });

  it('rechaza dominios no permitidos', () => {
    expect(emailDominioValido('usuario@hotmail.com')).toBe(false);
    expect(emailDominioValido('test@yahoo.com')).toBe(false);
    expect(emailDominioValido('admin@empresa.cl')).toBe(false);
  });

  it('maneja casos edge', () => {
    expect(emailDominioValido('')).toBe(false);
    expect(emailDominioValido(undefined)).toBe(false);
    expect(emailDominioValido('correo-sin-dominio')).toBe(false);
  });

  it('es case insensitive', () => {
    expect(emailDominioValido('USUARIO@DUOC.CL')).toBe(true);
    expect(emailDominioValido('Test@Gmail.Com')).toBe(true);
  });
});