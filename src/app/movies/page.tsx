import { Suspense } from 'react';
import { Metadata } from 'next';
import { getMovies } from '@/lib/api';
import { AnimeGrid } from '@/components/AnimeGrid';
import { GridSkeleton } from '@/components/Skeletons';
import { Film } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Movie Anime',
  description: 'Koleksi lengkap movie anime terbaik di Betaflix. Tonton movie anime favorit dengan kualitas terbaik.',
};

export const revalidate = 60;

async function MoviesContent() {
  const movies = await getMovies();

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Film className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold">Movie Anime</h1>
              <p className="text-muted-foreground text-sm">
                {movies.length} film tersedia
              </p>
            </div>
          </div>
          <p className="text-muted-foreground mt-4 max-w-2xl">
            Jelajahi koleksi movie anime terlengkap. Dari adventure epik hingga romance yang menyentuh hati, 
            temukan film anime favoritmu di sini.
          </p>
        </div>

        {/* Movies Grid */}
        <AnimeGrid 
          animeList={movies} 
          emptyMessage="Tidak ada movie yang tersedia saat ini"
        />
      </div>
    </div>
  );
}

export default function MoviesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-24 md:pt-28 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="h-12 w-48 bg-muted rounded-lg animate-pulse mb-4" />
            <div className="h-6 w-96 bg-muted rounded animate-pulse" />
          </div>
          <GridSkeleton />
        </div>
      </div>
    }>
      <MoviesContent />
    </Suspense>
  );
}
