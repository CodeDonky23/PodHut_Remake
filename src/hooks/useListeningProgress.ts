import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import type { ListeningProgress } from "@/types/podcast";

export function useListeningProgress() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const progressQuery = useQuery({
    queryKey: ["listening-progress", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("listening_progress")
        .select("*")
        .eq("user_id", user.id)
        .order("last_played_at", { ascending: false });
      
      if (error) throw error;
      return data as ListeningProgress[];
    },
    enabled: !!user,
  });

  const updateProgress = useMutation({
    mutationFn: async (progress: Omit<ListeningProgress, "id" | "user_id" | "last_played_at">) => {
      if (!user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from("listening_progress")
        .upsert({
          ...progress,
          user_id: user.id,
          last_played_at: new Date().toISOString(),
        }, {
          onConflict: "user_id,show_id,season_number,episode_id",
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listening-progress", user?.id] });
    },
  });

  const resetAllProgress = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("listening_progress")
        .delete()
        .eq("user_id", user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listening-progress", user?.id] });
    },
  });

  const getProgress = (showId: string, seasonNumber: number, episodeId: string) => {
    return progressQuery.data?.find(
      (p) => p.show_id === showId && p.season_number === seasonNumber && p.episode_id === episodeId
    );
  };

  const getLastPlayed = () => {
    if (!progressQuery.data?.length) return null;
    return progressQuery.data[0];
  };

  return {
    progress: progressQuery.data ?? [],
    isLoading: progressQuery.isLoading,
    getProgress,
    getLastPlayed,
    updateProgress,
    resetAllProgress,
  };
}
