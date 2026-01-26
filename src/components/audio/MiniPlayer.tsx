import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useAudio } from './AudioPlayer';
import { MiniWaveform } from './MiniWaveform';
import { sampleKits } from '@/data/sampleKits';

// External bundle URL
const BUNDLE_EXTERNAL_URL = 'https://my.flowlance.com/samplesociety';

export function MiniPlayer() {
  const navigate = useNavigate();
  const { currentlyPlaying, play, pause, isPlaying, progress, duration, seek, currentUrl, playNext, playPrevious } = useAudio();
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const volumeTimeoutRef = useRef<NodeJS.Timeout>();
  
  // Find the kit that's playing
  const playingKit = currentlyPlaying 
    ? sampleKits.find(kit => kit.id === currentlyPlaying)
    : null;

  // Get the audio element to control volume
  useEffect(() => {
    if (currentlyPlaying) {
      const audioElements = document.querySelectorAll('audio');
      audioElements.forEach(audio => {
        if (audio.src && currentUrl && audio.src.includes(currentUrl.replace('/audio/', ''))) {
          audio.volume = isMuted ? 0 : volume;
        }
      });
    }
  }, [volume, isMuted, currentlyPlaying, currentUrl]);

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (percentage: number) => {
    seek(percentage);
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

  const handleSkipBack = () => {
    // If more than 3 seconds in, restart current track; otherwise go to previous
    if (progress > 3) {
      seek(0);
    } else {
      playPrevious();
    }
  };

  const handleSkipForward = () => {
    playNext();
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (newVolume > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeHover = () => {
    if (volumeTimeoutRef.current) {
      clearTimeout(volumeTimeoutRef.current);
    }
    setShowVolume(true);
  };

  const handleVolumeLeave = () => {
    volumeTimeoutRef.current = setTimeout(() => {
      setShowVolume(false);
    }, 300);
  };

  const handleImageClick = () => {
    if (playingKit) {
      // Bundle links to external Flowlance funnel
      if (playingKit.id === 'all-kits-bundle-2025') {
        window.open(BUNDLE_EXTERNAL_URL, '_blank');
      } else {
        // Other products navigate to product page (audio keeps playing)
        navigate(`/product/${playingKit.wavHandle}`);
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
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 py-3 md:gap-4">
              {/* Album art - clickable */}
              <button 
                onClick={handleImageClick}
                className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <img 
                  src={playingKit.image} 
                  alt={playingKit.title}
                  className="h-full w-full object-cover"
                />
              </button>

              {/* Track info + Waveform */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <button 
                    onClick={handleImageClick}
                    className="text-left hover:text-primary transition-colors truncate"
                  >
                    <h4 className="font-medium text-sm text-foreground truncate">
                      {playingKit.title}
                    </h4>
                  </button>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatTime(progress)} / {formatTime(duration)}
                  </p>
                </div>
                
                {/* Waveform visualization */}
                <MiniWaveform
                  progress={progressPercentage}
                  duration={duration}
                  isPlaying={isPlaying(currentlyPlaying)}
                  onSeek={handleSeek}
                  audioUrl={currentUrl || playingKit.id}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1 md:gap-2">
                {/* Skip Back */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-primary/10"
                  onClick={handleSkipBack}
                  title="Previous track"
                >
                  <SkipBack className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </Button>

                {/* Play/Pause */}
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

                {/* Skip Forward */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-primary/10"
                  onClick={handleSkipForward}
                  title="Next track"
                >
                  <SkipForward className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </Button>

                {/* Volume Control */}
                <div 
                  className="relative hidden md:flex items-center"
                  onMouseEnter={handleVolumeHover}
                  onMouseLeave={handleVolumeLeave}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-primary/10"
                    onClick={toggleMute}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Volume2 className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                  
                  <AnimatePresence>
                    {showVolume && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 80 }}
                        exit={{ opacity: 0, width: 0 }}
                        className="overflow-hidden"
                        onMouseEnter={handleVolumeHover}
                        onMouseLeave={handleVolumeLeave}
                      >
                        <Slider
                          value={[isMuted ? 0 : volume]}
                          max={1}
                          step={0.01}
                          onValueChange={handleVolumeChange}
                          className="w-20"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Close */}
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
