'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Star, Calendar, Clock, Film, Share2, Info } from 'lucide-react';
import { AnimeDetail as AnimeDetailType } from '@/lib/types';
import { getImageUrl } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EpisodeAccordion } from '@/components/EpisodeAccordion';

interface AnimeDetailProps {
  anime: AnimeDetailType;
}

export function AnimeDetail({ anime }: AnimeDetailProps) {
  const imageUrl = getImageUrl(anime.poster);
  const firstChapter = anime.chapter?.[0];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Immersive Hero Background */}
      <div className="absolute inset-0 h-[70vh] w-full z-0">
        <Image
          src={imageUrl}
          alt={anime.title}
          fill
          priority
          className="object-cover opacity-30 blur-xl scale-110"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />
      </div>

      <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          {/* Left Column: Poster & Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-shrink-0 mx-auto lg:mx-0 max-w-[280px] w-full"
          >
            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10 group mb-6">
              <Image
                src={imageUrl}
                alt={anime.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 280px, 300px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            <div className="space-y-3">
              {firstChapter ? (
                <Link href={`/watch/${firstChapter.chapterUrlId}`} className="block">
                  <Button size="lg" className="w-full h-12 text-base font-bold shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-all">
                    <Play className="w-5 h-5 mr-2 fill-current" />
                    Tonton Episode 1
                  </Button>
                </Link>
              ) : (
                <Button size="lg" disabled className="w-full h-12">
                  Belum Tersedia
                </Button>
              )}
              {/* Optional: Add trailer or shared buttons here if available */}
            </div>
          </motion.div>

          {/* Right Column: Info & Content */}
          <div className="flex-1 space-y-8">
            {/* Header Info */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center lg:text-left"
            >
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-4">
                {anime.type && (
                  <Badge variant="outline" className="bg-background/50 backdrop-blur-sm border-primary/20 text-primary px-3 py-1">
                    {anime.type}
                  </Badge>
                )}
                {anime.status && (
                  <Badge variant="secondary" className="px-3 py-1">
                    {anime.status}
                  </Badge>
                )}
                {anime.score && (
                  <div className="flex items-center gap-1.5 text-accent font-bold bg-accent/10 px-3 py-1 rounded-full text-sm">
                    <Star className="w-4 h-4 fill-accent" />
                    {anime.score}
                  </div>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-tight mb-4 drop-shadow-2xl">
                {anime.title}
              </h1>

              {/* Meta Grid */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-3 text-sm md:text-base text-muted-foreground mb-8 bg-background/30 backdrop-blur-md p-4 rounded-xl border border-white/5 inline-flex">
                {anime.releaseDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{anime.releaseDate}</span>
                  </div>
                )}
                {anime.duration && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{anime.duration}</span>
                  </div>
                )}
                {anime.episodes && (
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-primary" />
                    <span>{anime.episodes} Episode</span>
                  </div>
                )}
              </div>

              {/* Genres */}
              {anime.genres && (
                <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-8">
                  {anime.genres.map((genre) => (
                    <Link key={genre} href={`/search?q=${genre}`}>
                      <Badge variant="outline" className="hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors cursor-pointer text-sm px-4 py-1.5">
                        {genre}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}

              {/* Synopsis */}
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  Sinopsis
                </h3>
                <p className="text-muted-foreground leading-relaxed text-justify">
                  {anime.synopsis || "Tidak ada sinopsis."}
                </p>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-secondary/20 rounded-xl mb-10">
                {anime.studio && (
                  <div>
                    <span className="block text-xs text-muted-foreground uppercase tracking-wider mb-1">Studio</span>
                    <span className="font-medium">{anime.studio}</span>
                  </div>
                )}
                {anime.season && (
                  <div>
                    <span className="block text-xs text-muted-foreground uppercase tracking-wider mb-1">Season</span>
                    <span className="font-medium">{anime.season}</span>
                  </div>
                )}
                {/* Add more fields if available in types */}
              </div>
            </motion.div>

            {/* Episode List Section */}
            {anime.chapter && anime.chapter.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-gradient-to-b from-primary to-accent rounded-full" />
                    Daftar Episode
                    <Badge variant="secondary" className="ml-2">
                      {anime.chapter.length}
                    </Badge>
                  </h2>
                </div>
                
                <EpisodeAccordion chapters={anime.chapter} />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
