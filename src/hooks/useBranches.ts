import { useApiGet } from "@/components/ApiCall/ApiGet";
import { QUERY_KEYS } from "@/components/constants/QueryKeys/queryKeys";
import { useMemo } from "react";

type BranchOption = { value: number; label: string };
export interface BranchResponse {
  label: string;
  value: string;
}

export interface BranchResponseBody {
  data: BranchResponse[];
  statusCode: number;
  message: string;
}

export const useBranches = (): {
  branches: BranchOption[];
  branchLoading: boolean;
  branchPending: boolean;
} => {
  const {
    data,
    isPending: branchPending,
    isLoading: branchLoading,
  } = useApiGet<{ data: BranchResponse[] }>(QUERY_KEYS.GET_BRANCH_DROPDOWN, {
    retry: 1,
  });

  const branches = useMemo(() => {
    return (data?.data || []).map((branch) => ({
      value: Number(branch.value),
      label: branch.label,
    }));
  }, [data]);

  return { branches, branchLoading, branchPending };
};
