import { motion, AnimatePresence } from "framer-motion";
import { GENRE_MAP } from "@/types/podcast";

interface GenreFilterProps {
  selectedGenres: number[];
  onToggleGenre: (genreId: number) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.03 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  show: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: "spring" as const, stiffness: 200, damping: 15 }
  }
};

export function GenreFilter({ selectedGenres, onToggleGenre }: GenreFilterProps) {
  const genres = Object.entries(GENRE_MAP);

  return (
    <motion.div 
      className="flex flex-wrap gap-2"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.button
        variants={itemVariants}
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        onClick={() => {
          selectedGenres.forEach((id) => onToggleGenre(id));
        }}
        className={`genre-tag relative overflow-hidden ${selectedGenres.length === 0 ? "genre-tag-active" : ""}`}
      >
        <AnimatePresence>
          {selectedGenres.length === 0 && (
            <motion.span
              className="absolute inset-0 gradient-primary rounded-full"
              layoutId="genre-active-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          )}
        </AnimatePresence>
        <span className="relative z-10">All</span>
      </motion.button>
      
      {genres.map(([id, name]) => {
        const genreId = parseInt(id);
        const isSelected = selectedGenres.includes(genreId);
        
        return (
          <motion.button
            key={id}
            variants={itemVariants}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            onClick={() => onToggleGenre(genreId)}
            className={`genre-tag relative overflow-hidden ${isSelected ? "genre-tag-active" : ""}`}
          >
            <AnimatePresence>
              {isSelected && (
                <motion.span
                  className="absolute inset-0 gradient-primary rounded-full"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                />
              )}
            </AnimatePresence>
            <span className="relative z-10">{name}</span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
