import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
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

    // Generate an embedding vector from the input text.
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text.replace(/\n/g, ' '),
    });

    const embedding = response.data[0].embedding;

    return NextResponse.json({ embedding });
  } catch (error: any) {
    console.error('OpenAI error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}