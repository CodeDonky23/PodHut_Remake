import { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import type { ShowPreview } from "@/types/podcast";

interface ShowCarouselProps {
  shows: ShowPreview[];
  title: string;
}

export function ShowCarousel({ shows, title }: ShowCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (!shows.length) return null;

  return (
    <motion.section 
      className="relative"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
    >
      <div className="flex items-center justify-between mb-4">
        <motion.h2 
          className="text-xl font-bold"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {title}
        </motion.h2>
        <div className="flex gap-2">
          <motion.button 
            onClick={() => scroll("left")} 
            className="carousel-nav"
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          <motion.button 
            onClick={() => scroll("right")} 
            className="carousel-nav"
            whileHover={{ scale: 1.1, x: 2 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 -mx-4 px-4"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {shows.map((show, index) => (
          <motion.div
            key={show.id}
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
              delay: index * 0.08,
              type: "spring",
              stiffness: 100,
              damping: 12
            }}
            whileHover={{ y: -8 }}
            className="shrink-0 w-[280px] sm:w-[320px]"
            style={{ scrollSnapAlign: "start" }}
          >
            <Link to={`/show/${show.id}`}>
              <motion.article 
                className="glass-card overflow-hidden group"
                whileHover={{ 
                  boxShadow: "0 25px 50px -12px hsl(24 95% 53% / 0.25)",
                  borderColor: "hsl(var(--primary) / 0.3)"
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <motion.img
                    src={show.image}
                    alt={show.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-semibold text-white line-clamp-1 mb-1">
                      {show.title}
                    </h3>
                    <p className="text-sm text-white/70">
                      {show.seasons} season{show.seasons !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <motion.div 
                    className="absolute top-4 right-4"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                  >
                    <motion.div 
                      className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center shadow-xl"
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                      <Play className="w-5 h-5 text-primary-foreground ml-0.5" fill="currentColor" />
                    </motion.div>
                  </motion.div>
                </div>
              </motion.article>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
