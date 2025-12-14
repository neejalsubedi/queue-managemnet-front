import { apiService } from "@/api";
import { toast } from "@/hooks/use-toast";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse, AxiosRequestConfig } from "axios";

interface SuccessResponse<T = any> {
  message: string;
  data?: T;
}

type ResponseMode = "json" | "blob" | "arraybuffer";

interface UseApiMutationOptions {
  params?: Record<string, any>;
  responseType?: ResponseMode; // default "json"
}

/**
 * Return type:
 * - AxiosResponse<any> because we may return SuccessResponse<TJsonData> or Blob or ArrayBuffer
 * - AxiosError for errors
 * - TData is the request body type
 */
export function useApiMutation<
  TData = any,
  TJsonData = any
>(
  method: "post" | "put" | "delete",
  endpoint: string,
  options?: UseApiMutationOptions
): UseMutationResult<AxiosResponse<any>, AxiosError, TData, unknown> {
  const { params, responseType = "json" } = options ?? {};

  const buildConfig = (): AxiosRequestConfig => {
    if (responseType === "blob" || responseType === "arraybuffer") {
      return { params, responseType: responseType as "blob" | "arraybuffer" };
    }
    return { params };
  };

  const mutation = useMutation<AxiosResponse<any>, AxiosError, TData>({
    mutationKey: [method, endpoint, params, responseType],
    mutationFn: (data?: TData) => {
      const cfg = buildConfig();
      switch (method) {
        case "post":
          return apiService.post(endpoint, data, cfg);
        case "put":
          return apiService.put(endpoint, data, cfg);
        case "delete":
          // allow passing id in body or call endpoint directly
          if ((data as any)?.id) {
            return apiService.delete(`${endpoint}/${(data as any).id}`, cfg);
          }
          return apiService.delete(endpoint, cfg);
        default:
          throw new Error("Unsupported method");
      }
    },
    onSuccess: (response) => {
      if (responseType === "json") {
        const res = response.data as SuccessResponse<TJsonData> | undefined;
        toast({
          title: "Success",
          description: res?.message ?? "Operation successful",
        });
      }
      // caller handles binary responses
    },
    onError: (error) => {
      const msg = (error?.response?.data as any)?.message ?? error.message ?? "Something went wrong";
      toast({
        variant: "destructive",
        title: "Error",
        description: msg,
      });
    },
  });

  return mutation;
}
