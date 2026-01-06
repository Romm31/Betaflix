import Link from 'next/link';
import { Sparkles, Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border bg-card/50 backdrop-blur-sm">
      {/* Decorative top border with Nusantara pattern */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold">
                <span className="text-primary">Beta</span>
                <span className="text-foreground">flix</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md">
              <span className="text-accent font-medium">Streaming Anime Rasa Nusantara</span> — 
              Nikmati koleksi anime terlengkap dengan sentuhan budaya Indonesia. 
              Kualitas terbaik, gratis tanpa batas.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Navigasi</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/movies" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Movie Anime
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Cari Anime
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Informasi</h4>
            <ul className="space-y-2">
              <li className="text-muted-foreground text-sm">
                Sumber: API Sansekai
              </li>
              <li className="text-muted-foreground text-sm">
                Teknologi: Next.js 14
              </li>
              <li className="text-muted-foreground text-sm">
                Tema: Nusantara Modern
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm text-center md:text-left">
            © {currentYear} Betaflix. Dibuat dengan{' '}
            <Heart className="inline w-4 h-4 text-primary fill-primary" />{' '}
            di Indonesia.
          </p>
          <p className="text-muted-foreground text-xs">
            Disclaimer: Semua konten disediakan oleh pihak ketiga. Betaflix tidak menyimpan file apapun.
          </p>
        </div>
      </div>
    </footer>
  );
}
