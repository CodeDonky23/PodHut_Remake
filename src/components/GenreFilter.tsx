import { motion } from "framer-motion";
import { GENRE_MAP } from "@/types/podcast";

interface GenreFilterProps {
  selectedGenres: number[];
  onToggleGenre: (genreId: number) => void;
}

export function GenreFilter({ selectedGenres, onToggleGenre }: GenreFilterProps) {
  const genres = Object.entries(GENRE_MAP);

  return (
    <div className="flex flex-wrap gap-2">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          // Clear all selections
          selectedGenres.forEach((id) => onToggleGenre(id));
        }}
        className={`genre-tag ${selectedGenres.length === 0 ? "genre-tag-active" : ""}`}
      >
        All
      </motion.button>
      
      {genres.map(([id, name]) => {
        const genreId = parseInt(id);
        const isSelected = selectedGenres.includes(genreId);
        
        return (
          <motion.button
            key={id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggleGenre(genreId)}
            className={`genre-tag ${isSelected ? "genre-tag-active" : ""}`}
          >
            {name}
          </motion.button>
        );
      })}
    </div>
  );
}
