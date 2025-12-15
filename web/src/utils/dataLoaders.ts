import slugify from "./slugify";
import api from "../services/api";
import type { Product, Category, Catalog } from "../types/product";
import type { Region, Comuna, RegionWithComunas } from "../types/region";

// Runtime state populated via initDataLoaders()
export let products: Product[] = [];
export let catalog: Catalog = {
    nombre_pasteleria: "Pasteleria Mil Sabores",
    categorias: [],
};
export let regions: RegionWithComunas[] = [];
export let comunas: Comuna[] = [];
export let comunasByRegionSlug: Record<string, Comuna[]> = {};

// --- Helpers ---
function toProduct(apiProd: any): Product {
    const categoryName =
        apiProd.categoria?.nombre ||
        apiProd.nombre_categoria ||
        apiProd.categoria ||
        apiProd.category ||
        "sin-categoria";

    return {
        code: String(apiProd.codigo_producto ?? apiProd.code ?? apiProd.id ?? ""),
        productName:
            apiProd.nombre_producto ?? apiProd.productName ?? apiProd.nombre ?? "Sin nombre",
        price: Number(apiProd.precio_producto ?? apiProd.price ?? apiProd.precio ?? 0),
        img: apiProd.imagen_producto ?? apiProd.img ?? apiProd.imagen ?? "",
        category: slugify(categoryName),
        desc:
            apiProd["descripción_producto"] ??
            apiProd.descripcion_producto ??
            apiProd.desc ??
            "",
        stock: Number(apiProd.stock ?? 0),
        stockCritico: Number(apiProd.stock_critico ?? apiProd.stockCritico ?? 0),
    } as Product;
}

function rebuildCatalogFromProducts(list: Product[]) {
    const categoryMap: Record<string, Category> = {};
    let nextCategoryId = 1;

    for (const p of list) {
        const catKey = p.category || "sin-categoria";
        if (!categoryMap[catKey]) {
            categoryMap[catKey] = {
                id_categoria: nextCategoryId++,
                nombre_categoria: catKey.replace(/-/g, " "),
                productos: [],
            } as Category;
        }

        categoryMap[catKey].productos.push({
            codigo_producto: p.code,
            nombre_producto: p.productName,
            precio_producto: p.price,
            descripción_producto: p.desc,
            imagen_producto: p.img,
            stock: p.stock,
            stock_critico: p.stockCritico,
        });
    }

    catalog.categorias = Object.values(categoryMap);
}

function mapRegions(raw: any[]): RegionWithComunas[] {
    return raw.map((r) => {
        const regionName: string = r.region || String(r.nombre || "");
        const regionId: string = String(r.id ?? regionName);
        const regionSlug = slugify(regionName || `region-${regionId}`);

        const comunasMapped: Comuna[] = (r.comunas || []).map((c: any) => {
            const comunaName = typeof c === "string" ? c : String(c?.nombre ?? c);
            const comunaSlug = slugify(comunaName);
            return {
                id: `${regionSlug}-${comunaSlug}`,
                name: comunaName,
                slug: comunaSlug,
                regionId,
                regionSlug,
            } as Comuna;
        });

        return {
            id: regionId,
            name: regionName,
            slug: regionSlug,
            comunas: comunasMapped,
        } as RegionWithComunas;
    });
}

// --- Public API ---
export async function initDataLoaders(): Promise<void> {
    // Helper to GET with skipAuthRedirect to avoid global 401 redirect during bootstrap
    const safeGet = async <T = any>(path: string): Promise<T | null> => {
        try {
            const res = await api.get(path, { /* @ts-ignore */ skipAuthRedirect: true } as any);
            return res.data as T;
        } catch {
            return null;
        }
    };

    // Load products from external API (public if possible)
    const apiProducts = await safeGet<any[]>("/productos");
    products = (apiProducts || []).map(toProduct);
    rebuildCatalogFromProducts(products);

    // Load regiones/comunas if backend provides them (optional)
    const regionesData = await safeGet<any[]>("/regiones-comunas");
    regions = mapRegions(regionesData || []);

    comunas = regions.flatMap((r) => r.comunas);
    comunasByRegionSlug = {};
    for (const r of regions) comunasByRegionSlug[r.slug] = r.comunas;
}

export function getRegionBySlug(slug: string): Region | undefined {
    return regions.find((r) => r.slug === slug);
}

export function getComunasByRegionSlug(slug: string): Comuna[] {
    return comunasByRegionSlug[slug] || [];
}

export default {
    initDataLoaders,
    products,
    catalog,
    regions,
    comunas,
    comunasByRegionSlug,
    getRegionBySlug,
    getComunasByRegionSlug,
};
