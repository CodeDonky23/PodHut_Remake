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
    <section className="relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="flex gap-2">
          <button onClick={() => scroll("left")} className="carousel-nav">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={() => scroll("right")} className="carousel-nav">
            <ChevronRight className="w-5 h-5" />
          </button>
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="shrink-0 w-[280px] sm:w-[320px]"
            style={{ scrollSnapAlign: "start" }}
          >
            <Link to={`/show/${show.id}`}>
              <article className="glass-card-hover overflow-hidden group">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={show.image}
                    alt={show.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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

                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center shadow-lg">
                      <Play className="w-4 h-4 text-primary-foreground ml-0.5" />
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
