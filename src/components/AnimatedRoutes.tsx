import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "@/pages/Index";
import ShowPage from "@/pages/ShowPage";
import AuthPage from "@/pages/AuthPage";
import FavouritesPage from "@/pages/FavouritesPage";
import NotFound from "@/pages/NotFound";

export function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/show/:id" element={<ShowPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/favourites" element={<FavouritesPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}
