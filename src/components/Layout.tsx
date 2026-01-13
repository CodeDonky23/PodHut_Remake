import { Header } from "./Header";
import { AudioPlayer } from "./AudioPlayer";
import { usePlayer } from "@/contexts/PlayerContext";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { currentlyPlaying } = usePlayer();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className={`pt-16 ${currentlyPlaying ? "pb-28" : "pb-8"}`}>
        {children}
      </main>
      <AudioPlayer />
    </div>
  );
}
