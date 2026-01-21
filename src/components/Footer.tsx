import { Link } from "react-router-dom";
import { Heart, Github, Twitter } from "lucide-react";
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50 mt-auto">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Logo size="sm" showText />
            <p className="text-sm text-muted-foreground mt-4 max-w-sm">
              Your premium destination for discovering, listening, and tracking your favorite podcasts. 
              All content is free and always will be.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Discover
                </Link>
              </li>
              <li>
                <Link to="/favourites" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Favourites
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-muted-foreground">
                  Podcast data from Netlify API
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  Built with React & TypeScript
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/50 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-primary" fill="currentColor" /> for podcast lovers
          </p>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PodHut. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
