// API Response Types for Betaflix

export interface Anime {
  title: string;
  urlId: string;
  poster?: string;
  thumbnail?: string;
  status?: string;
  type?: string;
  score?: string;
  episodes?: string;
  synopsis?: string;
  genres?: string[];
  latestEpisode?: string;
  releaseDate?: string;
}

export interface AnimeDetail {
  title: string;
  urlId: string;
  poster?: string;
  thumbnail?: string;
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

export interface LatestAnimeResponse {
  status: boolean;
  data: Anime[];
  pagination?: {
    currentPage: number;
    totalPages: number;
  };
}

export interface MovieResponse {
  status: boolean;
  data: Anime[];
}

export interface SearchResponse {
  status: boolean;
  data: Anime[];
}

export interface DetailResponse {
  status: boolean;
  data: AnimeDetail;
}

export interface VideoResponse {
  status: boolean;
  data: {
    url?: string;
    sources?: VideoSource[];
  };
}

export type Resolution = '360p' | '480p' | '720p' | '1080p';
