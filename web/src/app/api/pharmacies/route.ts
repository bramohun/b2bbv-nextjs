import { NextResponse } from 'next/server';
import { getPharmacies } from '@/lib/data';

export async function GET() {
    const pharmacies = await getPharmacies();
    return NextResponse.json(pharmacies);
}
