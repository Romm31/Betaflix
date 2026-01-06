import { Suspense } from 'react';
import { getLatestAnime, getMovies, getTrending, getRecommendations } from '@/lib/api';
import { MAX_ITEMS } from '@/lib/types';
import { HeroBanner } from '@/components/HeroBanner';
import { RowCarousel } from '@/components/RowCarousel';
import { HeroSkeleton, RowSkeleton } from '@/components/Skeletons';

export const revalidate = 60;

async function HomeContent() {
  const [latestAnime, movies] = await Promise.all([
    getLatestAnime(1, MAX_ITEMS.ANIME_TERBARU),
    getMovies(MAX_ITEMS.MOVIES_HOME),
  ]);

  // Get hero anime - prioritize anime series
  const animeWithEpisodes = latestAnime.filter(a => a.contentType === 'anime');
  const heroAnime = animeWithEpisodes[0] || latestAnime[0] || movies[0];

  // Create different categories with proper limits
  const animeTerbaru = latestAnime.slice(0, MAX_ITEMS.ANIME_TERBARU);
  const trending = getTrending(animeWithEpisodes, MAX_ITEMS.TRENDING);
  const recommendations = getRecommendations(latestAnime, MAX_ITEMS.REKOMENDASI);
  const moviesList = movies.slice(0, MAX_ITEMS.MOVIES_HOME);

  return (
    <>
      {/* Hero Banner */}
      {heroAnime ? (
        <HeroBanner anime={heroAnime} />
      ) : (
        <HeroSkeleton />
      )}

      {/* Content Rows */}
      <div className="-mt-12 relative z-10 space-y-1 pb-8">
        {/* Anime Terbaru */}
        <RowCarousel 
          title="Anime Terbaru" 
          animeList={animeTerbaru}
          variant="anime"
          seeAllLink="/anime"
        />

        {/* Trending */}
        <RowCarousel 
          title="Trending Anime" 
          animeList={trending}
          variant="anime"
          seeAllLink="/anime"
        />

        {/* Movie Anime */}
        {moviesList.length > 0 && (
          <RowCarousel 
            title="Movie Anime" 
            animeList={moviesList}
            variant="movie"
            seeAllLink="/movies"
          />
        )}

        {/* Rekomendasi */}
        <RowCarousel 
          title="Rekomendasi Untuk Kamu" 
          animeList={recommendations}
          variant="anime"
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
        <RowSkeleton title="Anime Terbaru" />
        <RowSkeleton title="Trending Anime" />
        <RowSkeleton title="Movie Anime" />
        <RowSkeleton title="Rekomendasi Untuk Kamu" />
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
