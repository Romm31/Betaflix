'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Plus, Info, Tv, Film, Star } from 'lucide-react';
import { Anime } from '@/lib/types';
import { getImageUrl, cn } from '@/lib/utils';

interface AnimeCardProps {
  anime: Anime;
  index?: number;
  variant?: 'default' | 'anime' | 'movie';
}

export function AnimeCard({ anime, index = 0, variant = 'default' }: AnimeCardProps) {
  const imageUrl = getImageUrl(anime.poster);
  const isMovie = anime.contentType === 'movie' || variant === 'movie';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative flex-shrink-0 w-[150px] md:w-[170px] lg:w-[185px]"
    >
      <Link href={`/anime/${anime.urlId}`}>
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-muted card-hover">
          <Image
            src={imageUrl}
            alt={anime.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 150px, (max-width: 1024px) 170px, 185px"
          />
          
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out" />
          
          {/* Quick actions on hover - Animated entry */}
          <div className="absolute inset-0 flex flex-col items-center justify-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100">
            <div className="flex items-center gap-3 mb-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/40 border border-white/10"
              >
                <Play className="w-5 h-5 text-white fill-current ml-0.5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-white/20"
              >
                <Info className="w-5 h-5 text-white" />
              </motion.button>
            </div>
          </div>

          {/* Content type badge - top left */}
          <div className="absolute top-2 left-2">
            <span className={cn(
              "flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium",
              isMovie 
                ? "bg-accent text-accent-foreground" 
                : "bg-primary text-primary-foreground"
            )}>
              {isMovie ? <Film className="w-2.5 h-2.5" /> : <Tv className="w-2.5 h-2.5" />}
            </span>
          </div>

          {/* Episode count badge - top right (only for anime series) */}
          {!isMovie && anime.totalEpisodes && anime.totalEpisodes > 1 && (
            <div className="absolute top-2 right-2">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-black/70 text-white">
                {anime.totalEpisodes} EP
              </span>
            </div>
          )}
        </div>
      </Link>
      
      {/* Title below card */}
      <div className="mt-2">
        <h3 className="text-xs font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {anime.title}
        </h3>
        {anime.score && (
          <p className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
            <Star className="w-2.5 h-2.5 fill-accent text-accent" />
            {anime.score}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// Compact card variant for grids
export function AnimeCardCompact({ anime, index = 0 }: AnimeCardProps) {
  const imageUrl = getImageUrl(anime.poster);
  const isMovie = anime.contentType === 'movie';

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

          {/* Content type badge */}
          <div className="absolute top-2 left-2">
            <span className={cn(
              "flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium",
              isMovie 
                ? "bg-accent text-accent-foreground" 
                : "bg-primary text-primary-foreground"
            )}>
              {isMovie ? <Film className="w-2.5 h-2.5" /> : <Tv className="w-2.5 h-2.5" />}
            </span>
          </div>

          {/* Episode count - for series only */}
          {!isMovie && anime.totalEpisodes && anime.totalEpisodes > 1 && (
            <div className="absolute top-2 right-2">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-black/70 text-white">
                {anime.totalEpisodes} EP
              </span>
            </div>
          )}
        </div>
        
        <h3 className="mt-2 text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {anime.title}
        </h3>
        {anime.score && (
          <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
            <Star className="w-3 h-3 fill-accent text-accent" />
            {anime.score}
          </p>
        )}
      </Link>
    </motion.div>
  );
}
