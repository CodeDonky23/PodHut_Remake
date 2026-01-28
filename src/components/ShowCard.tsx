import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Calendar, Play } from "lucide-react";
import type { ShowPreview } from "@/types/podcast";
import { GENRE_MAP } from "@/types/podcast";
import { formatDistanceToNow } from "date-fns";

interface ShowCardProps {
  show: ShowPreview;
  index?: number;
}

// Smooth spring configuration
const springConfig = { stiffness: 300, damping: 25, mass: 0.5 };

export function ShowCard({ show, index = 0 }: ShowCardProps) {
  const genres = show.genres.slice(0, 2).map((id) => GENRE_MAP[id]).filter(Boolean);
  const updatedDate = new Date(show.updated);
  const timeAgo = formatDistanceToNow(updatedDate, { addSuffix: true });

  // 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(y, [-100, 100], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(x, [-100, 100], [-8, 8]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: index * 0.04, 
        duration: 0.5,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      className="h-full perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        rotateX, 
        rotateY,
        transformStyle: "preserve-3d",
      }}
    >
      <Link to={`/show/${show.id}`} className="block h-full">
        <motion.article 
          className="glass-card group overflow-hidden h-full flex flex-col relative"
          whileHover={{ 
            y: -8,
            boxShadow: "0 25px 50px -12px hsl(24 95% 53% / 0.25)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Animated glow border on hover */}
          <motion.div
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none"
            style={{
              background: "linear-gradient(135deg, hsl(24 95% 53% / 0.3) 0%, hsl(38 92% 50% / 0.2) 50%, hsl(24 95% 53% / 0.1) 100%)",
            }}
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          />

          {/* Image container */}
          <div className="relative aspect-square overflow-hidden">
            <motion.img
              src={show.image}
              alt={show.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.12 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              loading="lazy"
            />
            {/* Gradient overlay */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Play button overlay */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center shadow-2xl"
                initial={{ scale: 0.5, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <Play className="w-7 h-7 text-primary-foreground ml-1" fill="currentColor" />
              </motion.div>
            </motion.div>

            {/* Season badge */}
            <motion.div 
              className="absolute top-3 left-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.04 + 0.2 }}
            >
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-black/70 text-white backdrop-blur-md border border-white/10">
                {show.seasons} Season{show.seasons !== 1 ? "s" : ""}
              </span>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-grow relative z-10">
            <motion.h3 
              className="font-semibold line-clamp-2 min-h-[2.5rem]"
              whileHover={{ color: "hsl(24 95% 53%)" }}
              transition={{ duration: 0.2 }}
            >
              {show.title}
            </motion.h3>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>{timeAgo}</span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-1.5 mt-auto pt-3">
              {genres.length > 0 ? (
                genres.map((genre, i) => (
                  <motion.span 
                    key={genre} 
                    className="genre-tag text-[10px]"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.04 + i * 0.05 + 0.3 }}
                  >
                    {genre}
                  </motion.span>
                ))
              ) : (
                <span className="genre-tag text-[10px]">Podcast</span>
              )}
            </div>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  );
}
