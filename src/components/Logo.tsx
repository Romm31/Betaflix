import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Logo({ className, variant = 'full', size = 'md' }: LogoProps) {
  // Size mapping
  const sizes = {
    sm: { height: 24, fontSize: 16 },
    md: { height: 32, fontSize: 20 },
    lg: { height: 40, fontSize: 24 },
    xl: { height: 48, fontSize: 32 },
  };

  const { height } = sizes[size];

  // Brand Colors
  const COLORS = {
    maroon: '#800000',
    gold: '#C5A059',
  };

  if (variant === 'icon') {
    return (
      <svg
        width={height}
        height={height}
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        aria-label="Betaflix Icon"
      >
        {/* Background container */}
        <rect width="512" height="512" rx="120" fill={COLORS.maroon} />
        
        {/* Abstract Pattern (Subtle Batik Touch) - Opacity low for subtlety */}
        <path d="M0 0L512 512M512 0L0 512" stroke="white" strokeOpacity="0.05" strokeWidth="20" />
        <circle cx="256" cy="256" r="200" stroke="white" strokeOpacity="0.05" strokeWidth="20" />

        {/* The 'B' with integrated Play Button */}
        {/* Using a path that looks like a B but the holes are play buttons */}
        <path 
          d="M140 100 H 260 C 350 100, 400 150, 400 210 C 400 250, 370 280, 330 290 C 380 300, 420 340, 420 400 C 420 460, 360 512, 260 512 H 140 V 100 Z"
          fill="none"
        />
        
        {/* Actual simplified B shape for icon */}
        <path 
          d="M160 120H280C360 120 390 170 390 220C390 260 360 290 310 295C360 300 400 340 400 400C400 460 340 400 280 400H160V120Z"
          fill={COLORS.gold}
          transform="translate(-20, 0)" 
        />
        
        {/* Cutout/Play button accent */}
        <path d="M300 256L380 300V212L300 256Z" fill={COLORS.maroon} />
      </svg>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Small Icon included in Full Logo */}
      <svg
        height={height}
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-auto aspect-square"
      >
         <rect width="512" height="512" rx="120" fill={COLORS.maroon} />
         <path 
          d="M150 112H280C360 112 390 162 390 212C390 252 360 282 310 287C360 292 400 332 400 392C400 452 340 392 280 392H150V112Z"
          fill={COLORS.gold}
        />
        {/* Play triangle cutout */}
        <path d="M280 252L360 296V208L280 252Z" fill={COLORS.maroon} />
      </svg>

      {/* Typography */}
      <span 
        className="font-black tracking-tighter leading-none"
        style={{ 
          fontSize: height * 0.9,
          fontFamily: 'var(--font-inter), sans-serif' 
        }}
      >
        <span style={{ color: COLORS.maroon }}>Beta</span>
        <span style={{ color: COLORS.gold }}>flix</span>
      </span>
    </div>
  );
}
