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
  registerAudio: (id: string, audioRef: HTMLAudioElement) => void;
  unregisterAudio: (id: string) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map());

  // Pause all other audio elements when one starts playing
  const pauseAllExcept = useCallback((exceptId: string) => {
    audioElementsRef.current.forEach((audio, id) => {
      if (id !== exceptId && !audio.paused) {
        audio.pause();
      }
    });
  }, []);

  const registerAudio = useCallback((id: string, audioRef: HTMLAudioElement) => {
    audioElementsRef.current.set(id, audioRef);
    
    // Add play event listener to auto-pause others
    const handlePlay = () => {
      pauseAllExcept(id);
      setCurrentlyPlaying(id);
    };
    
    const handlePause = () => {
      if (currentlyPlaying === id) {
        setCurrentlyPlaying(null);
      }
    };
    
    const handleEnded = () => {
      if (currentlyPlaying === id) {
        setCurrentlyPlaying(null);
        setProgress(0);
      }
    };
    
    const handleTimeUpdate = () => {
      if (currentlyPlaying === id) {
        setProgress(audioRef.currentTime);
        setDuration(audioRef.duration || 0);
      }
    };
    
    audioRef.addEventListener('play', handlePlay);
    audioRef.addEventListener('pause', handlePause);
    audioRef.addEventListener('ended', handleEnded);
    audioRef.addEventListener('timeupdate', handleTimeUpdate);
    
    return () => {
      audioRef.removeEventListener('play', handlePlay);
      audioRef.removeEventListener('pause', handlePause);
      audioRef.removeEventListener('ended', handleEnded);
      audioRef.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [currentlyPlaying, pauseAllExcept]);

  const unregisterAudio = useCallback((id: string) => {
    audioElementsRef.current.delete(id);
  }, []);

  const play = useCallback((id: string, url: string) => {
    // Pause all other audio first
    pauseAllExcept(id);
    
    const audio = audioElementsRef.current.get(id);
    if (!audio) return;

    if (currentlyPlaying === id) {
      audio.pause();
      setCurrentlyPlaying(null);
      return;
    }

    if (audio.src !== url) {
      audio.src = url;
    }

    audio.play().catch(console.error);
    setCurrentlyPlaying(id);
    setCurrentUrl(url);
  }, [currentlyPlaying, pauseAllExcept]);

  const pause = useCallback(() => {
    if (currentlyPlaying) {
      const audio = audioElementsRef.current.get(currentlyPlaying);
      if (audio) {
        audio.pause();
      }
    }
    setCurrentlyPlaying(null);
  }, [currentlyPlaying]);

  const isPlaying = useCallback((id: string) => currentlyPlaying === id, [currentlyPlaying]);

  const seek = useCallback((percentage: number) => {
    if (!currentlyPlaying) return;
    const audio = audioElementsRef.current.get(currentlyPlaying);
    if (audio && audio.duration) {
      audio.currentTime = percentage * audio.duration;
    }
  }, [currentlyPlaying]);

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
      registerAudio,
      unregisterAudio
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
