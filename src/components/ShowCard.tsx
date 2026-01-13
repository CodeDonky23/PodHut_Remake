import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Mic2 } from "lucide-react";
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
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link to={`/show/${show.id}`}>
        <article className="glass-card-hover group overflow-hidden">
          <div className="relative aspect-square overflow-hidden">
            <img
              src={show.image}
              alt={show.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Play overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                <Mic2 className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {show.title}
            </h3>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Mic2 className="w-3.5 h-3.5" />
                {show.seasons} season{show.seasons !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {timeAgo}
              </span>
            </div>

            {genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {genres.map((genre) => (
                  <span key={genre} className="genre-tag text-[10px]">
                    {genre}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
