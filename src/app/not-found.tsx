import Link from 'next/link';
import { Home, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Decorative element */}
        <div className="relative mb-8">
          <div className="text-[150px] md:text-[200px] font-bold text-muted/20 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-primary" />
            </div>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Waduh, Halaman Tidak Ditemukan!
        </h1>
        
        <p className="text-muted-foreground mb-8">
          Sepertinya kamu tersesat di dunia anime. Jangan khawatir, 
          mari kembali ke beranda dan temukan anime favoritmu!
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="gap-2 w-full sm:w-auto">
              <Home className="w-4 h-4" />
              Kembali ke Beranda
            </Button>
          </Link>
          <Link href="/search">
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              <Search className="w-4 h-4" />
              Cari Anime
            </Button>
          </Link>
        </div>

        {/* Fun fact */}
        <p className="mt-12 text-xs text-muted-foreground italic">
          &quot;Setiap petualangan dimulai dari langkah pertama&quot; — Betaflix
        </p>
      </div>
    </div>
  );
}
