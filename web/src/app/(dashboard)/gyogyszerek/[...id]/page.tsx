/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ
 * ============================================================================
 * 
 * HASZNÁLAT ÉS CÉL:
 * Visszafelé kompatibilis átirányítás a régi dinamikus útvonalról (`/gyogyszerek/[...id]`)
 * az új statikus kompatibilis query paraméteres adatlapra (`/gyogyszerek/adatlap?tk=...`).
 */

import { redirect } from 'next/navigation';
import { getMedicines } from '@/lib/data';

export async function generateStaticParams() {
    const medicines = await getMedicines();
    return medicines.slice(0, 100).map((m) => ({
        id: m.tkSzam.split('/')
    }));
}

interface PageProps {
    params: Promise<{ id: string[] }>;
}

export default async function MedicineDetailPage({ params }: PageProps) {
    const { id } = await params;
    const tkSzam = id.map(segment => decodeURIComponent(segment)).join('/');
    redirect(`/gyogyszerek/adatlap?tk=${encodeURIComponent(tkSzam)}`);
}
