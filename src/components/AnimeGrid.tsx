'use client';

import { motion } from 'framer-motion';
import { Anime } from '@/lib/types';
import { AnimeCardCompact } from './AnimeCard';
import { SearchX } from 'lucide-react';

interface AnimeGridProps {
  animeList: Anime[];
  emptyMessage?: string;
}

export function AnimeGrid({ animeList, emptyMessage = 'Tidak ada anime ditemukan' }: AnimeGridProps) {
  if (animeList.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20"
      >
        <SearchX className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium text-muted-foreground">{emptyMessage}</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Coba kata kunci lain atau jelajahi koleksi kami
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4"
    >
      {animeList.map((anime, index) => (
        <AnimeCardCompact key={`${anime.urlId}-${index}`} anime={anime} index={index} />
      ))}
    </motion.div>
  );
}
