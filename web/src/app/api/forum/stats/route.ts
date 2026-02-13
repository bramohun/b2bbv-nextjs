import { NextResponse, NextRequest } from 'next/server';
import { getForumStats } from '@/lib/forum-service';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const period = Number(searchParams.get('period')) || 1;

        const stats = getForumStats(period);
        return NextResponse.json(stats);
    } catch (error) {
        console.error('Failed to fetch forum stats:', error);
        return NextResponse.json({ error: 'Failed to fetch forum stats' }, { status: 500 });
    }
}
