'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Tv, Search, ChevronLeft, ChevronRight } from 'lucide-react';
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
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
            <Tv className="w-8 h-8 text-primary" />
            Anime Series
          </h1>
          <p className="text-muted-foreground mt-2">
            Koleksi lengkap anime series dengan episode terbaru
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari anime..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Grid */}
        {isLoading ? (
          <GridSkeleton />
        ) : paginatedAnime.length === 0 ? (
          <div className="text-center py-12">
            <Tv className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {searchQuery ? `Tidak ada anime untuk "${searchQuery}"` : 'Tidak ada anime ditemukan'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {paginatedAnime.map((anime, index) => (
                <AnimeCardCompact key={`${anime.urlId}-${index}`} anime={anime} index={index} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Page info */}
            <p className="text-center text-sm text-muted-foreground mt-4">
              Halaman {currentPage} dari {totalPages} ({filteredAnime.length} anime)
            </p>
          </>
        )}
      </div>
    </div>
  );
}
