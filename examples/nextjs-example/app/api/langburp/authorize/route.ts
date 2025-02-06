import { NextResponse } from 'next/server';
import { LangburpClient } from '@langburp/langburp-js';

export async function POST(request: Request) {
    const body = await request.json();
    console.log(body);
    const { state } = body;
    const apiClient = new LangburpClient({
        publicApiKey: process.env.NEXT_PUBLIC_LANGBURP_API_KEY!,
        secretApiKey: process.env.LANGBURP_SECRET_API_KEY,
    });
    const res = await apiClient.endUserAuth.authorizeEndUser({
        authorizeEndUserSchema: {
            state,
        },
    });
    return NextResponse.json(res, { status: 200 });
}
