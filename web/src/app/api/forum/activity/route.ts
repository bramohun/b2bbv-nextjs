import { NextResponse } from 'next/server';
import { getLatestForumActivity } from '@/lib/forum-service';

export async function GET() {
    try {
        const activity = getLatestForumActivity(5);
        return NextResponse.json(activity);
    } catch (error) {
        console.error('Failed to fetch forum activity:', error);
        return NextResponse.json({ error: 'Failed to fetch forum activity' }, { status: 500 });
    }
}
