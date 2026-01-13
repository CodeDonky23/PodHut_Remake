import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Fuse from "fuse.js";
import { Layout } from "@/components/Layout";
import { ShowCard } from "@/components/ShowCard";
import { ShowCarousel } from "@/components/ShowCarousel";
import { GenreFilter } from "@/components/GenreFilter";
import { SortDropdown } from "@/components/SortDropdown";
import { SearchInput } from "@/components/SearchInput";
import { useShows } from "@/hooks/usePodcasts";
import type { SortOption, ShowPreview } from "@/types/podcast";
import { Skeleton } from "@/components/ui/skeleton";
import { Headphones } from "lucide-react";

const Index = () => {
  const { data: shows, isLoading, error } = useShows();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("date-desc");

  const fuse = useMemo(() => {
    if (!shows) return null;
    return new Fuse(shows, { keys: ["title", "description"], threshold: 0.4 });
  }, [shows]);

  const filteredShows = useMemo(() => {
    if (!shows) return [];
    let result: ShowPreview[] = shows;

    if (searchQuery && fuse) {
      result = fuse.search(searchQuery).map((r) => r.item);
    }

    if (selectedGenres.length > 0) {
      result = result.filter((show) => show.genres.some((g) => selectedGenres.includes(g)));
    }

    result = [...result].sort((a, b) => {
      switch (sortOption) {
        case "a-z": return a.title.localeCompare(b.title);
        case "z-a": return b.title.localeCompare(a.title);
        case "date-desc": return new Date(b.updated).getTime() - new Date(a.updated).getTime();
        case "date-asc": return new Date(a.updated).getTime() - new Date(b.updated).getTime();
        default: return 0;
      }
    });

    return result;
  }, [shows, searchQuery, selectedGenres, sortOption, fuse]);

  const featuredShows = useMemo(() => shows?.slice(0, 8) ?? [], [shows]);

  const toggleGenre = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId) ? prev.filter((id) => id !== genreId) : [...prev, genreId]
    );
  };

  if (error) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <p className="text-destructive">Failed to load podcasts. Please try again.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 space-y-10">
        {/* Hero */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Headphones className="w-4 h-4" />
            <span>Discover Amazing Podcasts</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to <span className="gradient-text">PodHut</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Your premium destination for discovering, listening, and tracking your favorite podcasts.
          </p>
        </motion.section>

        {/* Featured Carousel */}
        {isLoading ? (
          <div className="flex gap-4 overflow-hidden">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="w-[320px] h-[200px] shrink-0 rounded-xl" />)}
          </div>
        ) : (
          <ShowCarousel shows={featuredShows} title="Featured Shows" />
        )}

        {/* Search & Filters */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1"><SearchInput value={searchQuery} onChange={setSearchQuery} /></div>
            <SortDropdown value={sortOption} onChange={setSortOption} />
          </div>
          <GenreFilter selectedGenres={selectedGenres} onToggleGenre={toggleGenre} />
        </section>

        {/* Shows Grid */}
        <section>
          <h2 className="text-xl font-bold mb-6">
            {searchQuery || selectedGenres.length > 0 ? `${filteredShows.length} Results` : "All Shows"}
          </h2>
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="glass-card p-4 space-y-3">
                  <Skeleton className="aspect-square w-full rounded-lg" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredShows.map((show, index) => <ShowCard key={show.id} show={show} index={index} />)}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Index;
