export interface ShowPreview {
  id: string;
  title: string;
  description: string;
  seasons: number;
  image: string;
  genres: number[];
  updated: string;
}

export interface Episode {
  title: string;
  description: string;
  episode: number;
  file: string;
}

export interface Season {
  season: number;
  title: string;
  image: string;
  episodes: Episode[];
}

export interface ShowDetails {
  id: string;
  title: string;
  description: string;
  seasons: Season[];
  image: string;
  genres: number[];
  updated: string;
}

export interface Favourite {
  id: string;
  user_id: string;
  show_id: string;
  show_title: string;
  season_number: number;
  season_title: string | null;
  episode_id: string;
  episode_title: string;
  episode_file: string | null;
  favourited_at: string;
}

export interface ListeningProgress {
  id: string;
  user_id: string;
  show_id: string;
  season_number: number;
  episode_id: string;
  episode_title: string;
  episode_file: string | null;
  playback_position: number;
  duration: number;
  completed: boolean;
  last_played_at: string;
}

export interface CurrentlyPlaying {
  show: ShowPreview | ShowDetails;
  season: Season;
  episode: Episode;
  episodeIndex: number;
}

export const GENRE_MAP: Record<number, string> = {
  1: "Personal Growth",
  2: "True Crime",
  3: "History",
  4: "Comedy",
  5: "Entertainment",
  6: "Business",
  7: "Fiction",
  8: "News",
  9: "Kids & Family",
};

export type SortOption = "a-z" | "z-a" | "date-asc" | "date-desc";
