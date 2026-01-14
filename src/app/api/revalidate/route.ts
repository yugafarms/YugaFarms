import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
    try {
        // 1. Verify Secret
        const secret = request.headers.get('x-strapi-revalidate-secret');

        // Check both header implementation (custom) and authorization header
        if (secret !== process.env.STRAPI_REVALIDATE_SECRET) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }

        const payload = await request.json();
        const model = payload.model;
        const entry = payload.entry;

        console.log(`[Webhook] Received update for model: ${model}`);

        // 2. Revalidate Logic
        // Since the app currently fetches everything client-side, this revalidatePath 
        // is preparation for when we move to Server Components.
        // Revalidating the root layout clears the Data Cache for all pages.
        revalidatePath('/', 'layout');

        // If you add tags in the future, you can use:
        // if (model === 'product') revalidateTag('products');

        return NextResponse.json({ revalidated: true, model, now: Date.now() });
    } catch (err) {
        console.error('[Webhook] Error:', err);
        return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
    }
}
