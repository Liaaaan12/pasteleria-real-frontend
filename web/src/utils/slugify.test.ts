import { describe, it, expect } from 'vitest';
import slugify from './slugify';

describe('slugify', () => {
  it('convierte texto con acentos a slug válido', () => {
    expect(slugify('Tarta de Manzana')).toBe('tarta-de-manzana');
    expect(slugify('Pastelería Artesanal')).toBe('pasteleria-artesanal');
    expect(slugify('Café con Leche')).toBe('cafe-con-leche');
  });

  it('maneja caracteres especiales correctamente', () => {
    expect(slugify('Postre & Dulce!')).toBe('postre-dulce');
    expect(slugify('100% Natural')).toBe('100-natural');
    expect(slugify('Torta #1')).toBe('torta-1');
  });

  it('elimina espacios extra y guiones al inicio/final', () => {
    expect(slugify('  Brownie Sin Gluten  ')).toBe('brownie-sin-gluten');
    expect(slugify('---Cheesecake---')).toBe('cheesecake');
    expect(slugify('   ---   Tiramisú   ---   ')).toBe('tiramisu');
  });

  it('maneja strings vacíos y casos edge', () => {
    expect(slugify('')).toBe('');
    expect(slugify('   ')).toBe('');
    expect(slugify('---')).toBe('');
  });

  it('convierte a minúsculas correctamente', () => {
    expect(slugify('TORTA CHOCOLATE')).toBe('torta-chocolate');
    expect(slugify('MiXeD CaSe')).toBe('mixed-case');
  });
});