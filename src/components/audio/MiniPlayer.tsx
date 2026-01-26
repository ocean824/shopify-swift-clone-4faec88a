import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAudio } from './AudioPlayer';
import { sampleKits } from '@/data/sampleKits';

export function MiniPlayer() {
  const { currentlyPlaying, play, pause, isPlaying, progress, duration, seek, currentUrl } = useAudio();
  
  // Find the kit that's playing
  const playingKit = currentlyPlaying 
    ? sampleKits.find(kit => kit.id === currentlyPlaying)
    : null;

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percentage = (e.clientX - rect.left) / rect.width;
    seek(Math.max(0, Math.min(1, percentage)));
  };

  const handlePlayPause = () => {
    if (currentlyPlaying && currentUrl) {
      if (isPlaying(currentlyPlaying)) {
        pause();
      } else {
        play(currentlyPlaying, currentUrl);
      }
    }
  };

  const progressPercentage = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <AnimatePresence>
      {playingKit && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-lg"
        >
          {/* Progress bar - clickable */}
          <div 
            className="absolute top-0 left-0 right-0 h-1 bg-muted cursor-pointer group"
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-primary transition-all duration-100"
              style={{ width: `${progressPercentage}%` }}
            />
            <div 
              className="absolute top-1/2 -translate-y-1/2 h-3 w-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `${progressPercentage}%`, marginLeft: '-6px' }}
            />
          </div>

          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 py-3">
              {/* Album art */}
              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                <img 
                  src={playingKit.image} 
                  alt={playingKit.title}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Track info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-foreground truncate">
                  {playingKit.title}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {formatTime(progress)} / {formatTime(duration)}
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full hover:bg-primary/10"
                  onClick={handlePlayPause}
                >
                  {isPlaying(currentlyPlaying) ? (
                    <Pause className="h-5 w-5 text-primary" />
                  ) : (
                    <Play className="h-5 w-5 ml-0.5 text-primary" />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-destructive/10"
                  onClick={pause}
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
