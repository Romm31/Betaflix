import { Suspense } from 'react';
import { getLatestAnime, getMovies, getTrending, getRecommendations } from '@/lib/api';
import { HeroBanner } from '@/components/HeroBanner';
import { RowCarousel } from '@/components/RowCarousel';
import { HeroSkeleton, RowSkeleton } from '@/components/Skeletons';

export const revalidate = 60; // Revalidate every 60 seconds

async function HomeContent() {
  const [latestAnime, movies] = await Promise.all([
    getLatestAnime(1),
    getMovies(),
  ]);

  // Get hero anime (first from latest)
  const heroAnime = latestAnime[0];

  // Create different categories from the data
  const trending = getTrending(latestAnime, 12);
  const recommendations = getRecommendations(latestAnime, 10);
  const moviesList = movies.slice(0, 15);

  return (
    <>
      {/* Hero Banner */}
      {heroAnime ? (
        <HeroBanner anime={heroAnime} />
      ) : (
        <HeroSkeleton />
      )}

      {/* Content Rows */}
      <div className="-mt-16 relative z-10 space-y-2 pb-12">
        {/* Anime Terbaru */}
        <RowCarousel 
          title="🔥 Anime Terbaru" 
          animeList={latestAnime} 
        />

        {/* Trending */}
        <RowCarousel 
          title="📈 Sedang Trending" 
          animeList={trending} 
        />

        {/* Movie Anime */}
        {moviesList.length > 0 && (
          <RowCarousel 
            title="🎬 Movie Anime" 
            animeList={moviesList} 
          />
        )}

        {/* Rekomendasi */}
        <RowCarousel 
          title="✨ Rekomendasi Untuk Kamu" 
          animeList={recommendations} 
        />
      </div>
    </>
  );
}

function HomeLoading() {
  return (
    <>
      <HeroSkeleton />
      <div className="-mt-16 relative z-10 space-y-2 pb-12">
        <RowSkeleton title="🔥 Anime Terbaru" />
        <RowSkeleton title="📈 Sedang Trending" />
        <RowSkeleton title="🎬 Movie Anime" />
        <RowSkeleton title="✨ Rekomendasi Untuk Kamu" />
      </div>
    </>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<HomeLoading />}>
        <HomeContent />
      </Suspense>
    </div>
  );
}
