import { Link } from "react-router-dom";
import { Heart, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Layout } from "@/components/Layout";
import { useFavourites } from "@/hooks/useFavourites";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function FavouritesPage() {
  const { isAuthenticated } = useAuth();
  const { favourites, isLoading } = useFavourites();

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Sign in to see your favourites</h1>
          <p className="text-muted-foreground mb-6">Your favourites sync across all your devices.</p>
          <Link to="/auth"><Button className="gradient-primary">Sign In</Button></Link>
        </div>
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
      <div className="container py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Your Favourites</h1>
          <p className="text-muted-foreground">{favourites.length} episodes saved</p>
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : favourites.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No favourites yet. Start exploring shows!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.values(grouped).map((group, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <h3 className="font-semibold mb-3">{group.showTitle} - Season {group.season}</h3>
                <div className="space-y-2">
                  {group.episodes.map((ep) => (
                    <Link key={ep.id} to={`/show/${ep.show_id}`} className="glass-card p-4 flex justify-between items-center hover:border-primary/30 transition-colors block">
                      <div>
                        <p className="font-medium">{ep.episode_title}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Saved {formatDistanceToNow(new Date(ep.favourited_at), { addSuffix: true })}
                        </p>
                      </div>
                      <Heart className="w-5 h-5 text-primary" fill="currentColor" />
                    </Link>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
