import { useQuery } from "@tanstack/react-query";
import type { ShowPreview, ShowDetails } from "@/types/podcast";

const API_BASE = "https://podcast-api.netlify.app";

export function useShows() {
  return useQuery<ShowPreview[]>({
    queryKey: ["shows"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/shows`);
      if (!response.ok) throw new Error("Failed to fetch shows");
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useShow(id: string | undefined) {
  return useQuery<ShowDetails>({
    queryKey: ["show", id],
    queryFn: async () => {
      if (!id) throw new Error("No show ID provided");
      const response = await fetch(`${API_BASE}/id/${id}`);
      if (!response.ok) throw new Error("Failed to fetch show details");
      return response.json();
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
