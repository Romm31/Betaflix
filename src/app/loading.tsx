import { HeroSkeleton, RowSkeleton } from '@/components/Skeletons';

export default function HomeLoading() {
  return (
    <div className="min-h-screen">
      <HeroSkeleton />
      <div className="-mt-16 relative z-10 space-y-2 pb-12">
        <RowSkeleton title="🔥 Anime Terbaru" />
        <RowSkeleton title="📈 Sedang Trending" />
        <RowSkeleton title="🎬 Movie Anime" />
        <RowSkeleton title="✨ Rekomendasi Untuk Kamu" />
      </div>
    </div>
  );
}
