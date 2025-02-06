import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.text();
  console.log(body);
  return NextResponse.json({ message: 'todo' }, { status: 200 });
}
