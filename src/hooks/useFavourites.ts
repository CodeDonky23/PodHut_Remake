import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface Favourite {
  id: string;
  user_id: string;
  show_id: string;
  show_title: string;
  season_number: number;
  season_title: string | null;
  episode_id: string;
  episode_title: string;
  episode_file: string | null;
  favourited_at: string;
}

export function useFavourites() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const favouritesQuery = useQuery({
    queryKey: ["favourites", user?.id],
    queryFn: async (): Promise<Favourite[]> => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("favourites")
        .select("*")
        .eq("user_id", user.id)
        .order("favourited_at", { ascending: false });
      
      if (error) throw error;
      return data as Favourite[];
    },
    enabled: !!user,
  });

  const addFavourite = useMutation({
    mutationFn: async (favourite: Omit<Favourite, "id" | "user_id" | "favourited_at">) => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("favourites")
        .insert({ ...favourite, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favourites", user?.id] }),
  });

  const removeFavourite = useMutation({
    mutationFn: async (params: { showId: string; seasonNumber: number; episodeId: string }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("favourites")
        .delete()
        .eq("user_id", user.id)
        .eq("show_id", params.showId)
        .eq("season_number", params.seasonNumber)
        .eq("episode_id", params.episodeId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favourites", user?.id] }),
  });

  const isFavourite = (showId: string, seasonNumber: number, episodeId: string) => {
    return favouritesQuery.data?.some(
      (f) => f.show_id === showId && f.season_number === seasonNumber && f.episode_id === episodeId
    ) ?? false;
  };

  const toggleFavourite = async (
    showId: string, showTitle: string, seasonNumber: number, seasonTitle: string | null,
    episodeId: string, episodeTitle: string, episodeFile: string | null
  ) => {
    if (isFavourite(showId, seasonNumber, episodeId)) {
      await removeFavourite.mutateAsync({ showId, seasonNumber, episodeId });
    } else {
      await addFavourite.mutateAsync({
        show_id: showId, show_title: showTitle, season_number: seasonNumber,
        season_title: seasonTitle, episode_id: episodeId, episode_title: episodeTitle,
        episode_file: episodeFile,
      });
    }
  };

  return { favourites: favouritesQuery.data ?? [], isLoading: favouritesQuery.isLoading, isFavourite, toggleFavourite };
}
