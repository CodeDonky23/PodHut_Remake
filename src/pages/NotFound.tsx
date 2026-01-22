import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Search } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <PageTransition>
        <div className="container min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="mb-8"
            >
              <span className="text-8xl font-bold gradient-text-hero">404</span>
            </motion.div>
            
            <motion.h1 
              className="text-2xl md:text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Page not found
            </motion.h1>
            
            <motion.p 
              className="text-muted-foreground mb-8 max-w-md mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              The page you're looking for doesn't exist or has been moved. Let's get you back on track.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link to="/">
                <Button className="gradient-primary gap-2">
                  <Home className="w-4 h-4" />
                  Go Home
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="gap-2">
                  <Search className="w-4 h-4" />
                  Browse Podcasts
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default NotFound;
