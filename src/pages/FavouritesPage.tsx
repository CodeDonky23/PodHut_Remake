import { Link } from "react-router-dom";
import { Heart, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Layout } from "@/components/Layout";
import { PageTransition } from "@/components/PageTransition";
import { useFavourites } from "@/hooks/useFavourites";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function FavouritesPage() {
  const { isAuthenticated } = useAuth();
  const { favourites, isLoading } = useFavourites();

  if (!isAuthenticated) {
    return (
      <Layout>
        <PageTransition>
          <div className="container py-20 text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            </motion.div>
            <motion.h1 
              className="text-2xl font-bold mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Sign in to see your favourites
            </motion.h1>
            <motion.p 
              className="text-muted-foreground mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Your favourites sync across all your devices.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link to="/auth"><Button className="gradient-primary">Sign In</Button></Link>
            </motion.div>
          </div>
        </PageTransition>
      </Layout>
    );
  }

  const grouped = favourites.reduce((acc, fav) => {
    const key = `${fav.show_id}-${fav.season_number}`;
    if (!acc[key]) acc[key] = { showTitle: fav.show_title, season: fav.season_number, seasonTitle: fav.season_title, episodes: [] };
    acc[key].episodes.push(fav);
    return acc;
  }, {} as Record<string, { showTitle: string; season: number; seasonTitle: string | null; episodes: typeof favourites }>);

  return (
    <Layout>
      <PageTransition>
        <div className="container py-8 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold">Your Favourites</h1>
            <p className="text-muted-foreground">{favourites.length} episodes saved</p>
          </motion.div>

          {isLoading ? (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Loading...
            </motion.p>
          ) : favourites.length === 0 ? (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No favourites yet. Start exploring shows!</p>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {Object.values(grouped).map((group, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: i * 0.1 }}
                >
                  <h3 className="font-semibold mb-3">{group.showTitle} - Season {group.season}</h3>
                  <div className="space-y-2">
                    {group.episodes.map((ep, epIndex) => (
                      <motion.div
                        key={ep.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 + epIndex * 0.05 }}
                      >
                        <Link 
                          to={`/show/${ep.show_id}`} 
                          className="glass-card p-4 flex justify-between items-center hover:border-primary/30 transition-all duration-300 block group hover:shadow-md"
                        >
                          <div>
                            <p className="font-medium group-hover:text-primary transition-colors">{ep.episode_title}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Saved {formatDistanceToNow(new Date(ep.favourited_at), { addSuffix: true })}
                            </p>
                          </div>
                          <Heart className="w-5 h-5 text-primary transition-transform group-hover:scale-110" fill="currentColor" />
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </PageTransition>
    </Layout>
  );
}
