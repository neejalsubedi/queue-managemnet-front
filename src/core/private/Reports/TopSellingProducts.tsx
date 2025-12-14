import { useApiGet } from "@/components/ApiCall/ApiGet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import { GetTopSellingProductsResponse } from "./ReportsTypes";
import { QUERY_KEYS } from "@/components/constants/QueryKeys/queryKeys";
import { useReportsContext } from "@/components/ContextApi/ReportsProvider";
import { useEffect } from "react";
import { CardSkeleton } from "@/helper/cardSkeleton";

const TopSellingProducts = () => {
  const { globalBranchId, globalTimeInterval, setTopSellingProductData } =
    useReportsContext();

  const { data: fetchedTopSellingProducts, isPending } =
    useApiGet<GetTopSellingProductsResponse>(
      QUERY_KEYS.GET_REPORTS_TOP_SELLING_PRODUCTS(
        globalTimeInterval,
        globalBranchId
      ),
      {
        retry: 0,
        enabled: !!globalBranchId,
      }
    );

  useEffect(() => {
    if (fetchedTopSellingProducts?.data) {
      setTopSellingProductData(fetchedTopSellingProducts?.data);
    }
  }, [fetchedTopSellingProducts, globalTimeInterval, globalBranchId]);

  // if (isPending) return <LoadingData />;

  // if (!fetchedTopSellingProducts?.data?.length) {
  //   return (
  //     <Card className="shadow-md p-4">
  //       <p className="text-muted-foreground">No data found</p>
  //     </Card>
  //   );
  // }

  return (
    <>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Top Selling Products</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isPending ? (
            [...Array(1)].map((_, i) => <CardSkeleton key={i} />)
          ) : fetchedTopSellingProducts?.data?.length ? (
            <div className="space-y-3">
              {fetchedTopSellingProducts?.data.map((product, index) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product?.quantitySold} units sold
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      NPR {product?.totalRevenue.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center">No data found</p>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default TopSellingProducts;
