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
    
    if (response.data && response.data.length > 0) {
      return normalizeAnimeDetail(response.data[0]);
    }
    
    return null;
  } catch (error) {
    console.error('Failed to fetch anime detail:', error);
    return null;
  }
}

// Get all anime movies with pagination
export async function getMovies(page: number = 1, limit?: number): Promise<Anime[]> {
  try {
    const response = await fetchAPI<MovieResponse>(
      `/anime/movie?page=${page}`,
      { revalidate: 60 }
    );
    // Pass true to mark these as from movie endpoint
    const normalized = normalizeAnimeList(response || [], true);
    return limit ? normalized.slice(0, limit) : normalized;
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
