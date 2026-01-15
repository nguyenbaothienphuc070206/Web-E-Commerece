import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getSessionUserFromCookies } from '@/lib/server/auth';
import { getRequestIp, rateLimit } from '@/lib/server/rate-limit';

export async function POST(req: Request) {
  try {
    const user = await getSessionUserFromCookies();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ip = getRequestIp(req);
    const rl = await rateLimit({ key: `embed:${ip}`, limit: 20, windowMs: 60_000 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again shortly.' },
        { status: 429, headers: { 'x-ratelimit-reset': String(rl.resetAt) } }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Missing OPENAI_API_KEY. The /api/embed endpoint is disabled.' },
        { status: 503 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required.' }, { status: 400 });
    }

    const input = String(text);
    if (input.length > 4000) {
      return NextResponse.json({ error: 'Text is too long.' }, { status: 400 });
    }

    // Generate an embedding vector from the input text.
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: input.replace(/\n/g, ' '),
    });

    const embedding = response.data[0].embedding;

    return NextResponse.json({ embedding });
  } catch (error: any) {
    console.error('OpenAI error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}