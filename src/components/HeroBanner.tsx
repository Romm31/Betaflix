'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, Star, Film, Tv, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Anime } from '@/lib/types';
import { getImageUrl, truncateText } from '@/lib/utils';

interface HeroBannerProps {
  animeList: Anime[];
}

export function HeroBanner({ animeList }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % animeList.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [animeList.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % animeList.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + animeList.length) % animeList.length);
  };

  const currentAnime = animeList[currentIndex];
  const imageUrl = getImageUrl(currentAnime.poster);
  const description = currentAnime.synopsis 
    ? truncateText(currentAnime.synopsis, 200) 
    : 'Tonton anime seru ini sekarang di Betaflix!';

  return (
    <section className="relative w-full h-[80vh] md:h-[95vh] overflow-hidden group">
      <AnimatePresence initial={false} custom={currentIndex}>
        <motion.div
          key={currentIndex}
          custom={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = offset.x; // detected swipe direction
            if (swipe < -50) {
              nextSlide();
            } else if (swipe > 50) {
              prevSlide();
            }
          }}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={imageUrl}
              alt={currentAnime.title}
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
            {/* Gradient Overlays - Adaptive for light/dark modes */}
            {/* Dark mode: Standard gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent dark:from-background dark:via-background/80" />
            
            {/* Light mode: Extra gradient to ensure white text readability or dark text */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent dark:from-background dark:via-transparent" />
          </div>

          {/* Content - Positioned with safe zones */}
          <div className="absolute inset-0 flex items-end pb-20 md:pb-32 pt-32">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl">
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/20 text-white text-sm font-medium mb-4 backdrop-blur-md shadow-lg"
                >
                  {currentAnime.contentType === 'movie' ? (
                    <>
                      <Film className="w-4 h-4 fill-current" />
                      Movie
                    </>
                  ) : (
                    <>
                      <Tv className="w-4 h-4 fill-current" />
                      Anime Series
                    </>
                  )}
                </motion.div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl md:text-5xl lg:text-7xl font-bold text-white mb-4 leading-tight drop-shadow-xl"
                >
                  {currentAnime.title}
                </motion.h1>

                {/* Meta info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap items-center gap-4 text-sm text-gray-100 mb-6 font-medium drop-shadow-md"
                >
                  {currentAnime.score && (
                    <span className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      {currentAnime.score}
                    </span>
                  )}
                  {currentAnime.status && (
                    <span className="px-2 py-0.5 rounded bg-black/40 backdrop-blur-sm border border-white/10 shadow-sm">{currentAnime.status}</span>
                  )}
                  {currentAnime.releaseDate && (
                    <span>{currentAnime.releaseDate}</span>
                  )}
                </motion.div>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="hidden md:block text-gray-100 text-lg mb-8 line-clamp-3 max-w-xl drop-shadow-md font-medium"
                >
                  {description}
                </motion.p>

                {/* Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap gap-4"
                >
                  <Link href={`/anime/${currentAnime.urlId}`}>
                    <Button 
                      size="lg" 
                      className="bg-primary hover:bg-primary/90 text-white font-semibold gap-2 px-8 h-12 text-base shadow-lg shadow-black/20 border-0"
                    >
                      <Play className="w-5 h-5 fill-current" />
                      Tonton Sekarang
                    </Button>
                  </Link>
                  <Link href={`/anime/${currentAnime.urlId}`}>
                    <Button 
                      size="lg" 
                      variant="secondary"
                      className="gap-2 px-8 h-12 text-base bg-black/40 hover:bg-black/60 border border-white/20 backdrop-blur-md text-white shadow-lg"
                    >
                      <Info className="w-5 h-5" />
                      Detail
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>



      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {animeList.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'w-6 bg-primary' : 'bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
