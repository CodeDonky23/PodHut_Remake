import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Fuse from "fuse.js";
import { Layout } from "@/components/Layout";
import { PageTransition } from "@/components/PageTransition";
import { ShowCard } from "@/components/ShowCard";
import { ShowCarousel } from "@/components/ShowCarousel";
import { GenreFilter } from "@/components/GenreFilter";
import { SortDropdown } from "@/components/SortDropdown";
import { SearchInput } from "@/components/SearchInput";
import { ContinueListening } from "@/components/ContinueListening";
import { StatsBar } from "@/components/StatsBar";
import { Pagination } from "@/components/Pagination";
import { useShows } from "@/hooks/usePodcasts";
import { GENRE_MAP } from "@/types/podcast";
import type { SortOption, ShowPreview } from "@/types/podcast";
import { Skeleton } from "@/components/ui/skeleton";
import { Headphones, Sparkles } from "lucide-react";

const ITEMS_PER_PAGE = 15;

const Index = () => {
  const { data: shows, isLoading, error } = useShows();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("date-desc");
  const [currentPage, setCurrentPage] = useState(1);

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

  // Reset page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedGenres, sortOption]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredShows.length / ITEMS_PER_PAGE);
  const paginatedShows = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredShows.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredShows, currentPage]);

  const featuredShows = useMemo(() => shows?.slice(0, 8) ?? [], [shows]);
  const totalGenres = Object.keys(GENRE_MAP).length;

  const toggleGenre = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId) ? prev.filter((id) => id !== genreId) : [...prev, genreId]
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of grid smoothly
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  if (error) {
    return (
      <Layout>
        <PageTransition>
          <div className="container py-20 text-center">
            <p className="text-destructive">Failed to load podcasts. Please try again.</p>
          </div>
        </PageTransition>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageTransition>
        <div className="container py-8 space-y-10">
          {/* Hero */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-center py-8"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Discover Amazing Podcasts</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Welcome to <span className="gradient-text-hero">PodHut</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              Your premium destination for discovering, listening, and tracking your favorite podcasts.
            </p>

            {/* Stats */}
            {!isLoading && shows && (
              <StatsBar totalShows={shows.length} totalGenres={totalGenres} />
            )}
          </motion.section>

          {/* Continue Listening */}
          <ContinueListening />

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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Headphones className="w-5 h-5 text-primary" />
                {searchQuery || selectedGenres.length > 0 ? `${filteredShows.length} Results` : "All Shows"}
              </h2>
              {filteredShows.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages} • {filteredShows.length} podcast{filteredShows.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="glass-card overflow-hidden">
                    <Skeleton className="aspect-square w-full" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-5 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredShows.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Headphones className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No podcasts found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </motion.div>
            ) : (
              <>
                <motion.div 
                  key={currentPage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 auto-rows-fr"
                >
                  {paginatedShows.map((show, index) => (
                    <ShowCard key={show.id} show={show} index={index} />
                  ))}
                </motion.div>

                {/* Pagination */}
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </section>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default Index;
