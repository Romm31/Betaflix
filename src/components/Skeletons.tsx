import { Skeleton } from '@/components/ui/skeleton';

// Hero Banner Skeleton
export function HeroSkeleton() {
  return (
    <div className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden bg-muted">
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 flex items-end pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl space-y-4">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-12 w-96 md:h-16" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-20 w-full max-w-lg" />
            <div className="flex gap-3">
              <Skeleton className="h-12 w-40" />
              <Skeleton className="h-12 w-36" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Single Card Skeleton
export function CardSkeleton() {
  return (
    <div className="flex-shrink-0 w-[140px] md:w-[180px] lg:w-[200px]">
      <Skeleton className="aspect-[2/3] rounded-lg" />
      <Skeleton className="h-4 w-full mt-2" />
      <Skeleton className="h-3 w-16 mt-1" />
    </div>
  );
}

// Row Carousel Skeleton
export function RowSkeleton({ title }: { title: string }) {
  return (
    <section className="py-4 md:py-6">
      <div className="container mx-auto px-4 mb-3 md:mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-primary rounded-full" />
          <h2 className="text-xl md:text-2xl font-bold text-foreground">{title}</h2>
        </div>
      </div>
      <div className="flex gap-3 md:gap-4 overflow-hidden px-4 md:px-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

// Grid Skeleton for search results
export function GridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <Skeleton className="aspect-[2/3] rounded-lg" />
          <Skeleton className="h-4 w-full mt-2" />
        </div>
      ))}
    </div>
  );
}

// Detail Page Skeleton
export function DetailSkeleton() {
  return (
    <div className="min-h-screen pt-16">
      {/* Banner Skeleton */}
      <div className="relative h-[50vh] md:h-[60vh] bg-muted">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>
      
      {/* Content Skeleton */}
      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Poster */}
          <Skeleton className="w-48 h-72 rounded-lg flex-shrink-0 mx-auto md:mx-0" />
          
          {/* Info */}
          <div className="flex-1 space-y-4">
            <Skeleton className="h-10 w-80" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-32 w-full" />
            <div className="flex gap-3">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
        </div>
        
        {/* Episodes */}
        <div className="mt-8">
          <Skeleton className="h-8 w-40 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-12 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Video Player Skeleton
export function PlayerSkeleton() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Video Area */}
      <div className="flex-1 flex items-center justify-center">
        <Skeleton className="w-full max-w-5xl aspect-video" />
      </div>
      
      {/* Controls */}
      <div className="p-4 flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  );
}
