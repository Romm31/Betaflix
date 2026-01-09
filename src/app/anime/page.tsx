'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Tv, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRecommendedAnime, searchAnime } from '@/lib/api';
import { Anime } from '@/lib/types';
import { AnimeCardCompact } from '@/components/AnimeCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Maximum pages available from API
const MAX_API_PAGES = 150;

export default function AnimePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get page from URL, default to 1
  const urlPage = parseInt(searchParams.get('page') || '1', 10);
  const currentPage = isNaN(urlPage) || urlPage < 1 ? 1 : Math.min(urlPage, MAX_API_PAGES);

  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Anime[]>([]);

  // Load anime for current page from API (1 request per page)
  const loadAnime = useCallback(async (page: number) => {
    setIsLoading(true);
    
    try {
      const data = await getRecommendedAnime(page);
      
      // De-duplicate based on urlId
      const uniqueAnime = Array.from(
        new Map(data.map(item => [item.urlId, item])).values()
      );
      
      setAnimeList(uniqueAnime);
    } catch (error) {
      console.error('Failed to load anime:', error);
      setAnimeList([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load anime when page changes (from URL)
  useEffect(() => {
    if (!searchQuery.trim()) {
      loadAnime(currentPage);
    }
  }, [currentPage, loadAnime, searchQuery]);

  // Handle search
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      setIsLoading(true);
      const results = await searchAnime(query, 50);
      const animeOnly = results.filter(item => item.contentType === 'anime');
      setSearchResults(animeOnly);
    } catch (error) {
      console.error('Failed to search:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, handleSearch]);

  // Navigate to a different page via URL
  const handlePageChange = (page: number) => {
    if (page < 1 || page > MAX_API_PAGES) return;
    router.push(`/anime?page=${page}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Display either search results or paginated anime
  const displayedAnime = isSearching ? searchResults : animeList;

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
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="aspect-[2/3] rounded-xl bg-muted/50 animate-pulse" />
                    <div className="h-4 bg-muted/50 rounded animate-pulse w-3/4" />
                  </div>
                ))}
              </div>
            </div>
          ) : displayedAnime.length === 0 ? (
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
                  ? `Maaf, kami tidak dapat menemukan anime dengan kata kunci "${searchQuery}"`
                  : 'Halaman ini kosong atau terjadi error. Coba refresh atau kembali ke halaman 1.'}
              </p>
              {!isSearching && (
                <Button className="mt-4" onClick={() => handlePageChange(1)}>
                  Ke Halaman 1
                </Button>
              )}
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
            >
              <AnimatePresence mode='popLayout'>
                {displayedAnime.map((anime, index) => (
                  <AnimeCardCompact 
                    key={anime.urlId} 
                    anime={anime} 
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
                  className="rounded-full w-10 h-10 hover:bg-primary/10 hover:text-primary"
                >
                  <ChevronsLeft className="w-5 h-5" />
                </Button>

                {/* Previous Page */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded-full w-10 h-10 hover:bg-primary/10 hover:text-primary"
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
                  className="rounded-full w-10 h-10 hover:bg-primary/10 hover:text-primary"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>

                {/* Last Page */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePageChange(MAX_API_PAGES)}
                  disabled={currentPage === MAX_API_PAGES}
                  className="rounded-full w-10 h-10 hover:bg-primary/10 hover:text-primary"
                >
                  <ChevronsRight className="w-5 h-5" />
                </Button>
              </div>

              {/* Quick Jump Buttons */}
              <div className="flex flex-wrap justify-center gap-2">
                {[1, 10, 25, 50, 75, 100].map(page => (
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
