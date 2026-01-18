import { apiService } from "@/api";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { type AxiosRequestConfig } from "axios";

interface UseGetApiConfig<TData = unknown> {
  queryParams?: Record<string, any>;
  enabled?: boolean;
  axiosConfig?: AxiosRequestConfig;
  responseType?: AxiosRequestConfig["responseType"];
  staleTime?: number;
  refetchOnMount?: boolean;
  refetchOnWindowFocus?: boolean;
  refetchOnReconnect?: boolean;
  select?: UseQueryOptions<TData, Error>["select"];
  retry?: UseQueryOptions<TData, Error>["retry"];
}

export const useApiGet = <T>(
  endpoint: string | string[],
  config?: UseGetApiConfig<T>
) => {
  const {
    queryParams,
    enabled = true,
    axiosConfig,
    responseType,
    staleTime = 0,
    refetchOnMount = false,
    refetchOnWindowFocus = false,
    refetchOnReconnect = false,
    select,
    retry,
  } = config || {};

  const queryKey = queryParams
    ? [
        Array.isArray(endpoint) ? endpoint[0] : endpoint,
        JSON.stringify(queryParams),
      ]
    : [Array.isArray(endpoint) ? endpoint[0] : endpoint];

  const options: UseQueryOptions<T, Error, T, typeof queryKey> = {
    queryKey,
    enabled,
    staleTime,
    refetchOnMount,
    refetchOnWindowFocus,
    refetchOnReconnect,
    select,
    retry,
    queryFn: async () => {
      const finalAxiosConfig: AxiosRequestConfig = {
        ...(axiosConfig || {}),
        ...(responseType ? { responseType } : {}),
        params: queryParams,
      };

      const response = await apiService.get<T>(
        Array.isArray(endpoint) ? endpoint[0] : endpoint,
        finalAxiosConfig
      );

      return response.data;
    },
  };

  return useQuery(options);
};
