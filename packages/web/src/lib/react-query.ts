// src/lib/react-query.ts
import { QueryClient } from "@tanstack/react-query";
import { handleApiError } from "./trpc-error-handler";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
    },
    mutations: {
      onError: (error) => handleApiError(error),
    },
  },
});

export default queryClient;
