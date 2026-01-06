import {
  LatestAnimeResponse,
  MovieResponse,
  SearchResponse,
  DetailResponse,
  VideoResponse,
  Resolution,
  Anime,
  AnimeDetail,
  normalizeAnimeList,
  normalizeAnimeDetail,
} from './types';

const BASE_URL = 'https://api.sansekai.my.id/api';

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
  try {
    const response = await fetchAPI<LatestAnimeResponse>(
      `/anime/latest?page=${page}`,
      { revalidate: 60 }
    );
    return normalizeAnimeList(response || []);
  } catch (error) {
    console.error('Failed to fetch latest anime:', error);
    return [];
  }
}

// Search anime by query
export async function searchAnime(query: string): Promise<Anime[]> {
  if (!query.trim()) return [];
  
  try {
    const response = await fetchAPI<SearchResponse>(
      `/anime/search?query=${encodeURIComponent(query)}`,
      { revalidate: 300 }
    );
    return normalizeAnimeList(response || []);
  } catch (error) {
    console.error('Failed to search anime:', error);
    return [];
  }
}

// Get anime detail by urlId
export async function getAnimeDetail(urlId: string): Promise<AnimeDetail | null> {
  try {
    const response = await fetchAPI<DetailResponse>(
      `/anime/detail?urlId=${encodeURIComponent(urlId)}`,
      { revalidate: 30 }
    );
    
    // API returns { data: [...] } where data is an array
    if (response.data && response.data.length > 0) {
      return normalizeAnimeDetail(response.data[0]);
    }
    
    return null;
  } catch (error) {
    console.error('Failed to fetch anime detail:', error);
    return null;
  }
}

// Get all anime movies
export async function getMovies(): Promise<Anime[]> {
  try {
    const response = await fetchAPI<MovieResponse>(
      '/anime/movie',
      { revalidate: 60 }
    );
    return normalizeAnimeList(response || []);
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
    
    // Check for error response
    if (response.error) {
      console.error('Video API error:', response.error);
      return null;
    }
    
    // API returns { data: [{ stream: [{ reso, link }] }] }
    const videoData = response.data?.[0];
    if (!videoData?.stream || videoData.stream.length === 0) {
      console.error('No video streams available');
      return null;
    }
    
    // Find stream matching requested resolution, or fall back to first available
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

// Get pseudo-trending (first items from latest)
export function getTrending(animeList: Anime[], count: number = 10): Anime[] {
  return animeList.slice(0, count);
}

// Get recommendations (shuffled subset)
export function getRecommendations(animeList: Anime[], count: number = 10): Anime[] {
  return shuffleArray(animeList).slice(0, count);
}
