import { motion } from "framer-motion";
import { Headphones, Mic2, Users, TrendingUp } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  delay?: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay,
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const
    }
  })
};

function StatCard({ icon, value, label, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      custom={delay}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ 
        scale: 1.05, 
        y: -5,
        transition: { duration: 0.2 }
      }}
      className="glass-card p-4 text-center cursor-default hover:border-primary/30 transition-colors duration-300"
    >
      <motion.div 
        className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2"
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.div>
      <motion.p 
        className="text-2xl font-bold gradient-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.2 }}
      >
        {value}
      </motion.p>
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
    <motion.div 
      className="grid grid-cols-2 md:grid-cols-4 gap-3"
      initial="hidden"
      animate="visible"
    >
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
    </motion.div>
  );
}
