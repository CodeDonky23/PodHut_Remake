import { Header } from "./Header";
import { Footer } from "./Footer";
import { AudioPlayer } from "./AudioPlayer";
import { usePlayer } from "@/contexts/PlayerContext";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { currentlyPlaying } = usePlayer();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className={`pt-20 flex-1 ${currentlyPlaying ? "pb-28" : ""}`}>
        {children}
      </main>
      <Footer />
      <AudioPlayer />
    </div>
  );
}
