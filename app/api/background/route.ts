import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

const BACKGROUND_KEY = 'current-background';
const DEFAULT_BACKGROUND = 'video-1';

export async function GET() {
    try {
        const backgroundId = await kv.get<string>(BACKGROUND_KEY) || DEFAULT_BACKGROUND;
        return NextResponse.json({ backgroundId });
    } catch (error) {
        console.error('KV GET error:', error);
        return NextResponse.json({ backgroundId: DEFAULT_BACKGROUND });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        await kv.set(BACKGROUND_KEY, body.backgroundId);
        return NextResponse.json({ backgroundId: body.backgroundId });
    } catch (error) {
        console.error('KV SET error:', error);
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}