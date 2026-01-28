import { Play, Pause, Heart, Check } from "lucide-react";
import { motion } from "framer-motion";
import type { Episode, Season, ShowDetails } from "@/types/podcast";
import { usePlayer } from "@/contexts/PlayerContext";
import { useFavourites } from "@/hooks/useFavourites";
import { useListeningProgress } from "@/hooks/useListeningProgress";
import { useAuth } from "@/hooks/useAuth";

interface EpisodeCardProps {
  episode: Episode;
  season: Season;
  show: ShowDetails;
  episodeIndex: number;
}

export function EpisodeCard({ episode, season, show, episodeIndex }: EpisodeCardProps) {
  const { currentlyPlaying, isPlaying, play, pause, resume } = usePlayer();
  const { isAuthenticated } = useAuth();
  const { isFavourite, toggleFavourite } = useFavourites();
  const { getProgress } = useListeningProgress();

  const episodeId = `${season.season}-${episode.episode}`;
  const isCurrentEpisode =
    currentlyPlaying?.show.id === show.id &&
    currentlyPlaying?.season.season === season.season &&
    currentlyPlaying?.episode.episode === episode.episode;

  const isFav = isAuthenticated && isFavourite(show.id, season.season, episodeId);
  const progress = getProgress(show.id, season.season, episodeId);
  const progressPercent = progress && progress.duration > 0 
    ? (progress.playback_position / progress.duration) * 100 
    : 0;
  const isCompleted = progress?.completed ?? false;

  const handlePlay = () => {
    if (isCurrentEpisode) {
      if (isPlaying) {
        pause();
      } else {
        resume();
      }
    } else {
      play(show, season, episode, episodeIndex);
    }
  };

  const handleToggleFavourite = (e: React.MouseEvent) => {
    e.stopPropagation();
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
    <motion.article
      initial={{ opacity: 0, x: -30, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ 
        delay: episodeIndex * 0.05,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={{ 
        x: 8,
        backgroundColor: "hsl(var(--card))",
        borderColor: "hsl(var(--primary) / 0.3)",
        boxShadow: "0 10px 40px -15px hsl(var(--primary) / 0.2)"
      }}
      whileTap={{ scale: 0.98 }}
      className={`glass-card p-4 flex gap-4 group cursor-pointer ${
        isCurrentEpisode ? "border-primary/50 bg-primary/5" : ""
      }`}
      onClick={handlePlay}
    >
      {/* Episode Number & Play */}
      <div className="relative shrink-0">
        <motion.div
          className={`w-12 h-12 rounded-lg flex items-center justify-center font-medium ${
            isCurrentEpisode
              ? "gradient-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground"
          }`}
          whileHover={{ 
            scale: 1.1,
            backgroundColor: "hsl(var(--primary))",
            color: "hsl(var(--primary-foreground))"
          }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          <motion.div
            animate={isCurrentEpisode && isPlaying ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.5, repeat: isCurrentEpisode && isPlaying ? Infinity : 0 }}
          >
            {isCurrentEpisode && isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </motion.div>
        </motion.div>
        {isCompleted && (
          <motion.div 
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <Check className="w-3 h-3 text-white" />
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <motion.h4 
              className="font-medium line-clamp-1 transition-colors"
              whileHover={{ color: "hsl(var(--primary))" }}
            >
              Episode {episode.episode}: {episode.title}
            </motion.h4>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {episode.description}
            </p>
          </div>

          {isAuthenticated && (
            <motion.button
              onClick={handleToggleFavourite}
              className={`favourite-button shrink-0 ${isFav ? "favourite-button-active" : ""}`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.85 }}
              animate={isFav ? { scale: [1, 1.3, 1] } : {}}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Heart className="w-5 h-5" />
            </motion.button>
          )}
        </div>

        {/* Progress bar */}
        {progressPercent > 0 && !isCompleted && (
          <motion.div 
            className="mt-3"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.2 }}
            style={{ originX: 0 }}
          >
            <div className="progress-track">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        )}
      </div>
    </motion.article>
  );
}
