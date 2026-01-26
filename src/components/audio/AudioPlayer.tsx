import { useRef, useState, useEffect, createContext, useContext, useCallback } from 'react';
import { sampleKits } from '@/data/sampleKits';

// Playlist order - kits with audio previews, sorted by release (array order in sampleKits)
const getPlaylist = () => sampleKits.filter(kit => kit.audioPreviewUrl);

interface AudioContextType {
  currentlyPlaying: string | null;
  currentUrl: string | null;
  play: (id: string, url: string) => void;
  pause: () => void;
  isPlaying: (id: string) => boolean;
  progress: number;
  duration: number;
  seek: (percentage: number) => void;
  playNext: () => void;
  playPrevious: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Single persistent audio element
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playNext = useCallback(() => {
    const playlist = getPlaylist();
    if (!currentlyPlaying) return;
    
    const currentIndex = playlist.findIndex(kit => kit.id === currentlyPlaying);
    const nextIndex = (currentIndex + 1) % playlist.length;
    const nextKit = playlist[nextIndex];
    
    if (nextKit && nextKit.audioPreviewUrl) {
      const audio = audioRef.current;
      if (audio) {
        audio.src = nextKit.audioPreviewUrl;
        audio.play().catch(console.error);
        setCurrentlyPlaying(nextKit.id);
        setCurrentUrl(nextKit.audioPreviewUrl);
        setProgress(0);
      }
    }
  }, [currentlyPlaying]);

  const playPrevious = useCallback(() => {
    const playlist = getPlaylist();
    if (!currentlyPlaying) return;
    
    const currentIndex = playlist.findIndex(kit => kit.id === currentlyPlaying);
    const prevIndex = currentIndex <= 0 ? playlist.length - 1 : currentIndex - 1;
    const prevKit = playlist[prevIndex];
    
    if (prevKit && prevKit.audioPreviewUrl) {
      const audio = audioRef.current;
      if (audio) {
        audio.src = prevKit.audioPreviewUrl;
        audio.play().catch(console.error);
        setCurrentlyPlaying(prevKit.id);
        setCurrentUrl(prevKit.audioPreviewUrl);
        setProgress(0);
      }
    }
  }, [currentlyPlaying]);

  // Create audio element on mount
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.preload = 'auto';
    
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Handle track ended - play next
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handleEnded = () => {
      playNext();
    };
    
    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [playNext]);

  const play = useCallback((id: string, url: string) => {
    const audio = audioRef.current;
    if (!audio) return;

    // If clicking the same track that's playing, toggle pause
    if (currentlyPlaying === id && !audio.paused) {
      audio.pause();
      setCurrentlyPlaying(null);
      return;
    }

    // If same track but paused, resume
    if (currentlyPlaying === id && currentUrl === url) {
      audio.play().catch(console.error);
      setCurrentlyPlaying(id);
      return;
    }

    // New track - load and play
    audio.src = url;
    audio.play().catch(console.error);
    setCurrentlyPlaying(id);
    setCurrentUrl(url);
    setProgress(0);
  }, [currentlyPlaying, currentUrl]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
    }
    setCurrentlyPlaying(null);
  }, []);

  const isPlaying = useCallback((id: string) => {
    const audio = audioRef.current;
    return currentlyPlaying === id && audio && !audio.paused;
  }, [currentlyPlaying]);

  const seek = useCallback((percentage: number) => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      audio.currentTime = percentage * audio.duration;
    }
  }, []);

  return (
    <AudioContext.Provider value={{ 
      currentlyPlaying,
      currentUrl,
      play, 
      pause, 
      isPlaying, 
      progress, 
      duration,
      seek,
      playNext,
      playPrevious,
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
