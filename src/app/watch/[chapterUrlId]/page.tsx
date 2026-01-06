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


      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120vw] h-[80vh] bg-primary/10 blur-[150px] opacity-30 rounded-full" />
      </div>

      {/* Video Player Section */}
      <div className="pt-24 pb-12 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="max-w-[1400px] mx-auto"
          >
            {/* Player Container with Glow */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/50 backdrop-blur-sm">
                <VideoPlayer
                  chapterUrlId={chapterUrlId}
                  title={episodeTitle}
                />
              </div>
            </div>

            {/* Title & Info */}
            <div className="mt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight drop-shadow-md">
                  {episodeTitle}
                </h1>
                <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed hidden md:block">
                  Nikmati pengalaman streaming anime terbaik. Gunakan tombol pengaturan di player untuk menyesuaikan kualitas video sesuai koneksi internet Anda.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => router.back()}
                  className="bg-background/20 backdrop-blur-md border-white/10 hover:bg-white/10 hover:text-white transition-all"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali
                </Button>
                <Link href="/">
                  <Button 
                    variant="default"
                    className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Beranda
                  </Button>
                </Link>
              </div>
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
