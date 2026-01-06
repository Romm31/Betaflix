// API Response Types for Betaflix
// Based on actual API response from https://api.sansekai.my.id/api

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
  author?: string; // studio
  genre?: string[];
  sinopsis?: string;
  chapter?: RawChapter[];
}

// Raw chapter from detail API
export interface RawChapter {
  id: number;
  ch: string; // episode number or "Movie"
  url: string; // chapterUrlId
  date?: string;
}

// Normalized anime item (used in components)
export interface Anime {
  id: string;
  urlId: string;
  title: string;
  poster: string;
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

// Detail endpoint returns { data: RawAnimeDetail[] }
export interface DetailResponse {
  data: RawAnimeDetail[];
}

// Video API response - structure: { data: [{ stream: [{ reso, link }] }] }
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

// Normalize raw chapter to our Chapter type
export function normalizeChapter(raw: RawChapter): Chapter {
  return {
    title: raw.ch === 'Movie' ? 'Movie' : `Episode ${raw.ch}`,
    chapterUrlId: raw.url,
    date: raw.date,
    episodeNumber: raw.ch,
  };
}

// Normalize raw detail to our AnimeDetail type
export function normalizeAnimeDetail(raw: RawAnimeDetail): AnimeDetail {
  return {
    id: String(raw.id),
    urlId: raw.series_id,
    title: raw.judul,
    poster: raw.cover,
    status: raw.status,
    type: raw.type,
    score: raw.rating,
    synopsis: raw.sinopsis,
    genres: raw.genre,
    releaseDate: raw.published,
    studio: raw.author, // API returns "author" but it's actually studio
    chapter: raw.chapter?.map(normalizeChapter),
  };
}
