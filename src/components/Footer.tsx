import Link from 'next/link';
import { Sparkles, Github, Twitter, Instagram, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border/40 bg-background/80 backdrop-blur-xl pt-16 pb-8 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/20 blur-[100px] rounded-full opacity-20 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand Section - Takes 5 cols */}
          <div className="md:col-span-5 space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
                Betaflix
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              Platform streaming anime dengan sentuhan Nusantara. 
              Nikmati pengalaman menonton terbaik dengan koleksi terlengkap dan subtitle Indonesia berkualitas.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://github.com/Romm31" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary/50 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary hover:border-primary/20 transition-all duration-300"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-secondary/50 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary hover:border-primary/20 transition-all duration-300"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-secondary/50 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary hover:border-primary/20 transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation Links - Centered */}
          <div className="md:col-span-3 md:col-start-7 space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="font-semibold text-foreground tracking-wide">Menu</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors block w-fit">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/anime" className="text-muted-foreground hover:text-primary transition-colors block w-fit">
                  Anime Series
                </Link>
              </li>
              <li>
                <Link href="/movies" className="text-muted-foreground hover:text-primary transition-colors block w-fit">
                  Movie Anime
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-muted-foreground hover:text-primary transition-colors block w-fit">
                  Pencarian
                </Link>
              </li>
            </ul>
          </div>

          {/* GitHub Promo - Right Aligned */}
          <div className="md:col-span-3 space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="font-semibold text-foreground tracking-wide">Project</h4>
            <div className="p-4 rounded-xl bg-card border border-border group hover:border-primary/30 transition-all duration-300 shadow-sm">
              <h5 className="font-medium text-card-foreground mb-2">Open Source</h5>
              <p className="text-xs text-muted-foreground mb-4">
                Cek kode sumber project ini di GitHub. Jangan lupa kasih bintang! ⭐
              </p>
              <a 
                href="https://github.com/Romm31" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button size="sm" className="w-full" variant="outline">
                  <Github className="w-4 h-4 mr-2" />
                  Visit GitHub
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} Betaflix. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span>Developed by</span>
            <a 
              href="https://github.com/Romm31" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 font-medium flex items-center gap-0.5 hover:underline"
            >
              @Romm31
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
