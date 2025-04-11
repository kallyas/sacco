import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "~/services/auth.service";
import { redirect } from "react-router";
import { useToast } from "~/hooks/use-toast";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: authService.getCurrentUser,
    retry: false,
  });

  const logout = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.clear();
      redirect("/login");
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout: logout.mutate,
  };
};
