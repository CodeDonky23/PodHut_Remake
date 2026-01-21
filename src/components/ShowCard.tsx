import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Mic2, Play } from "lucide-react";
import type { ShowPreview } from "@/types/podcast";
import { GENRE_MAP } from "@/types/podcast";
import { formatDistanceToNow } from "date-fns";

interface ShowCardProps {
  show: ShowPreview;
  index?: number;
}

export function ShowCard({ show, index = 0 }: ShowCardProps) {
  const genres = show.genres.slice(0, 2).map((id) => GENRE_MAP[id]).filter(Boolean);
  const updatedDate = new Date(show.updated);
  const timeAgo = formatDistanceToNow(updatedDate, { addSuffix: true });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      className="h-full"
    >
      <Link to={`/show/${show.id}`} className="block h-full">
        <article className="glass-card-hover group overflow-hidden h-full flex flex-col">
          {/* Image container - fixed aspect ratio */}
          <div className="relative aspect-square overflow-hidden">
            <img
              src={show.image}
              alt={show.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <motion.div 
                className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center shadow-xl"
                initial={{ scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Play className="w-6 h-6 text-primary-foreground ml-0.5" fill="currentColor" />
              </motion.div>
            </div>

            {/* Season badge */}
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-black/60 text-white backdrop-blur-sm">
                {show.seasons} Season{show.seasons !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Content - flex-grow to fill remaining space */}
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors min-h-[2.5rem]">
              {show.title}
            </h3>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>{timeAgo}</span>
            </div>

            {/* Genres - pushed to bottom with mt-auto */}
            <div className="flex flex-wrap gap-1.5 mt-auto pt-3">
              {genres.length > 0 ? (
                genres.map((genre) => (
                  <span key={genre} className="genre-tag text-[10px]">
                    {genre}
                  </span>
                ))
              ) : (
                <span className="genre-tag text-[10px]">Podcast</span>
              )}
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
