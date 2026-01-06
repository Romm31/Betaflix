'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Info, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Anime } from '@/lib/types';
import { getImageUrl, truncateText } from '@/lib/utils';

interface HeroBannerProps {
  anime: Anime;
}

export function HeroBanner({ anime }: HeroBannerProps) {
  const imageUrl = getImageUrl(anime.poster);
  const description = anime.synopsis 
    ? truncateText(anime.synopsis, 200) 
    : 'Tonton anime seru ini sekarang di Betaflix!';

  return (
    <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={imageUrl}
          alt={anime.title}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-end pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-2xl"
          >
            {/* Badge */}
            {anime.type && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/50 text-primary text-sm font-medium mb-4"
              >
                <Star className="w-4 h-4 fill-primary" />
                {anime.type}
              </motion.div>
            )}

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight"
            >
              {anime.title}
            </motion.h1>

            {/* Meta info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4"
            >
              {anime.score && (
                <span className="flex items-center gap-1 text-accent font-medium">
                  <Star className="w-4 h-4 fill-accent" />
                  {anime.score}
                </span>
              )}
              {anime.status && (
                <span className="px-2 py-0.5 rounded bg-muted">{anime.status}</span>
              )}
              {anime.episodes && (
                <span>{anime.episodes} Episode</span>
              )}
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-muted-foreground text-base md:text-lg mb-6 line-clamp-3"
            >
              {description}
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-3"
            >
              <Link href={`/anime/${anime.urlId}`}>
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2 px-6"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Tonton Sekarang
                </Button>
              </Link>
              <Link href={`/anime/${anime.urlId}`}>
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="gap-2 px-6"
                >
                  <Info className="w-5 h-5" />
                  Selengkapnya
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
