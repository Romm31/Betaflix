'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Sun, 
  Moon, 
  Menu, 
  Film,
  Home,
  Sparkles,
  Tv
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/anime?page=1', label: 'Anime', icon: Tv },
  { href: '/movies?page=1', label: 'Movie', icon: Film },
  { href: '/search', label: 'Search', icon: Search },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out',
        isScrolled
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/5 shadow-2xl py-3'
          : 'bg-gradient-to-b from-black/80 via-black/20 to-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Logo size="lg" />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 bg-black/20 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/5 shadow-inner">
            {navLinks.map((link) => {
              const linkPath = link.href.split('?')[0];
              const isActive = pathname === linkPath;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                    isActive 
                      ? 'text-white bg-white/10 shadow-sm' 
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  )}
                >
                  <link.icon className={cn("w-4 h-4", isActive ? "text-primary" : "opacity-70 group-hover:opacity-100")} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search shortcut - desktop only */}
            <Link href="/search" className="hidden md:flex">
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <Search className="w-5 h-5" />
                <span className="sr-only">Cari Anime</span>
              </Button>
            </Link>

            {/* Theme Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="hover:bg-primary/10"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={theme}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {theme === 'dark' ? (
                      <Sun className="w-5 h-5 text-accent" />
                    ) : (
                      <Moon className="w-5 h-5 text-primary" />
                    )}
                  </motion.div>
                </AnimatePresence>
                <span className="sr-only">Toggle Theme</span>
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                  <Menu className="w-5 h-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] border-l border-white/10 bg-black/80 backdrop-blur-3xl shadow-2xl p-0">
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b border-white/5 space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xl font-bold tracking-tight">
                        <span className="text-primary">Beta</span>
                        <span className="text-white">flix</span>
                      </span>
                    </div>
                    <p className="text-xs text-white/50 font-medium tracking-wide">
                      PREMIUM ANIME STREAMING
                    </p>
                  </div>

                  <div className="flex-1 overflow-y-auto py-6 px-4">
                    <nav className="flex flex-col gap-2">
                       {navLinks.map((link, i) => {
                        const linkPath = link.href.split('?')[0];
                        const isActive = pathname === linkPath;
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className={cn(
                                'flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300',
                                isActive
                                  ? 'bg-primary text-white shadow-lg shadow-primary/20 font-semibold'
                                  : 'text-white/60 hover:bg-white/5 hover:text-white'
                              )}
                            >
                              <link.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-white/60")} />
                              {link.label}
                            </motion.div>
                          </Link>
                        );
                      })}
                    </nav>
                  </div>

                  <div className="p-6 border-t border-white/5 bg-white/5">
                    <p className="text-xs text-center text-white/40 leading-relaxed">
                      &copy; {new Date().getFullYear()} Betaflix.<br/>Made with ❤️ for Anime Fans.
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </motion.header>
  );
}
