import { useRef, useState, useEffect, createContext, useContext, useCallback } from 'react';

interface AudioContextType {
  currentlyPlaying: string | null;
  currentUrl: string | null;
  play: (id: string, url: string) => void;
  pause: () => void;
  isPlaying: (id: string) => boolean;
  progress: number;
  duration: number;
  seek: (percentage: number) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Single persistent audio element
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create audio element on mount
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.preload = 'auto';
    
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    };
    
    const handleEnded = () => {
      setCurrentlyPlaying(null);
      setProgress(0);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.pause();
      audio.src = '';
    };
  }, []);

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
      seek
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
