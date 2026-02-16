import { NextResponse } from 'next/server';
import { getMedicines, getPharmacies } from '@/lib/data';
import { isAvailableInPharmacy } from '@/lib/utils';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const pharmacyId = searchParams.get('id');

    if (!pharmacyId) {
        return NextResponse.json({ error: 'Pharmacy ID is required' }, { status: 400 });
    }

    try {
        const [medicines, pharmacies] = await Promise.all([
            getMedicines(),
            getPharmacies()
        ]);

        const pharmacy = pharmacies.find(p => p.id === pharmacyId);
        if (!pharmacy) {
            return NextResponse.json({ error: 'Pharmacy not found' }, { status: 404 });
        }

        // Generate stock data server-side
        const stockList = medicines
            .filter(m => isAvailableInPharmacy(m.tkSzam, pharmacyId))
            .map(m => {
                // Deterministic stock quantity
                const str = `${m.tkSzam}-${pharmacyId}-qty`;
                let hash = 0;
                for (let i = 0; i < str.length; i++) {
                    hash = ((hash << 5) - hash) + str.charCodeAt(i);
                    hash |= 0;
                }
                const qty = Math.abs(hash) % 200;

                return {
                    tkSzam: m.tkSzam,
                    nev: m.nev,
                    inn: m.inn || '',
                    kiszereles: m.kiszereles || '',
                    gyarto: m.gyarto || '',
                    status: m.status,
                    dapieces: qty,
                };
            });

        return NextResponse.json({
            pharmacy,
            stocks: stockList,
            totalStockItems: stockList.length,
        });
    } catch (error) {
        console.error('Error fetching pharmacy stock:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
