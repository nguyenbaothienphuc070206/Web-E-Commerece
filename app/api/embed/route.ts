import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Thiếu OPENAI_API_KEY. Endpoint /api/embed đang bị tắt.' },
        { status: 503 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Thiếu text rồi ông ơi' }, { status: 400 });
    }

    // Gọi OpenAI để biến chữ thành số (Vector 1536 chiều)
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small', // Model ngon bổ rẻ nhất hiện nay
      input: text.replace(/\n/g, ' '), // Xóa xuống dòng thừa
    });

    const embedding = response.data[0].embedding;

    return NextResponse.json({ embedding });
  } catch (error: any) {
    console.error('Lỗi OpenAI:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}