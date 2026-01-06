import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Fallback image for missing posters
export const FALLBACK_POSTER = '/poster-fallback.svg';

// Get valid image URL or fallback
export function getImageUrl(url?: string | null): string {
  if (!url || url.trim() === '') return FALLBACK_POSTER;
  return url;
}

// Format episode number
export function formatEpisode(episode?: string): string {
  if (!episode) return '';
  return `Episode ${episode}`;
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}
