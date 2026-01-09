'use client';

import { useState, useEffect, useCallback } from 'react';
import { Film, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMovies } from '@/lib/api';
import { Anime } from '@/lib/types';
import { AnimeCardCompact } from '@/components/AnimeCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Maximum UI pages (each UI page = 10 API pages combined)
const MAX_API_PAGES = 15;

export default function MoviesPage() {
  const [movieList, setMovieList] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filteredMovies, setFilteredMovies] = useState<Anime[]>([]);

  // Load movies - fetch multiple API pages and combine (since movies are filtered from mixed content)
  const loadMovies = useCallback(async (uiPage: number) => {
    setIsLoading(true);
    
    // Since movies are filtered from recommended (mixed content), we need to fetch multiple API pages
    // to get enough movies for one UI page
    // Each UI page = 10 API pages combined
    const apiPagesPerUiPage = 10;
    const startApiPage = (uiPage - 1) * apiPagesPerUiPage + 1;
    const endApiPage = startApiPage + apiPagesPerUiPage - 1;
    
    const allMovies: Anime[] = [];
    
    for (let apiPage = startApiPage; apiPage <= endApiPage; apiPage++) {
      try {
        // Add small delay between requests to avoid rate limiting
        if (apiPage > startApiPage) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        const data = await getMovies(apiPage);
        allMovies.push(...data);
      } catch (error) {
        console.warn(`Failed to load API page ${apiPage}:`, error);
        // Continue with other pages even if one fails
      }
    }
    
    // De-duplicate based on urlId
    const uniqueMovies = Array.from(
      new Map(allMovies.map(item => [item.urlId, item])).values()
    );
    
    setMovieList(uniqueMovies);
    setIsLoading(false);
  }, []);

  // Load movies when page changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      loadMovies(currentPage);
      setIsSearching(false);
    }
  }, [currentPage, loadMovies, searchQuery]);

  // Handle search - filter from current page
  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      const filtered = movieList.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMovies(filtered);
    } else {
      setIsSearching(false);
      setFilteredMovies([]);
    }
  }, [searchQuery, movieList]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > MAX_API_PAGES) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Display either search results or paginated movies
  const displayedMovies = isSearching ? filteredMovies : movieList;

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
            {!isSearching && (
              <span className="inline-block px-2 py-0.5 ml-2 rounded-full bg-secondary text-secondary-foreground text-xs font-bold align-middle">
                Halaman {currentPage}
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
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="aspect-[2/3] rounded-xl bg-muted/50 animate-pulse" />
                    <div className="h-4 bg-muted/50 rounded animate-pulse w-3/4" />
                  </div>
                ))}
              </div>
            </div>
          ) : displayedMovies.length === 0 ? (
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
                {isSearching 
                  ? `Maaf, kami tidak dapat menemukan movie dengan kata kunci "${searchQuery}"`
                  : 'Halaman ini kosong'}
              </p>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
            >
              <AnimatePresence mode='popLayout'>
                {displayedMovies.map((movie, index) => (
                  <AnimeCardCompact 
                    key={movie.urlId} 
                    anime={movie} 
                    index={index} 
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Pagination - Only show when not searching */}
          {!isLoading && !isSearching && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-16 flex flex-col items-center gap-4"
            >
              <div className="inline-flex items-center gap-1 p-2 bg-background/50 backdrop-blur-sm border border-border/50 rounded-full shadow-lg">
                {/* First Page */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="rounded-full w-10 h-10 hover:bg-accent/10 hover:text-accent"
                >
                  <ChevronsLeft className="w-5 h-5" />
                </Button>

                {/* Previous Page */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded-full w-10 h-10 hover:bg-accent/10 hover:text-accent"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                
                {/* Page Number Input */}
                <div className="flex items-center gap-2 px-2">
                  <Input
                    type="number"
                    min={1}
                    max={MAX_API_PAGES}
                    value={currentPage}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val >= 1 && val <= MAX_API_PAGES) {
                        handlePageChange(val);
                      }
                    }}
                    className="w-16 h-8 text-center text-sm font-bold border-border/50 rounded-lg"
                  />
                </div>
                
                {/* Next Page */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === MAX_API_PAGES}
                  className="rounded-full w-10 h-10 hover:bg-accent/10 hover:text-accent"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>

                {/* Last Page */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePageChange(MAX_API_PAGES)}
                  disabled={currentPage === MAX_API_PAGES}
                  className="rounded-full w-10 h-10 hover:bg-accent/10 hover:text-accent"
                >
                  <ChevronsRight className="w-5 h-5" />
                </Button>
              </div>

              {/* Quick Jump Buttons */}
              <div className="flex flex-wrap justify-center gap-2">
                {[1, 3, 5, 8, 10, 15].map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="rounded-full"
                  >
                    {page}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
