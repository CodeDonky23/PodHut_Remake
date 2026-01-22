import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Mic2 } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Layout } from "@/components/Layout";
import { PageTransition } from "@/components/PageTransition";
import { SeasonTabs } from "@/components/SeasonTabs";
import { EpisodeCard } from "@/components/EpisodeCard";
import { useShow } from "@/hooks/usePodcasts";
import { GENRE_MAP } from "@/types/podcast";
import { Skeleton } from "@/components/ui/skeleton";

export default function ShowPage() {
  const { id } = useParams<{ id: string }>();
  const { data: show, isLoading, error } = useShow(id);
  const [activeSeason, setActiveSeason] = useState(1);

  if (error) {
    return (
      <Layout>
        <PageTransition>
          <div className="container py-20 text-center">
            <p className="text-destructive">Failed to load show. Please try again.</p>
            <Link to="/" className="text-primary mt-4 inline-block">Go back home</Link>
          </div>
        </PageTransition>
      </Layout>
    );
  }

  if (isLoading || !show) {
    return (
      <Layout>
        <PageTransition>
          <div className="container py-8 space-y-6">
            <Skeleton className="h-8 w-32" />
            <div className="flex flex-col md:flex-row gap-8">
              <Skeleton className="w-full md:w-72 aspect-square rounded-xl shrink-0" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </div>
        </PageTransition>
      </Layout>
    );
  }

  const currentSeason = show.seasons.find((s) => s.season === activeSeason) || show.seasons[0];
  const genres = show.genres.map((id) => GENRE_MAP[id]).filter(Boolean);
  const updatedDate = new Date(show.updated);

  return (
    <Layout>
      <PageTransition>
        <div className="container py-8 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to shows
            </Link>
          </motion.div>

          {/* Show Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row gap-8"
          >
            <motion.img 
              src={show.image} 
              alt={show.title} 
              className="w-full md:w-72 aspect-square object-cover rounded-xl shadow-lg shrink-0"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            />
            <div className="flex-1 space-y-4">
              <motion.h1 
                className="text-3xl md:text-4xl font-bold"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                {show.title}
              </motion.h1>
              <motion.div 
                className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <span className="flex items-center gap-1"><Mic2 className="w-4 h-4" />{show.seasons.length} Seasons</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />Updated {formatDistanceToNow(updatedDate, { addSuffix: true })}</span>
              </motion.div>
              {genres.length > 0 && (
                <motion.div 
                  className="flex flex-wrap gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                >
                  {genres.map((genre, i) => (
                    <motion.span 
                      key={genre} 
                      className="genre-tag"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.05 }}
                    >
                      {genre}
                    </motion.span>
                  ))}
                </motion.div>
              )}
              <motion.p 
                className="text-muted-foreground leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
              >
                {show.description}
              </motion.p>
            </div>
          </motion.div>

          {/* Season Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <SeasonTabs seasons={show.seasons} activeSeason={activeSeason} onSelectSeason={setActiveSeason} />
          </motion.div>

          {/* Current Season Info */}
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.65 }}
          >
            <img src={currentSeason.image} alt={currentSeason.title} className="w-16 h-16 rounded-lg object-cover" />
            <div>
              <h2 className="font-semibold">{currentSeason.title}</h2>
              <p className="text-sm text-muted-foreground">{currentSeason.episodes.length} episodes</p>
            </div>
          </motion.div>

          {/* Episodes */}
          <div className="space-y-3">
            {currentSeason.episodes.map((episode, index) => (
              <motion.div
                key={`${currentSeason.season}-${episode.episode}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.03 }}
              >
                <EpisodeCard episode={episode} season={currentSeason} show={show} episodeIndex={index} />
              </motion.div>
            ))}
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
}
