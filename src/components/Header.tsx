import { Link, useLocation } from "react-router-dom";
import { Heart, User, LogOut, Menu, X, Compass } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { user, signOut, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Discover", icon: Compass },
    { to: "/favourites", label: "Favourites", icon: Heart },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.1 }}
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50"
    >
      <div className="container flex items-center justify-between h-18 py-3 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: -2 }} 
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <Logo size="sm" showText />
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-secondary/50 rounded-full px-2 py-1">
          {navLinks.map((link, index) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={link.to}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    active
                      ? "text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-primary rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-medium text-sm shadow-md hover:shadow-lg transition-shadow">
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium truncate">{user?.email}</p>
                  <p className="text-xs text-muted-foreground">Signed in</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/favourites" className="cursor-pointer">
                    <Heart className="w-4 h-4 mr-2" />
                    My Favourites
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button size="sm" className="gradient-primary text-primary-foreground rounded-full px-5 shadow-md hover:shadow-lg transition-shadow">
                Sign In
              </Button>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="icon-button md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 bg-card/95 backdrop-blur-xl"
          >
            <div className="container py-4 px-4 flex flex-col gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive(link.to)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
