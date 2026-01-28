import { usePlayer } from "@/contexts/PlayerContext";
import { useFavourites } from "@/hooks/useFavourites";
import { useAuth } from "@/hooks/useAuth";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Heart,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import { Slider } from "@/components/ui/slider";

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function AudioPlayer() {
  const {
    currentlyPlaying,
    isPlaying,
    currentTime,
    duration,
    volume,
    pause,
    resume,
    seek,
    setVolume,
    skipForward,
    skipBackward,
    nextEpisode,
    previousEpisode,
  } = usePlayer();

  const { isAuthenticated } = useAuth();
  const { isFavourite, toggleFavourite } = useFavourites();
  const [expanded, setExpanded] = useState(false);
  const [showVolume, setShowVolume] = useState(false);

  const handleProgressChange = useCallback(
    (value: number[]) => {
      seek(value[0]);
    },
    [seek]
  );

  const handleVolumeChange = useCallback(
    (value: number[]) => {
      setVolume(value[0]);
    },
    [setVolume]
  );

  if (!currentlyPlaying) return null;

  const { show, season, episode } = currentlyPlaying;
  const episodeId = `${season.season}-${episode.episode}`;
  const isFav = isAuthenticated && isFavourite(show.id, season.season, episodeId);
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleToggleFavourite = () => {
    if (!isAuthenticated) return;
    toggleFavourite(
      show.id,
      show.title,
      season.season,
      season.title,
      episodeId,
      episode.title,
      episode.file
    );
  };

  return (
    <motion.div
      className="player-bar"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      {/* Progress bar at top */}
      <div className="h-1 bg-secondary overflow-hidden">
        <motion.div
          className="h-full gradient-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>

      <div className="container px-4">
        {/* Compact Player */}
        <div className="flex items-center gap-4 h-20">
          {/* Episode Info */}
          <motion.div 
            className="flex items-center gap-3 flex-1 min-w-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <motion.img
              src={season.image || ('image' in show ? show.image : '')}
              alt={episode.title}
              className="w-12 h-12 rounded-lg object-cover shrink-0"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <div className="min-w-0">
              <p className="font-medium text-sm line-clamp-1">{episode.title}</p>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {show.title} • S{season.season}
              </p>
            </div>
          </motion.div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <motion.button
              onClick={skipBackward}
              className="icon-button hidden sm:flex"
              title="Back 15 seconds"
              whileHover={{ scale: 1.15, rotate: -10 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <RotateCcw className="w-5 h-5" />
            </motion.button>

            <motion.button 
              onClick={previousEpisode} 
              className="icon-button hidden sm:flex"
              whileHover={{ scale: 1.15, x: -3 }}
              whileTap={{ scale: 0.9 }}
            >
              <SkipBack className="w-5 h-5" />
            </motion.button>

            <motion.button
              onClick={isPlaying ? pause : resume}
              className="play-button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <AnimatePresence mode="wait">
                {isPlaying ? (
                  <motion.div
                    key="pause"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 90 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Pause className="w-5 h-5 text-primary-foreground" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="play"
                    initial={{ scale: 0, rotate: 90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: -90 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.button 
              onClick={nextEpisode} 
              className="icon-button hidden sm:flex"
              whileHover={{ scale: 1.15, x: 3 }}
              whileTap={{ scale: 0.9 }}
            >
              <SkipForward className="w-5 h-5" />
            </motion.button>

            <motion.button
              onClick={skipForward}
              className="icon-button hidden sm:flex"
              title="Forward 15 seconds"
              whileHover={{ scale: 1.15, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <RotateCw className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Time & Actions */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="hidden sm:block">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            {/* Volume */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setShowVolume(!showVolume)}
                className="icon-button"
              >
                {volume === 0 ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>

              <AnimatePresence>
                {showVolume && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 glass-card"
                  >
                    <Slider
                      value={[volume]}
                      onValueChange={handleVolumeChange}
                      max={1}
                      step={0.01}
                      className="w-24"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Favourite */}
            {isAuthenticated && (
              <motion.button
                onClick={handleToggleFavourite}
                className={`favourite-button ${isFav ? "favourite-button-active" : ""}`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.85 }}
                animate={isFav ? { scale: [1, 1.3, 1] } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Heart className="w-5 h-5" />
              </motion.button>
            )}

            {/* Expand */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="icon-button"
            >
              {expanded ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronUp className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Expanded View */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pb-4"
            >
              <div className="pt-2">
                <Slider
                  value={[currentTime]}
                  onValueChange={handleProgressChange}
                  max={duration || 100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Mobile Controls */}
              <div className="flex items-center justify-center gap-4 mt-4 sm:hidden">
                <button onClick={skipBackward} className="icon-button">
                  <RotateCcw className="w-6 h-6" />
                </button>
                <button onClick={previousEpisode} className="icon-button">
                  <SkipBack className="w-6 h-6" />
                </button>
                <button onClick={nextEpisode} className="icon-button">
                  <SkipForward className="w-6 h-6" />
                </button>
                <button onClick={skipForward} className="icon-button">
                  <RotateCw className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
