import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages: (number | "ellipsis")[] = [];
    const showEllipsisStart = currentPage > 3;
    const showEllipsisEnd = currentPage < totalPages - 2;

    // Always show first page
    pages.push(1);

    if (showEllipsisStart) {
      pages.push("ellipsis");
    }

    // Show pages around current
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    if (showEllipsisEnd) {
      pages.push("ellipsis");
    }

    // Always show last page
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <motion.nav
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="flex items-center justify-center gap-2 mt-8"
      aria-label="Pagination"
    >
      {/* Previous Button */}
      <motion.div 
        whileHover={{ scale: 1.1, x: -2 }} 
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-10 w-10 rounded-full border-border/50 hover:border-primary/50 hover:bg-primary/10 disabled:opacity-50 transition-all duration-300"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </motion.div>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {visiblePages.map((page, index) => (
          page === "ellipsis" ? (
            <motion.span 
              key={`ellipsis-${index}`} 
              className="px-2 text-muted-foreground"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <MoreHorizontal className="w-4 h-4" />
            </motion.span>
          ) : (
            <motion.div
              key={page}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, type: "spring", stiffness: 300 }}
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant={currentPage === page ? "default" : "ghost"}
                size="icon"
                onClick={() => onPageChange(page)}
                className={`h-10 w-10 rounded-full font-medium transition-all duration-300 ${
                  currentPage === page
                    ? "gradient-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {currentPage === page && (
                  <motion.div
                    className="absolute inset-0 rounded-full gradient-primary"
                    layoutId="pagination-active"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                <span className="relative z-10">{page}</span>
              </Button>
            </motion.div>
          )
        ))}
      </div>

      {/* Next Button */}
      <motion.div 
        whileHover={{ scale: 1.1, x: 2 }} 
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-10 w-10 rounded-full border-border/50 hover:border-primary/50 hover:bg-primary/10 disabled:opacity-50 transition-all duration-300"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </motion.nav>
  );
}
