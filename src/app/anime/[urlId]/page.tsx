import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAnimeDetail } from '@/lib/api';
import { truncateText } from '@/lib/utils';
import { DetailSkeleton } from '@/components/Skeletons';
import { AnimeDetail } from '@/components/AnimeDetail';

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
    title: `${anime.title} Substation Indonesia - Betaflix`,
    description: anime.synopsis ? truncateText(anime.synopsis, 160) : `Nonton anime ${anime.title} subtitle Indonesia kualitas HD di Betaflix.`,
    openGraph: {
      title: `${anime.title} - Betaflix Anime`,
      description: anime.synopsis || `Nonton anime ${anime.title} di Betaflix`,
      images: anime.poster ? [anime.poster] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: anime.title,
      description: `Nonton anime ${anime.title} subtitle Indonesia`,
      images: anime.poster ? [anime.poster] : [],
    }
  };
}

async function AnimeDetailContent({ urlId }: { urlId: string }) {
  const anime = await getAnimeDetail(urlId);

  if (!anime) {
    notFound();
  }

  return <AnimeDetail anime={anime} />;
}

export default async function AnimeDetailPage({ params }: PageProps) {
  const { urlId } = await params;
  
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <AnimeDetailContent urlId={urlId} />
    </Suspense>
  );
}
