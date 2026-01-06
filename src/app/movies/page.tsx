'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Film, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMovies } from '@/lib/api';
import { Anime, MAX_ITEMS } from '@/lib/types';
import { AnimeCardCompact } from '@/components/AnimeCard';
import { GridSkeleton } from '@/components/Skeletons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function MoviesPage() {
  const [allMovies, setAllMovies] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const itemsPerPage = MAX_ITEMS.MOVIES_PER_PAGE;

  const loadMovies = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Fetch pages sequentially to avoid 429/Rate Limit
      // We will loop from page 1 to 5
      const collected: Anime[] = [];
      
      for (let i = 1; i <= 5; i++) {
        try {
          // Add a small delay between requests (except the first one)
          if (i > 1) await new Promise(r => setTimeout(r, 300));
          
          const pageData = await getMovies(i);
          collected.push(...pageData);
        } catch (err) {
          console.warn(`Failed to loop-load page ${i}, stopping early.`, err);
          // If we hit an error (like rate limit), just stop trying to fetch more
          break; 
        }
      }
      
      // Filter unique items
      const uniqueMovies = Array.from(new Map(collected.map(item => [item.urlId, item])).values());
      setAllMovies(uniqueMovies);
    } catch (error) {
      console.error('Failed to load movies:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  // Filter by search
  const filteredMovies = useMemo(() => {
    if (!searchQuery.trim()) return allMovies;
    return allMovies.filter(movie => 
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allMovies, searchQuery]);

  // Paginate
  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
  const paginatedMovies = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMovies.slice(start, start + itemsPerPage);
  }, [filteredMovies, currentPage, itemsPerPage]);

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
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-[1000px] h-[600px] bg-accent/10 blur-[120px] rounded-full opacity-50" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[600px] bg-primary/5 blur-[100px] rounded-full opacity-30" />
      </div>

      <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center justify-center p-3 rounded-2xl bg-accent/10 mb-4 ring-1 ring-accent/20 shadow-[0_0_20px_rgba(var(--accent),0.3)]"
          >
            <Film className="w-8 h-8 md:w-10 md:h-10 text-accent drop-shadow-[0_0_10px_rgba(var(--accent),0.5)]" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black tracking-tight text-foreground"
          >
            Movie <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">Anime</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Nonton movie anime terbaik dengan kualitas HD tanpa batas.
            {!isLoading && allMovies.length > 0 && (
              <span className="inline-block px-2 py-0.5 ml-2 rounded-full bg-secondary text-secondary-foreground text-xs font-bold align-middle">
                {allMovies.length}+ Judul
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
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/50 to-primary/50 rounded-full opacity-30 group-hover:opacity-100 blur transition duration-500" />
            <div className="relative bg-background/80 backdrop-blur-xl rounded-full shadow-2xl">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
              <Input
                type="text"
                placeholder="Cari judul movie anime favoritmu..."
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
          ) : paginatedMovies.length === 0 ? (
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
                Maaf, kami tidak dapat menemukan movie dengan kata kunci "{searchQuery}"
              </p>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
            >
              <AnimatePresence mode='popLayout'>
                {paginatedMovies.map((movie, index) => (
                  <AnimeCardCompact 
                    key={movie.urlId} 
                    anime={movie} 
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
                  className="rounded-full w-10 h-10 hover:bg-accent/10 hover:text-accent"
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
                  className="rounded-full w-10 h-10 hover:bg-accent/10 hover:text-accent"
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
