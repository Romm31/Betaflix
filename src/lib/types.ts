// API Response Types for Betaflix
// Based on actual API response from https://api.sansekai.my.id/api

// Content type for distinguishing anime series vs movies
export type ContentType = 'anime' | 'movie';

// Max items constants
export const MAX_ITEMS = {
  // Homepage rows (ringkas)
  ANIME_TERBARU: 10,
  TRENDING: 8,
  MOVIES_HOME: 8,
  REKOMENDASI: 8,
  HERO_CAROUSEL: 5,
  // Category pages (pagination)
  ANIME_PER_PAGE: 24,
  MOVIES_PER_PAGE: 20,
  SEARCH_RESULTS: 20,
} as const;

// Raw API anime item (as returned by the API for lists)
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

// Raw API detail item (as returned by detail endpoint)
export interface RawAnimeDetail {
  id: number;
  series_id: string;
  cover: string;
  judul: string;
  type?: string;
  status?: string;
  rating?: string;
  published?: string;
  author?: string;
  genre?: string[];
  sinopsis?: string;
  chapter?: RawChapter[];
}

// Raw chapter from detail API
export interface RawChapter {
  id: number;
  ch: string;
  url: string;
  date?: string;
}

// Normalized anime item (used in components)
export interface Anime {
  id: string;
  urlId: string;
  title: string;
  poster: string;
  contentType: ContentType;
  latestChapter?: string;
  latestEpisode?: string;
  lastUpdate?: string;
  genres?: string[];
  synopsis?: string;
  studio?: string;
  score?: string;
  status?: string;
  releaseDate?: string;
  totalEpisodes?: number;
  type?: string;
  episodes?: number;
}

// Normalized anime detail (used in detail page)
export interface AnimeDetail {
  id: string;
  urlId: string;
  title: string;
  poster: string;
  contentType: ContentType;
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

// Normalized chapter
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

// API response types
export type LatestAnimeResponse = RawAnime[];
export type MovieResponse = RawAnime[];
export type SearchResponse = RawAnime[];

export interface DetailResponse {
  data: RawAnimeDetail[];
}

export interface VideoStream {
  reso: string;
  link: string;
  provide?: number;
  id?: number;
}

export interface VideoData {
  episode_id?: number;
  reso?: string[];
  stream?: VideoStream[];
}

export interface VideoResponse {
  data: VideoData[];
  error?: string;
}

export type Resolution = '360p' | '480p' | '720p' | '1080p';

// Detect content type based on data (movie = no episodes or type is Movie)
function detectContentType(raw: RawAnime, isFromMovieEndpoint: boolean = false): ContentType {
  if (isFromMovieEndpoint) return 'movie';
  // If total_episode is 1 or undefined and it looks like a movie
  if (raw.total_episode === 1 || raw.total_episode === undefined) {
    return 'movie';
  }
  return 'anime';
}

// Normalize raw API response to Anime type
export function normalizeAnime(raw: RawAnime, isFromMovieEndpoint: boolean = false): Anime {
  return {
    id: raw.id,
    urlId: raw.url,
    title: raw.judul,
    poster: raw.cover,
    contentType: detectContentType(raw, isFromMovieEndpoint),
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

export function normalizeAnimeList(rawList: RawAnime[], isFromMovieEndpoint: boolean = false): Anime[] {
  return rawList.map(raw => normalizeAnime(raw, isFromMovieEndpoint));
}

// Filter helpers
export function filterAnimeOnly(list: Anime[]): Anime[] {
  return list.filter(item => item.contentType === 'anime');
}

export function filterMoviesOnly(list: Anime[]): Anime[] {
  return list.filter(item => item.contentType === 'movie');
}

// Normalize raw chapter to Chapter type
export function normalizeChapter(raw: RawChapter): Chapter {
  return {
    title: raw.ch === 'Movie' ? 'Movie' : `Episode ${raw.ch}`,
    chapterUrlId: raw.url,
    date: raw.date,
    episodeNumber: raw.ch,
  };
}

// Detect content type for detail based on type field or chapter count
function detectDetailContentType(raw: RawAnimeDetail): ContentType {
  if (raw.type?.toLowerCase() === 'movie') return 'movie';
  if (raw.chapter && raw.chapter.length === 1 && raw.chapter[0].ch === 'Movie') return 'movie';
  return 'anime';
}

// Normalize raw detail to AnimeDetail type
export function normalizeAnimeDetail(raw: RawAnimeDetail): AnimeDetail {
  return {
    id: String(raw.id),
    urlId: raw.series_id,
    title: raw.judul,
    poster: raw.cover,
    contentType: detectDetailContentType(raw),
    status: raw.status,
    type: raw.type,
    score: raw.rating,
    synopsis: raw.sinopsis,
    genres: raw.genre,
    releaseDate: raw.published,
    studio: raw.author,
    chapter: raw.chapter?.map(normalizeChapter),
  };
}
