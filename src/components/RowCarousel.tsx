'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Tv, Film } from 'lucide-react';
import { Anime } from '@/lib/types';
import { AnimeCard } from './AnimeCard';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface RowCarouselProps {
  title: string;
  animeList: Anime[];
  className?: string;
  seeAllLink?: string;
  variant?: 'anime' | 'movie';
}

export function RowCarousel({ 
  title, 
  animeList, 
  className,
  seeAllLink,
  variant = 'anime'
}: RowCarouselProps) {
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
      const scrollAmount = container.clientWidth * 0.75;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (animeList.length === 0) return null;

  const Icon = variant === 'movie' ? Film : Tv;

  return (
    <section className={cn('relative py-3 md:py-4', className)}>
      {/* Section Title */}
      <div className="container mx-auto px-4 mb-3 flex items-center justify-between">
        <h2 className="text-lg md:text-xl font-bold text-foreground flex items-center gap-2">
          <span className="w-1 h-5 bg-primary rounded-full" />
          <Icon className="w-4 h-4 text-primary" />
          {title}
        </h2>
        {seeAllLink && (
          <Link href={seeAllLink}>
            <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground hover:text-primary h-8 px-2">
              See All
              <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        )}
      </div>

      {/* Carousel Container */}
      <div className="relative group/carousel">
        {/* Left Arrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: canScrollLeft ? 1 : 0 }}
          className={cn(
            'absolute left-0 top-0 bottom-10 z-10 flex items-center',
            'hidden md:flex',
            !canScrollLeft && 'pointer-events-none'
          )}
        >
          <div className="h-full w-10 bg-gradient-to-r from-background to-transparent flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scroll('left')}
              className="w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm border border-border shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-card"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>

        {/* Right Arrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: canScrollRight ? 1 : 0 }}
          className={cn(
            'absolute right-0 top-0 bottom-10 z-10 flex items-center justify-end',
            'hidden md:flex',
            !canScrollRight && 'pointer-events-none'
          )}
        >
          <div className="h-full w-10 bg-gradient-to-l from-background to-transparent flex items-center justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scroll('right')}
              className="w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm border border-border shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-card"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>

        {/* Scrollable Cards */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollButtons}
          className="flex gap-3 overflow-x-auto hide-scrollbar scroll-smooth px-4"
        >
          {animeList.map((anime, index) => (
            <div key={`${anime.urlId}-${index}`} className="flex-shrink-0">
              <AnimeCard anime={anime} index={index} variant={variant} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
