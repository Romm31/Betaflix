'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AnimeGrid } from '@/components/AnimeGrid';
import { GridSkeleton } from '@/components/Skeletons';
import { searchAnime } from '@/lib/api';
import { Anime } from '@/lib/types';

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounced search
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const data = await searchAnime(searchQuery);
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query !== initialQuery) {
        // Update URL
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        router.push(`/search${query ? `?${params.toString()}` : ''}`, { scroll: false });
      }
      performSearch(query);
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [query, performSearch, router, initialQuery]);

  // Initial search on page load
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, []);

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
    router.push('/search', { scroll: false });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 blur-[120px] rounded-full opacity-50" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-accent/5 blur-[100px] rounded-full opacity-30" />
      </div>

      <div className="container mx-auto px-4 pt-24 md:pt-28 pb-16 relative z-10">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-5xl font-black text-foreground mb-4">
              <span className="text-primary">Cari</span> Anime
            </h1>
            <p className="text-muted-foreground">
              Temukan anime favoritmu dari ribuan koleksi kami
            </p>
          </div>

          {/* Search Input */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-accent/50 rounded-full opacity-30 group-hover:opacity-100 blur transition duration-500" />
            <div className="relative bg-background/80 backdrop-blur-xl rounded-full shadow-2xl">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="text"
                placeholder="Ketik judul anime ex: One Piece..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-14 pr-12 h-14 text-lg bg-transparent border-0 rounded-full focus-visible:ring-0 placeholder:text-muted-foreground/50"
              />
              {query && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full hover:bg-muted w-8 h-8"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </Button>
              )}
            </div>
          </div>

          {/* Search hints */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-4 flex flex-wrap justify-center gap-2"
          >
            {['One Piece', 'Naruto', 'Jujutsu Kaisen', 'Solo Leveling'].map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="text-xs px-3 py-1 rounded-full bg-secondary/50 hover:bg-secondary text-secondary-foreground transition-colors cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </motion.div>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-muted-foreground animate-pulse">Sedang mencari anime...</p>
            </div>
          ) : hasSearched ? (
            <>
              {results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 flex items-center justify-between"
                >
                  <p className="text-muted-foreground">
                    Ditemukan <span className="text-primary font-bold text-lg">{results.length}</span> hasil
                  </p>
                </motion.div>
              )}
              <AnimeGrid 
                animeList={results} 
                emptyMessage={`Tidak ditemukan anime untuk "${query}"`}
              />
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center py-20 opacity-50"
            >
              <Search className="w-24 h-24 text-muted-foreground/20 mx-auto mb-6" />
              <p className="text-xl text-muted-foreground font-medium">
                Mulai pencarianmu sekarang
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 pb-12"><div className="container mx-auto px-4"><GridSkeleton /></div></div>}>
      <SearchContent />
    </Suspense>
  );
}
