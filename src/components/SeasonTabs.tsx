import { motion } from "framer-motion";
import type { Season } from "@/types/podcast";

interface SeasonTabsProps {
  seasons: Season[];
  activeSeason: number;
  onSelectSeason: (seasonNumber: number) => void;
}

export function SeasonTabs({ seasons, activeSeason, onSelectSeason }: SeasonTabsProps) {
  const sortedSeasons = [...seasons].sort((a, b) => a.season - b.season);

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
      {sortedSeasons.map((season) => {
        const isActive = season.season === activeSeason;
        
        return (
          <button
            key={season.season}
            onClick={() => onSelectSeason(season.season)}
            className={`relative season-tab shrink-0 ${isActive ? "season-tab-active" : ""}`}
          >
            {isActive && (
              <motion.div
                layoutId="activeSeasonTab"
                className="absolute inset-0 gradient-primary rounded-lg"
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
              />
            )}
            <span className="relative z-10">
              Season {season.season}
            </span>
          </button>
        );
      })}
    </div>
  );
}
