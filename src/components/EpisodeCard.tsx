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
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: episodeIndex * 0.03 }}
      className={`glass-card p-4 flex gap-4 group cursor-pointer transition-all duration-200 ${
        isCurrentEpisode ? "border-primary/50 bg-primary/5" : "hover:border-border/80"
      }`}
      onClick={handlePlay}
    >
      {/* Episode Number & Play */}
      <div className="relative shrink-0">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center font-medium transition-all duration-200 ${
            isCurrentEpisode
              ? "gradient-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground"
          }`}
        >
          {isCurrentEpisode && isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </div>
        {isCompleted && (
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="w-3 h-3 text-white" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h4 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
              Episode {episode.episode}: {episode.title}
            </h4>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {episode.description}
            </p>
          </div>

          {isAuthenticated && (
            <button
              onClick={handleToggleFavourite}
              className={`favourite-button shrink-0 ${isFav ? "favourite-button-active" : ""}`}
            >
              <Heart className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Progress bar */}
        {progressPercent > 0 && !isCompleted && (
          <div className="mt-3">
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.article>
  );
}
