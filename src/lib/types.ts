// API Response Types for Betaflix
// Based on actual API response from https://api.sansekai.my.id/api

// Raw API anime item (as returned by the API)
export interface RawAnime {
  id: string;
  url: string;
  judul: string;
  cover: string;
  lastch?: string;
  lastup?: string;
  genre?: string[];
  sinopsis?: string;
  studio?: string;
  score?: string;
  status?: string;
  rilis?: string;
  total_episode?: number;
}

// Normalized anime item (used in components)
export interface Anime {
  id: string;
  urlId: string;
  title: string;
  poster: string;
  latestChapter?: string;
  lastUpdate?: string;
  genres?: string[];
  synopsis?: string;
  studio?: string;
  score?: string;
  status?: string;
  releaseDate?: string;
  totalEpisodes?: number;
}

export interface AnimeDetail {
  id: string;
  urlId: string;
  title: string;
  poster: string;
  status?: string;
  type?: string;
  score?: string;
  episodes?: string;
  synopsis?: string;
  genres?: string[];
  releaseDate?: string;
  studio?: string;
  duration?: string;
  season?: string;
  chapter?: Chapter[];
}

export interface Chapter {
  title: string;
  chapterUrlId: string;
  date?: string;
  episodeNumber?: string;
}

export interface VideoSource {
  url: string;
  resolution: string;
  type?: string;
}

// The API returns arrays directly, not wrapped in {status, data}
export type LatestAnimeResponse = RawAnime[];
export type MovieResponse = RawAnime[];
export type SearchResponse = RawAnime[];

// For detail endpoint - need to verify structure
export interface DetailResponse {
  status?: boolean;
  data?: AnimeDetail;
  // Or it might be the detail directly
  [key: string]: unknown;
}

export interface VideoResponse {
  status: boolean;
  data: {
    url?: string;
    sources?: VideoSource[];
  };
}

export type Resolution = '360p' | '480p' | '720p' | '1080p';

// Helper function to normalize raw API response to our Anime type
export function normalizeAnime(raw: RawAnime): Anime {
  return {
    id: raw.id,
    urlId: raw.url,
    title: raw.judul,
    poster: raw.cover,
    latestChapter: raw.lastch,
    lastUpdate: raw.lastup,
    genres: raw.genre,
    synopsis: raw.sinopsis,
    studio: raw.studio,
    score: raw.score,
    status: raw.status,
    releaseDate: raw.rilis,
    totalEpisodes: raw.total_episode,
  };
}

export function normalizeAnimeList(rawList: RawAnime[]): Anime[] {
  return rawList.map(normalizeAnime);
}
