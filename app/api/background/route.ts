import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

const BACKGROUND_KEY = 'current-background';
const DEFAULT_BACKGROUND = 'alita-4';

export async function GET() {
  try {
    const backgroundId = await kv.get<string>(BACKGROUND_KEY) || DEFAULT_BACKGROUND;
    
    return NextResponse.json(
      { backgroundId },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache',
        }
      }
    );
  } catch (error) {
    console.error('KV GET error:', error);
    return NextResponse.json(
      { backgroundId: DEFAULT_BACKGROUND },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        }
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.backgroundId) {
      return NextResponse.json(
        { error: 'backgroundId is required' },
        { status: 400 }
      );
    }
    
    await kv.set(BACKGROUND_KEY, body.backgroundId);
    
    return NextResponse.json(
      { backgroundId: body.backgroundId },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        }
      }
    );
  } catch (error) {
    console.error('KV SET error:', error);
    return NextResponse.json(
      { error: 'Failed to update' },
      { status: 500 }
    );
  }
}