'use client';

import { Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import { VideoPlayer } from '@/components/VideoPlayer';
import { PlayerSkeleton } from '@/components/Skeletons';
import { Button } from '@/components/ui/button';

function WatchContent() {
  const params = useParams();
  const router = useRouter();
  const chapterUrlId = params.chapterUrlId as string;

  // Extract anime info from chapterUrlId (basic parsing)
  const episodeTitle = chapterUrlId
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-4"
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <p className="text-white/60 text-xs">Sedang Menonton</p>
              <h1 className="text-white font-medium text-sm md:text-base line-clamp-1">
                {episodeTitle}
              </h1>
            </div>
          </div>

          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Home className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Video Player */}
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl"
          >
            <VideoPlayer
              chapterUrlId={chapterUrlId}
              title={episodeTitle}
            />
          </motion.div>

          {/* Info below player */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-5xl mx-auto mt-6 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border"
          >
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {episodeTitle}
            </h2>
            <p className="text-sm text-muted-foreground">
              Nikmati streaming anime dengan kualitas terbaik. Gunakan tombol pengaturan untuk mengubah resolusi video.
            </p>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
              <Link href="/">
                <Button variant="outline" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Beranda
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function WatchPage() {
  return (
    <Suspense fallback={<PlayerSkeleton />}>
      <WatchContent />
    </Suspense>
  );
}
