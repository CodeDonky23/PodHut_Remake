import { motion } from "framer-motion";
import { Play, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useListeningProgress } from "@/hooks/useListeningProgress";
import { useAuth } from "@/hooks/useAuth";

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function ContinueListening() {
  const { isAuthenticated } = useAuth();
  const { progress, isLoading } = useListeningProgress();

  // Filter to get only incomplete episodes
  const inProgressEpisodes = progress
    .filter((p) => !p.completed && p.playback_position > 10)
    .slice(0, 4);

  if (!isAuthenticated || isLoading || inProgressEpisodes.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold">Continue Listening</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {inProgressEpisodes.map((ep, index) => {
          const progressPercent = ep.duration > 0 ? (ep.playback_position / ep.duration) * 100 : 0;
          const remainingTime = ep.duration - ep.playback_position;

          return (
            <motion.div
              key={ep.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/show/${ep.show_id}`}>
                <article className="glass-card-hover p-4 group">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Play className="w-5 h-5 text-primary-foreground ml-0.5" fill="currentColor" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                        {ep.episode_title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Season {ep.season_number}
                      </p>
                      <p className="text-xs text-primary mt-1">
                        {formatTime(remainingTime)} left
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </article>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
