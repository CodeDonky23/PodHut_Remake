import { motion } from "framer-motion";
import { Headphones, Mic2, Users, TrendingUp } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  delay?: number;
}

function StatCard({ icon, value, label, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card p-4 text-center"
    >
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
        {icon}
      </div>
      <p className="text-2xl font-bold gradient-text">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </motion.div>
  );
}

interface StatsBarProps {
  totalShows: number;
  totalGenres: number;
}

export function StatsBar({ totalShows, totalGenres }: StatsBarProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <StatCard
        icon={<Mic2 className="w-5 h-5 text-primary" />}
        value={totalShows}
        label="Podcasts"
        delay={0}
      />
      <StatCard
        icon={<Headphones className="w-5 h-5 text-primary" />}
        value="∞"
        label="Hours of Content"
        delay={0.1}
      />
      <StatCard
        icon={<TrendingUp className="w-5 h-5 text-primary" />}
        value={totalGenres}
        label="Genres"
        delay={0.2}
      />
      <StatCard
        icon={<Users className="w-5 h-5 text-primary" />}
        value="Free"
        label="Always Free"
        delay={0.3}
      />
    </div>
  );
}
