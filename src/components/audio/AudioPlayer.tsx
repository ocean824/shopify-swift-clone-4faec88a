import { useRef, useState, useEffect, createContext, useContext } from 'react';

interface AudioContextType {
  currentlyPlaying: string | null;
  play: (id: string, url: string) => void;
  pause: () => void;
  isPlaying: (id: string) => boolean;
  progress: number;
  duration: number;
  seek: (percentage: number) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    audio.addEventListener('timeupdate', () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    });

    audio.addEventListener('ended', () => {
      setCurrentlyPlaying(null);
      setProgress(0);
    });

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const play = (id: string, url: string) => {
    if (!audioRef.current) return;

    if (currentlyPlaying === id) {
      audioRef.current.pause();
      setCurrentlyPlaying(null);
      return;
    }

    if (currentUrl !== url) {
      audioRef.current.src = url;
      setCurrentUrl(url);
    }

    audioRef.current.play().catch(console.error);
    setCurrentlyPlaying(id);
  };

  const pause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setCurrentlyPlaying(null);
  };

  const isPlaying = (id: string) => currentlyPlaying === id;

  const seek = (percentage: number) => {
    if (!audioRef.current || !audioRef.current.duration) return;
    audioRef.current.currentTime = percentage * audioRef.current.duration;
  };

  return (
    <AudioContext.Provider value={{ 
      currentlyPlaying, 
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
