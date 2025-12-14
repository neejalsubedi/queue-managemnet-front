import { useState, useCallback } from 'react';
import { useApiGet } from './ApiGet';

interface UsePaginatedApiGetOptions {
  endpoint: string | string[];
  initialPageSize?: number;
  enabled?: boolean;
  queryParams?: Record<string, any>;
  disableSearch?: boolean;
  refetchOnMount?: boolean;
}

export function usePaginatedApiGet<T = any>({
  endpoint,
  initialPageSize = 15,
  enabled = true,
  queryParams: extraQueryParams = {},
  disableSearch = false,
  refetchOnMount = false,
}: UsePaginatedApiGetOptions) {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [searchText, setSearchText] = useState('');

  const queryParams = {
    page: pageIndex + 1,
    limit: pageSize,
    ...(disableSearch ? {} : { search: searchText }),
    ...extraQueryParams,
  };

  const { data, isLoading, isRefetching, refetch, isPending } = useApiGet<T>(
    endpoint,
    {
      queryParams,
      enabled,
      staleTime: 0,
      refetchOnMount,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
    }
  );

  const getData = useCallback(
    async (
      incomingPageIndex: number,
      incomingPageSize: number,
      incomingSearch: string = ''
    ) => {
      setPageIndex(incomingPageIndex);
      setPageSize(incomingPageSize);
      setSearchText(incomingSearch);

      return {
        rows: (data as any)?.data?.data ?? [],
        total: (data as any)?.data?.total ?? 0,
      };
    },
    [data]
  );

  return {
    getData,
    pageIndex,
    pageSize,
    searchText,
    setPageIndex,
    setPageSize,
    setSearchText,
    isLoading,
    isRefetching,
    isPending,
    refetch,
  };
}
