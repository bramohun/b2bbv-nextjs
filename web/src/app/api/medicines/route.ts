import { NextResponse } from 'next/server';
import { getMedicines } from '@/lib/data';

export async function GET() {
    const medicines = await getMedicines();
    return NextResponse.json(medicines);
}
