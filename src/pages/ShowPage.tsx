import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Mic2 } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Layout } from "@/components/Layout";
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
        <div className="container py-20 text-center">
          <p className="text-destructive">Failed to load show. Please try again.</p>
          <Link to="/" className="text-primary mt-4 inline-block">Go back home</Link>
        </div>
      </Layout>
    );
  }

  if (isLoading || !show) {
    return (
      <Layout>
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
      </Layout>
    );
  }

  const currentSeason = show.seasons.find((s) => s.season === activeSeason) || show.seasons[0];
  const genres = show.genres.map((id) => GENRE_MAP[id]).filter(Boolean);
  const updatedDate = new Date(show.updated);

  return (
    <Layout>
      <div className="container py-8 space-y-8">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to shows
        </Link>

        {/* Show Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row gap-8">
          <img src={show.image} alt={show.title} className="w-full md:w-72 aspect-square object-cover rounded-xl shadow-lg shrink-0" />
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold">{show.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Mic2 className="w-4 h-4" />{show.seasons.length} Seasons</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />Updated {formatDistanceToNow(updatedDate, { addSuffix: true })}</span>
            </div>
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => <span key={genre} className="genre-tag">{genre}</span>)}
              </div>
            )}
            <p className="text-muted-foreground leading-relaxed">{show.description}</p>
          </div>
        </motion.div>

        {/* Season Tabs */}
        <SeasonTabs seasons={show.seasons} activeSeason={activeSeason} onSelectSeason={setActiveSeason} />

        {/* Current Season Info */}
        <div className="flex items-center gap-4">
          <img src={currentSeason.image} alt={currentSeason.title} className="w-16 h-16 rounded-lg object-cover" />
          <div>
            <h2 className="font-semibold">{currentSeason.title}</h2>
            <p className="text-sm text-muted-foreground">{currentSeason.episodes.length} episodes</p>
          </div>
        </div>

        {/* Episodes */}
        <div className="space-y-3">
          {currentSeason.episodes.map((episode, index) => (
            <EpisodeCard key={`${currentSeason.season}-${episode.episode}`} episode={episode} season={currentSeason} show={show} episodeIndex={index} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
