import { motion } from "framer-motion";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ size = "md", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className="flex items-center gap-2.5">
      <motion.div
        className={`${sizeClasses[size]} relative`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Main logo shape */}
        <div className="absolute inset-0 rounded-xl gradient-primary shadow-lg" />
        
        {/* Inner glow */}
        <div className="absolute inset-0.5 rounded-[10px] bg-gradient-to-br from-white/20 to-transparent" />
        
        {/* Headphone icon */}
        <svg
          viewBox="0 0 40 40"
          fill="none"
          className="absolute inset-0 w-full h-full p-2"
        >
          {/* Headband */}
          <path
            d="M8 22C8 14.268 14.268 8 22 8C29.732 8 36 14.268 36 22"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity="0.9"
          />
          {/* Left ear cup */}
          <rect
            x="5"
            y="20"
            width="8"
            height="12"
            rx="3"
            fill="white"
            opacity="0.95"
          />
          {/* Right ear cup */}
          <rect
            x="31"
            y="20"
            width="8"
            height="12"
            rx="3"
            fill="white"
            opacity="0.95"
          />
          {/* Play symbol in center */}
          <path
            d="M19 17L26 22L19 27V17Z"
            fill="white"
            opacity="0.9"
          />
        </svg>
      </motion.div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-bold ${textSizes[size]} gradient-text tracking-tight`}>
            PodHut
          </span>
          <span className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">
            Premium Podcasts
          </span>
        </div>
      )}
    </div>
  );
}
