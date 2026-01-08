'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
  Settings,
  Loader2,
  AlertCircle,

  ChevronsRight,
  RotateCcw,
  RotateCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getVideoUrl } from '@/lib/api';
import { Resolution } from '@/lib/types';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  chapterUrlId: string;
  title?: string;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

const RESOLUTIONS: Resolution[] = ['360p', '480p', '720p', '1080p'];

export function VideoPlayer({
  chapterUrlId,
  title,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolution, setResolution] = useState<Resolution>('480p');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const [isFastForwarding, setIsFastForwarding] = useState(false);
  const [showSpeedIndicator, setShowSpeedIndicator] = useState(false);

  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
    }
    setIsMuted(newVolume === 0);
  };

  // Fetch video URL
  useEffect(() => {
    async function fetchVideo() {
      setLoading(true);
      setError(null);
      
      try {
        const url = await getVideoUrl(chapterUrlId, resolution);
        if (url) {
          setVideoUrl(url);
        } else {
          setError('Video tidak tersedia untuk resolusi ini');
        }
      } catch {
        setError('Gagal memuat video. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    }

    fetchVideo();
  }, [chapterUrlId, resolution]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

      switch(e.key) {
        case 'ArrowRight':
          handleSkip(10);
          break;
        case 'ArrowLeft':
          handleSkip(-10);
          break;
        case ' ':
          e.preventDefault(); // Prevent scrolling
          togglePlay();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]); // Re-bind if needed, or better yet, use refs or stable callbacks. 
  // togglePlay depends on IsPlaying state, so we need it in dependency or use functional update.
  // Actually togglePlay definition uses videoRef, it doesn't depend on isPlaying state for the action itself if we check video.paused, 
  // but the React state `isPlaying` is used in togglePlay implementation in original code?
  // Original togglePlay: if (isPlaying) ... else ...
  // It uses state. So we need to include it or rewrite togglePlay to check videoRef directly.
  // Let's rely on the existing togglePlay but might assume it's stable enough or just add deps.
  
  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    // Ensure playback rate is reset on pause/play if needed, or persistent?
    // Usually persistent implies if I pause then play, it stays 2x? No, 2x is only on HOLD.
    // Standard playback should be 1x unless changed via settings (not implemented yet).

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [videoUrl]);

  // Auto-hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const resetTimeout = () => {
      setShowControls(true);
      clearTimeout(timeout);
      if (isPlaying) {
        timeout = setTimeout(() => setShowControls(false), 3000);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', resetTimeout);
      container.addEventListener('mouseenter', resetTimeout);
    }

    return () => {
      clearTimeout(timeout);
      if (container) {
        container.removeEventListener('mousemove', resetTimeout);
        container.removeEventListener('mouseenter', resetTimeout);
      }
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSkip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const startFastForward = () => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 2.0;
      setIsFastForwarding(true);
      setShowSpeedIndicator(true);
    }
  };

  const stopFastForward = () => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.0;
      setIsFastForwarding(false);
      setShowSpeedIndicator(false);
    }
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    if (videoRef.current) {
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResolutionChange = (newResolution: Resolution) => {
    const currentPlayTime = videoRef.current?.currentTime || 0;
    setResolution(newResolution);
    // After new video loads, seek to previous position
    setTimeout(() => {
      if (videoRef.current && currentPlayTime > 0) {
        videoRef.current.currentTime = currentPlayTime;
      }
    }, 1000);
  };

  if (loading) {
    return (
      <div className="aspect-video bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Memuat video...</p>
        </div>
      </div>
    );
  }

  if (error || !videoUrl) {
    return (
      <div className="aspect-video bg-black flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">{error || 'Video tidak tersedia'}</p>
          <div className="flex gap-2 justify-center">
            {RESOLUTIONS.map((res) => (
              <Button
                key={res}
                variant={resolution === res ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleResolutionChange(res)}
              >
                {res}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-video bg-black group overflow-hidden select-none"
      onMouseLeave={() => {
        if (isPlaying) setShowControls(false);
        stopFastForward();
      }}
      onClick={() => setShowControls(true)} 
      onMouseDown={startFastForward}
      onMouseUp={stopFastForward}
      onTouchStart={startFastForward}
      onTouchEnd={stopFastForward}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full"
        onClick={(e) => {
          e.stopPropagation();
          togglePlay();
        }}
        playsInline
      />
      
      {/* 2x Speed Indicator */}
      {showSpeedIndicator && (
        <div className="absolute top-8 right-1/2 translate-x-1/2 md:right-8 md:translate-x-0 bg-black/50 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-2 text-white/90 z-20 pointer-events-none animate-in fade-in zoom-in duration-200">
          <ChevronsRight className="w-4 h-4" />
          <span className="text-sm font-medium">2x Speed</span>
        </div>
      )}

      {/* Controls Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showControls ? 1 : 0 }}
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60 flex flex-col justify-between"
      >
        {/* Top bar */}
        <div className="p-4 flex justify-between items-start">
          {title && (
            <h3 className="text-white font-medium text-lg drop-shadow-md line-clamp-1">
              {title}
            </h3>
          )}
        </div>

        {/* Center play button (Mobile friendly: Only show if paused or hovering?) 
            Actually, keep it as main interaction point.
        */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {!isPlaying && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white border border-white/20"
            >
              <Play className="w-8 h-8 ml-1 fill-current" />
            </motion.div>
          )}
        </div>

        {/* 10s Backward Skip Button - Left Overlay */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-auto">
             <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSkip(-10);
                }}
                className="p-3 rounded-full bg-black/50 backdrop-blur-sm text-white/90 hover:text-white hover:bg-black/70 border border-white/10 transition-all active:scale-95"
                title="Rewind 10s"
              >
                <RotateCcw className="w-8 h-8" />
                <span className="sr-only">Rewind 10s</span>
              </button>
        </div>

        {/* 10s Forward Skip Button - Right Overlay */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 pointer-events-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSkip(10);
                }}
                className="p-3 rounded-full bg-black/50 backdrop-blur-sm text-white/90 hover:text-white hover:bg-black/70 border border-white/10 transition-all active:scale-95"
                title="Skip 10s"
              >
                <RotateCw className="w-8 h-8" />
                <span className="sr-only">Skip 10s</span>
              </button>
        </div>

        {/* Bottom controls */}
        <div className="p-4 space-y-3 bg-gradient-to-t from-black/80 to-transparent">
          {/* Progress bar */}
          <div
            className="h-1.5 bg-white/20 rounded-full cursor-pointer group/progress relative"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-primary rounded-full relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-primary rounded-full shadow-lg scale-0 group-hover/progress:scale-100 transition-transform" />
            </div>
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 md:gap-4">
              {/* Skip Back */}
              <button 
                onClick={() => handleSkip(-10)}
                className="text-white hover:text-primary transition-colors focus:outline-none hidden md:block"
                title="-10s"
              >
                <SkipBack className="w-5 h-5 fill-current" />
              </button>

              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="text-white hover:text-primary transition-colors focus:outline-none"
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
              </button>

              {/* Skip Forward */}
              <button 
                onClick={() => handleSkip(10)}
                className="text-white hover:text-primary transition-colors focus:outline-none hidden md:block"
                title="+10s"
              >
                <SkipForward className="w-5 h-5 fill-current" />
              </button>


              {/* Volume Control */}
              <div className="flex items-center group/volume">
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-primary transition-colors focus:outline-none mr-2"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </button>
                <div className="w-0 overflow-hidden group-hover/volume:w-20 md:w-24 transition-all duration-300 flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 accent-primary cursor-pointer"
                  />
                </div>
              </div>

              {/* Time */}
              <span className="text-white/90 text-xs md:text-sm font-medium tabular-nums">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Resolution selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-white/90 hover:text-white text-xs md:text-sm font-medium flex items-center gap-1 px-2 py-1 rounded hover:bg-white/10 transition-colors">
                    <Settings className="w-4 h-4" />
                    <span className="hidden md:inline">{resolution}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-black/90 border-white/10 text-white">
                  {RESOLUTIONS.map((res) => (
                    <DropdownMenuItem
                      key={res}
                      onClick={() => handleResolutionChange(res)}
                      className={cn(
                        "focus:bg-white/20 focus:text-white cursor-pointer",
                        resolution === res && 'text-primary'
                      )}
                    >
                      {res}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-primary transition-colors focus:outline-none"
              >
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
