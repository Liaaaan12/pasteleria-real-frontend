import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  defaultStock, 
  mapSegmentToId, 
  mapIdToSegment, 
  filterProducts, 
  sortProducts, 
  isPersonalizable,
  getRelatedProducts
} from './products';
import type { Product } from '../types/product';

// Mock de storage para los tests
vi.mock('./storage', () => ({
  getJSON: vi.fn(),
  setJSON: vi.fn()
}));

const mockProducts: Product[] = [
  {
    code: 'TC001',
    name: 'Torta de Chocolate',
    category: 'tortas-especiales',
    price: 15000,
    stock: 5
  },
  {
    code: 'PC001', 
    name: 'Pastel de Choclo',
    category: 'pasteleria-tradicional',
    price: 8000,
    stock: 15
  },
  {
    code: 'SG001',
    name: 'Brownie Sin Gluten',
    category: 'productos-sin-gluten',
    price: 12000
  }
] as Product[];

describe('defaultStock', () => {
  it('asigna valores por defecto a productos sin stock', () => {
    const producto = { name: 'Test', code: 'T001' };
    const result = defaultStock(producto);
    
    expect(result.stock).toBe(10);
    expect(result.stockCritico).toBe(5);
    expect(result.capacidadDiaria).toBe(20);
  });

  it('mantiene valores existentes si son válidos', () => {
    const producto = { 
      name: 'Test', 
      code: 'T001',
      stock: 25,
      stockCritico: 3,
      capacidadDiaria: 50
    };
    const result = defaultStock(producto);
    
    expect(result.stock).toBe(25);
    expect(result.stockCritico).toBe(3);
    expect(result.capacidadDiaria).toBe(50);
  });

  it('reemplaza valores inválidos con defaults', () => {
    const producto = { 
      name: 'Test', 
      code: 'T001',
      stock: NaN,
      stockCritico: 'invalid',
      capacidadDiaria: null
    };
    const result = defaultStock(producto);
    
    expect(result.stock).toBe(10);
    expect(result.stockCritico).toBe(5);
    expect(result.capacidadDiaria).toBe(20);
  });
});

describe('mapSegmentToId', () => {
  it('mapea segmentos a IDs correctamente', () => {
    expect(mapSegmentToId('sin-azucar')).toBe('productos-sin-azucar');
    expect(mapSegmentToId('sin-gluten')).toBe('productos-sin-gluten');
    expect(mapSegmentToId('veganos')).toBe('productos-veganos');
    expect(mapSegmentToId('tradicional')).toBe('pasteleria-tradicional');
    expect(mapSegmentToId('especiales')).toBe('tortas-especiales');
    expect(mapSegmentToId('todos')).toBe('*');
  });

  it('maneja casos especiales', () => {
    expect(mapSegmentToId('')).toBe('*');
    expect(mapSegmentToId(undefined)).toBe('*');
    expect(mapSegmentToId('categoria-personalizada')).toBe('categoria-personalizada');
  });
});

describe('mapIdToSegment', () => {
  it('mapea IDs a segmentos correctamente', () => {
    expect(mapIdToSegment('productos-sin-azucar')).toBe('sin-azucar');
    expect(mapIdToSegment('productos-sin-gluten')).toBe('sin-gluten');
    expect(mapIdToSegment('productos-veganos')).toBe('veganos');
    expect(mapIdToSegment('pasteleria-tradicional')).toBe('tradicional');
    expect(mapIdToSegment('tortas-especiales')).toBe('especiales');
  });

  it('maneja casos especiales', () => {
    expect(mapIdToSegment('*')).toBe('');
    expect(mapIdToSegment('')).toBe('');
    expect(mapIdToSegment(undefined)).toBe('');
    expect(mapIdToSegment('id-personalizado')).toBe('id-personalizado');
  });
});

describe('filterProducts', () => {
  it('filtra productos por categoría', () => {
    const filtered = filterProducts(mockProducts, 'tortas-especiales');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].code).toBe('TC001');
  });

  it('devuelve todos los productos cuando no hay filtro', () => {
    expect(filterProducts(mockProducts)).toEqual(mockProducts);
    expect(filterProducts(mockProducts, '*')).toEqual(mockProducts);
    expect(filterProducts(mockProducts, '')).toEqual(mockProducts);
  });

  it('maneja arrays vacíos o undefined', () => {
    expect(filterProducts(undefined, 'tortas')).toEqual([]);
    expect(filterProducts([], 'tortas')).toEqual([]);
  });
});

describe('sortProducts', () => {
  it('ordena por precio ascendente', () => {
    const sorted = sortProducts(mockProducts, 'price-asc');
    expect(sorted[0].price).toBe(8000);
    expect(sorted[1].price).toBe(12000);
    expect(sorted[2].price).toBe(15000);
  });

  it('ordena por precio descendente', () => {
    const sorted = sortProducts(mockProducts, 'price-desc');
    expect(sorted[0].price).toBe(15000);
    expect(sorted[1].price).toBe(12000);
    expect(sorted[2].price).toBe(8000);
  });

  it('no modifica el array original', () => {
    const original = [...mockProducts];
    sortProducts(mockProducts, 'price-asc');
    expect(mockProducts).toEqual(original);
  });

  it('maneja arrays vacíos o undefined', () => {
    expect(sortProducts(undefined)).toEqual([]);
    expect(sortProducts([])).toEqual([]);
  });
});

describe('isPersonalizable', () => {
  it('identifica productos personalizables', () => {
    expect(isPersonalizable('TC001')).toBe(true);
    expect(isPersonalizable('TE001')).toBe(true);
    expect(isPersonalizable('TE002')).toBe(true);
  });

  it('rechaza productos no personalizables', () => {
    expect(isPersonalizable('PC001')).toBe(false);
    expect(isPersonalizable('SG001')).toBe(false);
    expect(isPersonalizable('')).toBe(false);
    expect(isPersonalizable(undefined)).toBe(false);
  });
});

describe('getRelatedProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devuelve productos relacionados excluyendo el actual', async () => {
    const { getJSON } = await import('./storage');
    vi.mocked(getJSON).mockReturnValue(mockProducts);
    
    const producto = mockProducts[0];
    const related = getRelatedProducts(producto, mockProducts);
    
    expect(related).not.toContainEqual(producto);
    expect(related.length).toBeLessThanOrEqual(4);
  });

  it('maneja producto null', () => {
    const related = getRelatedProducts(null, mockProducts);
    expect(related).toEqual([]);
  });

  it('respeta el límite de cantidad', async () => {
    const { getJSON } = await import('./storage');
    vi.mocked(getJSON).mockReturnValue(mockProducts);
    
    const producto = mockProducts[0];
    const related = getRelatedProducts(producto, mockProducts, 'catalogo', 1);
    
    expect(related.length).toBeLessThanOrEqual(1);
  });
});