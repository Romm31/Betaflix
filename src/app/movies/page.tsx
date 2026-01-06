'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Film, Search, ChevronLeft, ChevronRight } from 'lucide-react';
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
      const data = await getMovies();
      setAllMovies(data);
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
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground flex items-center justify-center gap-3 mb-4">
            <Film className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            Movie Anime
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Koleksi lengkap anime movie terbaik
            {!isLoading && allMovies.length > 0 && (
              <span className="ml-1">({allMovies.length} film tersedia)</span>
            )}
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xl mx-auto mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari judul movie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 text-lg rounded-full border-white/10 bg-white/5 backdrop-blur-sm focus:bg-white/10 transition-all shadow-lg"
          />
        </div>

        {/* Grid */}
        {isLoading ? (
          <GridSkeleton />
        ) : paginatedMovies.length === 0 ? (
          <div className="text-center py-12">
            <Film className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {searchQuery ? `Tidak ada movie untuk "${searchQuery}"` : 'Tidak ada movie ditemukan'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {paginatedMovies.map((movie, index) => (
                <AnimeCardCompact key={`${movie.urlId}-${index}`} anime={movie} index={index} />
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
              Halaman {currentPage} dari {totalPages} ({filteredMovies.length} movie)
            </p>
          </>
        )}
      </div>
    </div>
  );
}
