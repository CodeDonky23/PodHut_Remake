import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from "react";
import type { CurrentlyPlaying, Episode, Season, ShowPreview, ShowDetails } from "@/types/podcast";
import { useListeningProgress } from "@/hooks/useListeningProgress";
import { useAuth } from "@/hooks/useAuth";

interface PlayerContextType {
  currentlyPlaying: CurrentlyPlaying | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  play: (show: ShowPreview | ShowDetails, season: Season, episode: Episode, episodeIndex: number) => void;
  pause: () => void;
  resume: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  skipForward: () => void;
  skipBackward: () => void;
  nextEpisode: () => void;
  previousEpisode: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<CurrentlyPlaying | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { updateProgress } = useListeningProgress();
  const { user } = useAuth();

  // Warn before closing tab if audio is playing
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isPlaying) {
        e.preventDefault();
        e.returnValue = "You have audio playing. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isPlaying]);

  // Save progress periodically
  useEffect(() => {
    if (!currentlyPlaying || !user) return;

    const saveProgress = () => {
      if (!audioRef.current) return;
      
      const { show, season, episode } = currentlyPlaying;
      const episodeId = `${season.season}-${episode.episode}`;
      
      updateProgress.mutate({
        show_id: show.id,
        season_number: season.season,
        episode_id: episodeId,
        episode_title: episode.title,
        episode_file: episode.file,
        playback_position: audioRef.current.currentTime,
        duration: audioRef.current.duration || 0,
        completed: audioRef.current.currentTime >= (audioRef.current.duration - 10),
      });
    };

    const interval = setInterval(saveProgress, 10000); // Save every 10 seconds
    return () => clearInterval(interval);
  }, [currentlyPlaying, user, updateProgress]);

  const play = useCallback((
    show: ShowPreview | ShowDetails,
    season: Season,
    episode: Episode,
    episodeIndex: number
  ) => {
    setCurrentlyPlaying({ show, season, episode, episodeIndex });
    if (audioRef.current) {
      audioRef.current.src = episode.file;
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const resume = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const setVolume = useCallback((vol: number) => {
    if (audioRef.current) {
      audioRef.current.volume = vol;
      setVolumeState(vol);
    }
  }, []);

  const skipForward = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 15, audioRef.current.duration);
    }
  }, []);

  const skipBackward = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 15, 0);
    }
  }, []);

  const nextEpisode = useCallback(() => {
    if (!currentlyPlaying) return;
    const { season, episodeIndex } = currentlyPlaying;
    if (episodeIndex < season.episodes.length - 1) {
      const nextEp = season.episodes[episodeIndex + 1];
      play(currentlyPlaying.show, season, nextEp, episodeIndex + 1);
    }
  }, [currentlyPlaying, play]);

  const previousEpisode = useCallback(() => {
    if (!currentlyPlaying) return;
    const { season, episodeIndex } = currentlyPlaying;
    if (episodeIndex > 0) {
      const prevEp = season.episodes[episodeIndex - 1];
      play(currentlyPlaying.show, season, prevEp, episodeIndex - 1);
    }
  }, [currentlyPlaying, play]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    nextEpisode();
  }, [nextEpisode]);

  return (
    <PlayerContext.Provider
      value={{
        currentlyPlaying,
        isPlaying,
        currentTime,
        duration,
        volume,
        play,
        pause,
        resume,
        seek,
        setVolume,
        skipForward,
        skipBackward,
        nextEpisode,
        previousEpisode,
        audioRef,
      }}
    >
      {children}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}
