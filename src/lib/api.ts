import {
  LatestAnimeResponse,
  MovieResponse,
  SearchResponse,
  DetailResponse,
  VideoResponse,
  Resolution,
  Anime,
  AnimeDetail,
} from './types';

const BASE_URL = 'https://api.sansekai.my.id';

// Generic fetch wrapper with error handling
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit & { revalidate?: number | false }
): Promise<T> {
  const { revalidate = 60, ...fetchOptions } = options || {};
  
  const url = `${BASE_URL}${endpoint}`;
  
  try {
    const res = await fetch(url, {
      ...fetchOptions,
      next: revalidate === false ? { revalidate: 0 } : { revalidate },
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
export async function getLatestAnime(page: number = 1): Promise<Anime[]> {
  const response = await fetchAPI<LatestAnimeResponse>(
    `/anime/latest?page=${page}`,
    { revalidate: 60 }
  );
  return response.data || [];
}

// Search anime by query
export async function searchAnime(query: string): Promise<Anime[]> {
  if (!query.trim()) return [];
  
  const response = await fetchAPI<SearchResponse>(
    `/anime/search?query=${encodeURIComponent(query)}`,
    { revalidate: 300 }
  );
  return response.data || [];
}

// Get anime detail by urlId
export async function getAnimeDetail(urlId: string): Promise<AnimeDetail | null> {
  try {
    const response = await fetchAPI<DetailResponse>(
      `/anime/detail?urlId=${encodeURIComponent(urlId)}`,
      { revalidate: 30 }
    );
    return response.data || null;
  } catch {
    return null;
  }
}

// Get all anime movies
export async function getMovies(): Promise<Anime[]> {
  const response = await fetchAPI<MovieResponse>(
    '/anime/movie',
    { revalidate: 60 }
  );
  return response.data || [];
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
    
    // Handle both direct URL and sources array
    if (response.data?.url) {
      return response.data.url;
    }
    
    if (response.data?.sources && response.data.sources.length > 0) {
      const source = response.data.sources.find(s => s.resolution === resolution);
      return source?.url || response.data.sources[0].url;
    }
    
    return null;
  } catch {
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

// Get pseudo-trending (first items from latest)
export function getTrending(animeList: Anime[], count: number = 10): Anime[] {
  return animeList.slice(0, count);
}

// Get recommendations (shuffled subset)
export function getRecommendations(animeList: Anime[], count: number = 10): Anime[] {
  return shuffleArray(animeList).slice(0, count);
}
