import { useRef, useEffect, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface MiniWaveformProps {
  progress: number; // 0-100
  duration: number;
  isPlaying: boolean;
  onSeek: (percentage: number) => void;
  audioUrl?: string;
}

// Generate pseudo-random but consistent waveform data based on audio URL
function generateWaveformData(seed: string, barCount: number): number[] {
  const bars: number[] = [];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash = hash & hash;
  }
  
  for (let i = 0; i < barCount; i++) {
    // Create pseudo-random values based on seed and position
    const val = Math.abs(Math.sin(hash * (i + 1) * 0.1) * Math.cos(hash * (i + 2) * 0.05));
    // Normalize to 0.2-1.0 range for visual appeal
    bars.push(0.2 + val * 0.8);
  }
  
  return bars;
}

export function MiniWaveform({ 
  progress, 
  duration, 
  isPlaying, 
  onSeek,
  audioUrl = 'default'
}: MiniWaveformProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverPosition, setHoverPosition] = useState(0);
  
  // Generate consistent waveform data based on audio URL
  const barCount = 50;
  const waveformData = useMemo(() => 
    generateWaveformData(audioUrl, barCount), 
    [audioUrl]
  );

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const percentage = (e.clientX - rect.left) / rect.width;
    onSeek(Math.max(0, Math.min(1, percentage)));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const percentage = ((e.clientX - rect.left) / rect.width) * 100;
    setHoverPosition(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <div
      ref={containerRef}
      className="relative h-8 w-full cursor-pointer group"
      onClick={handleClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Waveform bars */}
      <div className="absolute inset-0 flex items-center justify-between gap-[2px]">
        {waveformData.map((height, index) => {
          const barProgress = (index / barCount) * 100;
          const isPlayed = barProgress <= progress;
          const isHovered = isHovering && barProgress <= hoverPosition;
          
          return (
            <div
              key={index}
              className={cn(
                "flex-1 rounded-full transition-all duration-150",
                isPlayed 
                  ? "bg-primary" 
                  : isHovered 
                    ? "bg-primary/40" 
                    : "bg-muted-foreground/30",
                isPlaying && isPlayed && "animate-pulse"
              )}
              style={{
                height: `${height * 100}%`,
                minHeight: '4px',
                animationDelay: `${index * 20}ms`,
                animationDuration: '1.5s',
              }}
            />
          );
        })}
      </div>

      {/* Hover indicator line */}
      {isHovering && (
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-primary/60 pointer-events-none"
          style={{ left: `${hoverPosition}%` }}
        />
      )}

      {/* Playhead indicator */}
      <div 
        className="absolute top-1/2 -translate-y-1/2 h-3 w-3 bg-primary rounded-full shadow-md transition-all duration-100 opacity-0 group-hover:opacity-100"
        style={{ left: `${progress}%`, marginLeft: '-6px' }}
      />
    </div>
  );
}
