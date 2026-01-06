'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Plus, Info } from 'lucide-react';
import { Anime } from '@/lib/types';
import { getImageUrl, cn } from '@/lib/utils';

interface AnimeCardProps {
  anime: Anime;
  index?: number;
}

export function AnimeCard({ anime, index = 0 }: AnimeCardProps) {
  const imageUrl = getImageUrl(anime.poster || anime.thumbnail);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative flex-shrink-0 w-[140px] md:w-[180px] lg:w-[200px]"
    >
      <Link href={`/anime/${anime.urlId}`}>
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-muted card-hover">
          <Image
            src={imageUrl}
            alt={anime.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 140px, (max-width: 1024px) 180px, 200px"
          />
          
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Quick actions on hover */}
          <div className="absolute inset-0 flex flex-col items-center justify-end p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <div className="flex items-center gap-2 mb-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg"
              >
                <Play className="w-5 h-5 text-primary-foreground fill-current ml-0.5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 rounded-full bg-muted/80 backdrop-blur-sm flex items-center justify-center border border-border"
              >
                <Plus className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 rounded-full bg-muted/80 backdrop-blur-sm flex items-center justify-center border border-border"
              >
                <Info className="w-4 h-4" />
              </motion.button>
            </div>
            
            {/* Title on hover */}
            <p className="text-white text-xs font-medium text-center line-clamp-2 px-1">
              {anime.title}
            </p>
          </div>

          {/* Episode badge */}
          {anime.latestEpisode && (
            <div className="absolute top-2 left-2">
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary text-primary-foreground">
                Ep {anime.latestEpisode}
              </span>
            </div>
          )}

          {/* Type badge */}
          {anime.type && (
            <div className="absolute top-2 right-2">
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-accent/90 text-accent-foreground">
                {anime.type}
              </span>
            </div>
          )}
        </div>
      </Link>
      
      {/* Title below card */}
      <div className="mt-2 px-1">
        <h3 className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {anime.title}
        </h3>
        {anime.score && (
          <p className="text-xs text-muted-foreground mt-0.5">
            ⭐ {anime.score}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// Compact card variant for grids
export function AnimeCardCompact({ anime, index = 0 }: AnimeCardProps) {
  const imageUrl = getImageUrl(anime.poster || anime.thumbnail);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="group"
    >
      <Link href={`/anime/${anime.urlId}`}>
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-muted card-hover">
          <Image
            src={imageUrl}
            alt={anime.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 22vw, 16vw"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Play className="w-5 h-5 text-primary-foreground fill-current ml-0.5" />
              </div>
            </div>
          </div>

          {anime.type && (
            <div className="absolute top-2 right-2">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-accent/90 text-accent-foreground">
                {anime.type}
              </span>
            </div>
          )}
        </div>
        
        <h3 className="mt-2 text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {anime.title}
        </h3>
      </Link>
    </motion.div>
  );
}
