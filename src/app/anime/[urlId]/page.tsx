import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { Play, Star, Calendar, Clock, Film, ChevronRight } from 'lucide-react';
import { getAnimeDetail } from '@/lib/api';
import { getImageUrl, truncateText } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DetailSkeleton } from '@/components/Skeletons';

interface PageProps {
  params: Promise<{ urlId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { urlId } = await params;
  const anime = await getAnimeDetail(urlId);
  
  if (!anime) {
    return { title: 'Anime Tidak Ditemukan' };
  }

  return {
    title: anime.title,
    description: anime.synopsis ? truncateText(anime.synopsis, 160) : `Tonton ${anime.title} di Betaflix`,
    openGraph: {
      title: anime.title,
      description: anime.synopsis || `Tonton ${anime.title} di Betaflix`,
      images: anime.poster ? [anime.poster] : [],
    },
  };
}

async function AnimeDetailContent({ urlId }: { urlId: string }) {
  const anime = await getAnimeDetail(urlId);

  if (!anime) {
    notFound();
  }

  const imageUrl = getImageUrl(anime.poster);
  const firstChapter = anime.chapter?.[0];

  return (
    <div className="min-h-screen">
      {/* Banner Background */}
      <div className="relative h-[50vh] md:h-[60vh]">
        <Image
          src={imageUrl}
          alt={anime.title}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-48 md:-mt-56 relative z-10">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Poster */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <div className="relative w-48 md:w-56 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border-2 border-border">
              <Image
                src={imageUrl}
                alt={anime.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 192px, 224px"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {anime.title}
            </h1>

            {/* Meta badges */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
              {anime.score && (
                <Badge variant="secondary" className="gap-1">
                  <Star className="w-3 h-3 fill-accent text-accent" />
                  {anime.score}
                </Badge>
              )}
              {anime.status && (
                <Badge variant="outline">{anime.status}</Badge>
              )}
              {anime.type && (
                <Badge variant="outline" className="gap-1">
                  <Film className="w-3 h-3" />
                  {anime.type}
                </Badge>
              )}
              {anime.episodes && (
                <Badge variant="outline">{anime.episodes} Episode</Badge>
              )}
              {anime.duration && (
                <Badge variant="outline" className="gap-1">
                  <Clock className="w-3 h-3" />
                  {anime.duration}
                </Badge>
              )}
              {anime.releaseDate && (
                <Badge variant="outline" className="gap-1">
                  <Calendar className="w-3 h-3" />
                  {anime.releaseDate}
                </Badge>
              )}
            </div>

            {/* Genres */}
            {anime.genres && anime.genres.length > 0 && (
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                {anime.genres.map((genre, index) => (
                  <Badge key={index} className="bg-primary/20 text-primary border-primary/30">
                    {genre}
                  </Badge>
                ))}
              </div>
            )}

            {/* Synopsis */}
            {anime.synopsis && (
              <p className="text-muted-foreground text-sm md:text-base mb-6 max-w-2xl">
                {anime.synopsis}
              </p>
            )}

            {/* Studio/Season */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground mb-6">
              {anime.studio && (
                <span>Studio: <span className="text-foreground">{anime.studio}</span></span>
              )}
              {anime.season && (
                <span>Season: <span className="text-foreground">{anime.season}</span></span>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {firstChapter && (
                <Link href={`/watch/${firstChapter.chapterUrlId}`}>
                  <Button size="lg" className="gap-2">
                    <Play className="w-5 h-5 fill-current" />
                    Tonton Sekarang
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Episodes List */}
        {anime.chapter && anime.chapter.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full" />
              Daftar Episode ({anime.chapter.length})
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {anime.chapter.map((chapter, index) => (
                <Link
                  key={chapter.chapterUrlId}
                  href={`/watch/${chapter.chapterUrlId}`}
                  className="group"
                >
                  <div className="p-3 rounded-lg bg-card border border-border hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                        {chapter.title || `Episode ${index + 1}`}
                      </p>
                      {chapter.date && (
                        <p className="text-xs text-muted-foreground">{chapter.date}</p>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default async function AnimeDetailPage({ params }: PageProps) {
  const { urlId } = await params;
  
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <AnimeDetailContent urlId={urlId} />
    </Suspense>
  );
}
