'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Tv, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLatestAnime } from '@/lib/api';
import { Anime, MAX_ITEMS } from '@/lib/types';
import { AnimeCardCompact } from '@/components/AnimeCard';
import { GridSkeleton } from '@/components/Skeletons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AnimePage() {
  const [allAnime, setAllAnime] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const itemsPerPage = MAX_ITEMS.ANIME_PER_PAGE;

  const loadAnime = useCallback(async () => {
    try {
      setIsLoading(true);
      // Load multiple pages to have enough for pagination
      const [page1, page2] = await Promise.all([
        getLatestAnime(1),
        getLatestAnime(2),
      ]);
      const combined = [...page1, ...page2];
      // Filter to anime series only
      const series = combined.filter(item => 
        item.totalEpisodes && item.totalEpisodes > 1
      );
      setAllAnime(series);
    } catch (error) {
      console.error('Failed to load anime:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnime();
  }, [loadAnime]);

  // Filter by search
  const filteredAnime = useMemo(() => {
    if (!searchQuery.trim()) return allAnime;
    return allAnime.filter(anime => 
      anime.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allAnime, searchQuery]);

  // Paginate
  const totalPages = Math.ceil(filteredAnime.length / itemsPerPage);
  const paginatedAnime = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAnime.slice(start, start + itemsPerPage);
  }, [filteredAnime, currentPage, itemsPerPage]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 blur-[120px] rounded-full opacity-50" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-accent/5 blur-[100px] rounded-full opacity-30" />
      </div>

      <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 mb-4 ring-1 ring-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.3)]"
          >
            <Tv className="w-8 h-8 md:w-10 md:h-10 text-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black tracking-tight text-foreground"
          >
            Anime <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Series</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Jelajahi koleksi anime series terlengkap dengan kualitas terbaik.
            {!isLoading && allAnime.length > 0 && (
              <span className="inline-block px-2 py-0.5 ml-2 rounded-full bg-secondary text-secondary-foreground text-xs font-bold align-middle">
                {allAnime.length}+ Judul
              </span>
            )}
          </motion.p>
        </div>

        {/* Search Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative max-w-2xl mx-auto mb-16"
        >
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-accent/50 rounded-full opacity-30 group-hover:opacity-100 blur transition duration-500" />
            <div className="relative bg-background/80 backdrop-blur-xl rounded-full shadow-2xl">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="text"
                placeholder="Cari judul anime series favoritmu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 h-14 text-lg bg-transparent border-0 rounded-full focus-visible:ring-0 placeholder:text-muted-foreground/50"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 hover:bg-muted p-1 rounded-full transition-colors"
                >
                  <span className="sr-only">Clear</span>
                  <div className="w-5 h-5 flex items-center justify-center text-muted-foreground">✕</div>
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="space-y-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="aspect-[2/3] rounded-xl bg-muted/50 animate-pulse" />
                    <div className="h-4 bg-muted/50 rounded animate-pulse w-3/4" />
                  </div>
                ))}
              </div>
            </div>
          ) : paginatedAnime.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-muted-foreground/20"
            >
              <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Tidak ditemukan</h3>
              <p className="text-muted-foreground">
                Maaf, kami tidak dapat menemukan anime dengan kata kunci "{searchQuery}"
              </p>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
            >
              <AnimatePresence mode='popLayout'>
                {paginatedAnime.map((anime, index) => (
                  <AnimeCardCompact 
                    key={anime.urlId} 
                    anime={anime} 
                    index={index} 
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-16 flex flex-col items-center gap-4"
            >
              <div className="inline-flex items-center gap-2 p-2 bg-background/50 backdrop-blur-sm border border-border/50 rounded-full shadow-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="rounded-full w-10 h-10 hover:bg-primary/10 hover:text-primary"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                
                <div className="px-4 font-medium text-sm text-muted-foreground">
                  <span className="text-foreground font-bold">{currentPage}</span>
                  <span className="mx-2">/</span>
                  {totalPages}
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-full w-10 h-10 hover:bg-primary/10 hover:text-primary"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
