/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ - STATIKUS ADATFETCH HELPER
 * ============================================================================
 * 
 * USER STORY:
 * Rendszerfejlesztőként olyan robusztus adatbeolvasási mechanizmusra van szükségem,
 * amely GitHub Pages statikus export esetén és helyi fejlesztői környezetben is
 * megbízhatóan betölti a pre-generált JSON adatfájlokat.
 * 
 * FUNKCIÓK:
 * - Statikus JSON adatok betöltése relatív és alapértelmezett útvonalakról.
 * - Automatikus fallback mechanizmus sikertelen lekérés esetén.
 */

export async function fetchStaticData<T>(jsonPath: string): Promise<T> {
    const cleanPath = jsonPath.startsWith('/') ? jsonPath : `/${jsonPath}`;
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const primaryUrl = `${basePath}${cleanPath}`;

    try {
        const res = await fetch(primaryUrl);
        if (res.ok) {
            return await res.json();
        }
        const relRes = await fetch(`.${cleanPath}`);
        if (relRes.ok) {
            return await relRes.json();
        }
        throw new Error(`HTTP error ${res.status}`);
    } catch (err) {
        console.warn(`Primary static fetch failed for ${primaryUrl}, trying relative path:`, err);
        const relRes = await fetch(`.${cleanPath}`);
        return await relRes.json();
    }
}
