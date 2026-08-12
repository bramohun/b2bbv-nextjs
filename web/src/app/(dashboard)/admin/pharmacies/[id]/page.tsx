/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ - GYÓGYSZERTÁR ADMIN RÉSZLETES NÉZET
 * ============================================================================
 * 
 * ÚTVONAL: /admin/pharmacies/[id]
 */

import AdminPharmacyDetailClient from '@/components/admin/AdminPharmacyDetailClient';
import { getPharmacies } from '@/lib/data';

export async function generateStaticParams() {
    const pharmacies = await getPharmacies();
    return pharmacies.slice(0, 100).map((p) => ({
        id: p.id
    }));
}

export default function AdminPharmacyDetailPage() {
    return <AdminPharmacyDetailClient />;
}
