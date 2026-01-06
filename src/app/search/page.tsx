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
    <div className="min-h-screen pt-24 md:pt-28 pb-12">
      <div className="container mx-auto px-4">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mb-8 md:mb-12"
        >
          <h1 className="text-2xl md:text-4xl font-bold text-center mb-6">
            <span className="text-primary">Cari</span> Anime Favoritmu
          </h1>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Ketik judul anime..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-14 pl-12 pr-12 text-lg rounded-xl border-2 border-border focus:border-primary bg-card"
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>

          {/* Search hints */}
          <p className="text-center text-muted-foreground text-sm mt-3">
            Contoh: &quot;One Piece&quot;, &quot;Naruto&quot;, &quot;Demon Slayer&quot;
          </p>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Mencari anime...</p>
            </div>
          ) : hasSearched ? (
            <>
              {results.length > 0 && (
                <p className="text-muted-foreground mb-4">
                  Ditemukan <span className="text-primary font-medium">{results.length}</span> hasil untuk &quot;{query}&quot;
                </p>
              )}
              <AnimeGrid 
                animeList={results} 
                emptyMessage={`Tidak ditemukan anime untuk "${query}"`}
              />
            </>
          ) : (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">
                Mulai ketik untuk mencari anime
              </p>
            </div>
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
