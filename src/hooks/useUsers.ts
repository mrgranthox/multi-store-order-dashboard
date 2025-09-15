import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "../services/api";
import { User, PaginatedResponse, FilterOptions, ApiResponse } from "../types";

// --- Fetch users ---
export const useUsers = (filters?: FilterOptions) => {
  return useQuery<PaginatedResponse<User>, Error>({
    queryKey: ["users", filters],
    queryFn: () => apiService.getUsers(filters),
  });
};

// --- Create user ---
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<User>, Error, Partial<User>>({
    mutationFn: (data: Partial<User>) => apiService.createUser(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
};

// --- Update user ---
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<User>, Error, { id: string; data: Partial<User> }>({
    mutationFn: ({ id, data }) => apiService.updateUser(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
};

// --- Delete user ---
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, Error, string>({
    mutationFn: (id: string) => apiService.deleteUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
};
