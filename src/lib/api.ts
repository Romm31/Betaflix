import {
  LatestAnimeResponse,
  MovieResponse,
  SearchResponse,
  DetailResponse,
  VideoResponse,
  Resolution,
  Anime,
  AnimeDetail,
  RawAnime,
  normalizeAnimeList,
  normalizeAnimeDetail,
  MAX_ITEMS,
} from './types';

// Use local proxy to avoid CORS issues
const getProxyUrl = () => {
  // In browser, use relative URL. On server, use absolute URL.
  if (typeof window !== 'undefined') {
    return '/api/anime';
  }
  // For server-side, we can call external API directly
  return 'https://api.sansekai.my.id/api';
};

// Generic fetch wrapper with error handling
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit & { revalidate?: number | false }
): Promise<T> {
  const { revalidate = 60, ...fetchOptions } = options || {};
  
  // Check if we're in browser or server
  const isClient = typeof window !== 'undefined';
  
  let url: string;
  if (isClient) {
    // Use proxy for client-side requests
    const params = new URLSearchParams();
    
    // Parse the endpoint to extract query params
    const [basePath, queryString] = endpoint.split('?');
    params.set('endpoint', basePath);
    
    if (queryString) {
      const existingParams = new URLSearchParams(queryString);
      existingParams.forEach((value, key) => {
        params.set(key, value);
      });
    }
    
    url = `/api/anime?${params.toString()}`;
  } else {
    // Direct API call for server-side
    url = `https://api.sansekai.my.id/api${endpoint}`;
  }
  
  try {
    const res = await fetch(url, {
      ...fetchOptions,
      headers: {
        'Accept': 'application/json',
        ...fetchOptions.headers,
      },
      ...(isClient ? {} : { next: revalidate === false ? { revalidate: 0 } : { revalidate } }),
    });

    if (!res.ok) {
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data as T;
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    throw error;
  }
}

// Get latest anime with pagination
export async function getLatestAnime(page: number = 1, limit?: number): Promise<Anime[]> {
  try {
    const response = await fetchAPI<LatestAnimeResponse>(
      `/anime/latest?page=${page}`,
      { revalidate: 60 }
    );
    const normalized = normalizeAnimeList(response || [], false);
    return limit ? normalized.slice(0, limit) : normalized;
  } catch (error) {
    console.error('Failed to fetch latest anime:', error);
    return [];
  }
}

// Get recommended anime with pagination (supports up to page 100+)
export async function getRecommendedAnime(page: number = 1, limit?: number): Promise<Anime[]> {
  try {
    const response = await fetchAPI<LatestAnimeResponse>(
      `/anime/recommended?page=${page}`,
      { revalidate: 300 }
    );
    const normalized = normalizeAnimeList(response || [], false);
    return limit ? normalized.slice(0, limit) : normalized;
  } catch (error) {
    console.error('Failed to fetch recommended anime:', error);
    return [];
  }
}

// Get anime series only (excludes movies)
export async function getAnimeSeriesOnly(page: number = 1, limit: number = MAX_ITEMS.ANIME_PER_PAGE): Promise<Anime[]> {
  const anime = await getLatestAnime(page);
  // Filter to only include items with episodes > 1
  const series = anime.filter(item => 
    item.totalEpisodes && item.totalEpisodes > 1
  );
  return series.slice(0, limit);
}

// Search anime by query
export async function searchAnime(query: string, limit: number = MAX_ITEMS.SEARCH_RESULTS): Promise<Anime[]> {
  if (!query.trim()) return [];
  
  try {
    const response = await fetchAPI<SearchResponse>(
      `/anime/search?query=${encodeURIComponent(query)}`,
      { revalidate: 300 }
    );
    
    // Search API returns: {data: [{jumlah, result: [...], pagination}]}
    // Extract result array from wrapped response
    let rawList: RawAnime[] = [];
    if (response && Array.isArray(response)) {
      rawList = response;
    } else if (response && typeof response === 'object') {
      // Handle wrapped response: {data: [{result: [...]}]}
      const data = (response as { data?: { result?: RawAnime[] }[] }).data;
      if (data && data[0] && Array.isArray(data[0].result)) {
        rawList = data[0].result;
      }
    }
    
    const normalized = normalizeAnimeList(rawList, false);
    // Sort: anime series first, then movies
    const sorted = normalized.sort((a, b) => {
      if (a.contentType === 'anime' && b.contentType === 'movie') return -1;
      if (a.contentType === 'movie' && b.contentType === 'anime') return 1;
      return 0;
    });
    return sorted.slice(0, limit);
  } catch (error) {
    console.warn('Search API failed, using fallback search...', error);
    
    // Fallback: Search in recommended data (fetch multiple pages and filter)
    try {
      const allResults: Anime[] = [];
      const queryLower = query.toLowerCase();
      
      // Fetch first 5 pages and search through them
      for (let page = 1; page <= 5; page++) {
        try {
          const response = await fetchAPI<LatestAnimeResponse>(
            `/anime/recommended?page=${page}`,
            { revalidate: 300 }
          );
          const normalized = normalizeAnimeList(response || [], false);
          const matches = normalized.filter(item => 
            item.title.toLowerCase().includes(queryLower)
          );
          allResults.push(...matches);
          
          // If we found enough results, stop
          if (allResults.length >= limit) break;
          
          // Small delay to avoid rate limiting
          await new Promise(r => setTimeout(r, 200));
        } catch (pageError) {
          console.warn(`Failed to fetch page ${page} for search fallback`);
        }
      }
      
      // De-duplicate and sort
      const unique = Array.from(new Map(allResults.map(item => [item.urlId, item])).values());
      const sorted = unique.sort((a, b) => {
        if (a.contentType === 'anime' && b.contentType === 'movie') return -1;
        if (a.contentType === 'movie' && b.contentType === 'anime') return 1;
        return 0;
      });
      return sorted.slice(0, limit);
    } catch (fallbackError) {
      console.error('Fallback search also failed:', fallbackError);
      return [];
    }
  }
}

// Get anime detail by urlId
export async function getAnimeDetail(urlId: string): Promise<AnimeDetail | null> {
  try {
    const response = await fetchAPI<DetailResponse>(
      `/anime/detail?urlId=${encodeURIComponent(urlId)}`,
      { revalidate: 30 }
    );
    
    if (response.data && response.data.length > 0) {
      return normalizeAnimeDetail(response.data[0]);
    }
    
    return null;
  } catch (error) {
    console.error('Failed to fetch anime detail:', error);
    return null;
  }
}

// Get all anime movies with pagination (using recommended endpoint and filtering)
export async function getMovies(page: number = 1, limit?: number): Promise<Anime[]> {
  try {
    // Use recommended endpoint since movie endpoint is blocked (403)
    const response = await fetchAPI<LatestAnimeResponse>(
      `/anime/recommended?page=${page}`,
      { revalidate: 60 }
    );
    
    const normalized = normalizeAnimeList(response || [], false);
    
    // Filter for movies (totalEpisodes === 1 or contentType === 'movie')
    const movies = normalized.filter(item => 
      item.totalEpisodes === 1 || item.contentType === 'movie'
    );
    
    return limit ? movies.slice(0, limit) : movies;
  } catch (error) {
    console.error('Failed to fetch movies:', error);
    return [];
  }
}

// Get video streaming URL
export async function getVideoUrl(
  chapterUrlId: string,
  resolution: Resolution = '480p'
): Promise<string | null> {
  try {
    const response = await fetchAPI<VideoResponse>(
      `/anime/getvideo?chapterUrlId=${encodeURIComponent(chapterUrlId)}&reso=${resolution}`,
      { revalidate: false }
    );
    
    if (response.error) {
      console.error('Video API error:', response.error);
      return null;
    }
    
    const videoData = response.data?.[0];
    if (!videoData?.stream || videoData.stream.length === 0) {
      console.error('No video streams available');
      return null;
    }
    
    const stream = videoData.stream.find(s => s.reso === resolution) || videoData.stream[0];
    return stream?.link || null;
  } catch (error) {
    console.error('Failed to get video URL:', error);
    return null;
  }
}

// Utility function to shuffle array (for recommendations)
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get trending anime (first items from latest)
export function getTrending(animeList: Anime[], count: number = MAX_ITEMS.TRENDING): Anime[] {
  return animeList.slice(0, count);
}

// Get recommendations (shuffled subset of anime series)
export function getRecommendations(animeList: Anime[], count: number = MAX_ITEMS.REKOMENDASI): Anime[] {
  const seriesOnly = animeList.filter(a => a.contentType === 'anime');
  return shuffleArray(seriesOnly).slice(0, count);
}
