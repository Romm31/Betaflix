'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Anime } from '@/lib/types';
import { AnimeCard } from './AnimeCard';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface RowCarouselProps {
  title: string;
  animeList: Anime[];
  className?: string;
}

export function RowCarousel({ title, animeList, className }: RowCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (animeList.length === 0) return null;

  return (
    <section className={cn('relative py-4 md:py-6', className)}>
      {/* Section Title */}
      <div className="container mx-auto px-4 mb-3 md:mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
          <span className="w-1 h-6 bg-primary rounded-full" />
          {title}
        </h2>
      </div>

      {/* Carousel Container */}
      <div className="relative group/carousel">
        {/* Left Arrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: canScrollLeft ? 1 : 0 }}
          className={cn(
            'absolute left-0 top-0 bottom-12 z-10 flex items-center',
            'hidden md:flex',
            !canScrollLeft && 'pointer-events-none'
          )}
        >
          <div className="h-full w-12 bg-gradient-to-r from-background to-transparent flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm border border-border shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-card"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </div>
        </motion.div>

        {/* Right Arrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: canScrollRight ? 1 : 0 }}
          className={cn(
            'absolute right-0 top-0 bottom-12 z-10 flex items-center justify-end',
            'hidden md:flex',
            !canScrollRight && 'pointer-events-none'
          )}
        >
          <div className="h-full w-12 bg-gradient-to-l from-background to-transparent flex items-center justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm border border-border shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-card"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </motion.div>

        {/* Scrollable Cards */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollButtons}
          className="flex gap-3 md:gap-4 overflow-x-auto hide-scrollbar scroll-smooth px-4 md:px-8"
          style={{
            scrollSnapType: 'x mandatory',
            paddingLeft: 'max(1rem, calc((100vw - 1280px) / 2 + 2rem))',
            paddingRight: 'max(1rem, calc((100vw - 1280px) / 2 + 2rem))',
          }}
        >
          {animeList.map((anime, index) => (
            <div key={`${anime.urlId}-${index}`} style={{ scrollSnapAlign: 'start' }}>
              <AnimeCard anime={anime} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
