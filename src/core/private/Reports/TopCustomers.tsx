import { useApiGet } from "@/components/ApiCall/ApiGet";
import { QUERY_KEYS } from "@/components/constants/QueryKeys/queryKeys";
import { useReportsContext } from "@/components/ContextApi/ReportsProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { GetTopCustomersResponse } from "./ReportsTypes";
import { useEffect } from "react";
import { CardSkeleton } from "@/helper/cardSkeleton";

const TopCustomers = () => {
  const { globalBranchId, globalTimeInterval, setTopCustomersData } =
    useReportsContext();

  const { data: fetchedTopCustomers, isPending } =
    useApiGet<GetTopCustomersResponse>(
      QUERY_KEYS.GET_REPORTS_TOP_CUSTOMERS(globalTimeInterval, globalBranchId),
      {
        retry: 0,
        enabled: !!globalBranchId,
      }
    );

  useEffect(() => {
    if (fetchedTopCustomers?.data) {
      setTopCustomersData(fetchedTopCustomers?.data);
    }
  }, [fetchedTopCustomers, globalTimeInterval, globalBranchId]);

  return (
    <>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Top Customers</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isPending ? (
            [...Array(1)].map((_, i) => <CardSkeleton key={i} />)
          ) : fetchedTopCustomers?.data?.length ? (
            <div className="space-y-3">
              {fetchedTopCustomers?.data?.map((patient, index) => (
                <div
                  key={patient?.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{patient.fullName}</p>
                      <p className="text-sm text-muted-foreground">
                        {patient?.totalVisit} purchases
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      NPR {patient?.totalAmount?.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Total spent</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center">No data found</p>
          )}
        </CardContent>
      </Card>{" "}
    </>
  );
};

export default TopCustomers;
