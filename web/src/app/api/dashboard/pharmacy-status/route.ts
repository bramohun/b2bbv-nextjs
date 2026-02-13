import { NextResponse } from 'next/server';
import { getPharmacyStockStats } from '@/lib/data';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const pharmacyId = searchParams.get('id');
    const period = parseInt(searchParams.get('period') || '1', 10);

    if (!pharmacyId) {
        return NextResponse.json({ error: 'Pharmacy ID is required' }, { status: 400 });
    }

    try {
        const stats = await getPharmacyStockStats(pharmacyId, period);
        return NextResponse.json(stats);
    } catch (error) {
        console.error('Error fetching pharmacy stats:', error);
        return NextResponse.json({ error: 'Failed to fetch pharmacy stats' }, { status: 500 });
    }
}
