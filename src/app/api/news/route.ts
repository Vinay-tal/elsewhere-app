import { NextRequest, NextResponse } from 'next/server';
import { getVerifiedWorldNews } from '@/lib/newsService';
import { NewsCategory } from '@/types/content';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryParam = searchParams.get('category');
    const forceFresh = searchParams.get('forceFresh') === 'true';
    const simulateError = searchParams.get('simulateError') === 'true';

    // Simulated error state for testing client resilience
    if (simulateError) {
      return NextResponse.json(
        {
          success: false,
          items: [],
          source: 'curated_fallback',
          error: 'Simulated API failure for client error boundary verification.',
          totalCount: 0,
        },
        { status: 503 }
      );
    }

    const category = (categoryParam as NewsCategory) || 'All';
    const result = await getVerifiedWorldNews({ category, forceFresh });

    return NextResponse.json(
      {
        success: true,
        items: result.items,
        source: result.source,
        cachedAt: result.cachedAt,
        error: result.error,
        totalCount: result.items.length,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=300',
        },
      }
    );
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Internal server error while fetching world news.';
    return NextResponse.json(
      {
        success: false,
        items: [],
        source: 'curated_fallback',
        error: errorMsg,
        totalCount: 0,
      },
      { status: 500 }
    );
  }
}
