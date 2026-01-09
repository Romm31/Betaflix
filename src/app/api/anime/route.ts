import { NextRequest, NextResponse } from 'next/server';

const EXTERNAL_API = 'https://api.sansekai.my.id/api';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const endpoint = searchParams.get('endpoint') || '/anime/recommended';
  const page = searchParams.get('page') || '1';
  const query = searchParams.get('query') || '';

  // Build the external URL
  let url = `${EXTERNAL_API}${endpoint}`;
  
  // Add query params based on endpoint type
  if (endpoint.includes('search') && query) {
    url += `?query=${encodeURIComponent(query)}`;
  } else if (endpoint.includes('detail')) {
    const urlId = searchParams.get('urlId');
    if (urlId) {
      url += `?urlId=${encodeURIComponent(urlId)}`;
    }
  } else {
    url += `?page=${page}`;
  }

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `External API returned ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from external API' },
      { status: 500 }
    );
  }
}
