import { useApiGet } from "@/components/ApiCall/ApiGet";
import { QUERY_KEYS } from "@/components/constants/QueryKeys/queryKeys";
import { useReportsContext } from "@/components/ContextApi/ReportsProvider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { GetRecenetTransactionsResponse } from "./ReportsTypes";
import { useEffect } from "react";
import { TableSkeleton } from "@/helper/tableSkeleton";

const RecentTransactions = () => {
  // const [searchTerm, setSearchTerm] = useState("");
  // const [dateFrom, setDateFrom] = useState<string | undefined>(undefined);
  // const [dateTo, setDateTo] = useState<string | undefined>(undefined);
  // const [currentPage, setCurrentPage] = useState<number>(0);
  // const [pageSize, setPageSize] = useState<number>(12);
  // const isFirstLoad = useRef(true);

  // const [deboundeSearchTerm] = useDebounce(searchTerm, 400);

  const { globalBranchId, setRecentTransaction } = useReportsContext();

  const {
    data: fetchedRecentTransactions,
    isPending,
    isRefetching,
  } = useApiGet<GetRecenetTransactionsResponse>(
    QUERY_KEYS.GET_REPORTS_RECENT_TRANSACTIONS(
      // globalTimeInterval,
      globalBranchId
    ),
    {
      enabled: !!globalBranchId,
      retry: 0,
      queryParams: {
        // pageNumber: currentPage,
        // limit: pageSize,
        // patientName: deboundeSearchTerm || null,
        // dateFrom: dateFrom || null,
        // dateTo: dateTo || null,
      },
    }
  );

  useEffect(() => {
    if (fetchedRecentTransactions?.data) {
      setRecentTransaction(fetchedRecentTransactions?.data);
    }
  }, [fetchedRecentTransactions, globalBranchId]);

  // const totalPages = Math.ceil(
  //   (fetchedRecentTransactions?.data?.total ?? 0) /
  //     (fetchedRecentTransactions?.data?.limit ?? 1)
  // );
  // const handleNextPage = () => {
  //   if (currentPage < totalPages) {
  //     setCurrentPage(currentPage + 1);
  //   }
  // };

  // const handlePreviousPage = () => {
  //   if (currentPage > 0) {
  //     setCurrentPage(currentPage - 1);
  //   }
  // };

  return (
    <>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Recent Transactions</span>
            </div>
            {/* <div className="flex justify-center gap-4"> */}
            {/* <div className="relative w-54">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name...."
                  value={searchTerm}
                  onChange={(e) => {
                    setCurrentPage(0);
                    setSearchTerm(e.target.value);
                  }}
                  className="pl-10"
                />
              </div> */}
            {/* <DatePicker
                label="Date From"
                date={dateFrom}
                onDateChange={(dateString) => {
                  setCurrentPage(0);
                  setDateFrom(dateString);
                }}
              />
              <DatePicker
                label="Date To"
                date={dateTo}
                onDateChange={(dateString) => {
                  setCurrentPage(0);
                  setDateTo(dateString);
                }}
              /> */}
            {/* </div> */}
            {/* <div className="w-auto sm:w-36 flex justify-end items-center gap-4">
              <span className="text-muted-foreground text-[16px]">
                Showing:
              </span>
              <Select
                value={pageSize !== null ? String(pageSize) : undefined}
                onValueChange={(value) => {
                  setCurrentPage(0);
                  setPageSize(Number(value));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select page size" />
                </SelectTrigger>
                <SelectContent>
                  {PageSizeOptions.map((page) => (
                    <SelectItem key={page.value} value={String(page.value)}>
                      {page.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isPending || isRefetching ? (
            <TableSkeleton rows={2} columns={7} />
          ) : fetchedRecentTransactions?.data?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                      S.No
                    </th>{" "}
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                      Patient
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                      Product
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                      Items
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                      Amount
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                      VAT (13%)
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                      Date
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                      Transaction ID
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {fetchedRecentTransactions?.data?.map(
                    (transaction, index) => (
                      <tr
                        key={index}
                        className="border-b border-border hover:bg-muted/50"
                      >
                        <td className="py-3 px-2 font-medium">
                          {/* {currentPage * pageSize + index + 1} */}
                          {index + 1}
                        </td>
                        <td className="py-3 px-2 font-medium">
                          {transaction?.patientName}
                        </td>
                        <td className="py-3 px-2">
                          <Badge className="bg-accent-foreground text-success-foreground text-sm">
                            {transaction.productNames}
                          </Badge>
                        </td>
                        <td className="py-3 px-2">
                          <Badge variant="outline">
                            {transaction?.itemsCount} items
                          </Badge>
                        </td>
                        <td className="py-3 px-2 font-medium">
                          NPR {transaction?.amount?.toFixed(2)}
                        </td>
                        <td className="py-3 px-2 text-warning font-medium">
                          NPR {transaction?.vat?.toFixed(2)}
                        </td>
                        <td className="py-3 px-2 text-muted-foreground">
                          {new Date(transaction?.date)?.toLocaleDateString(
                            "en-GB"
                          )}
                        </td>
                        <td className="py-3 px-2">
                          <span className="font-mono text-sm">
                            {transaction?.transactionId}
                          </span>
                        </td>
                        {/* <td className="py-3 px-2">
                        <Badge className="bg-success text-success-foreground">
                          Completed
                        </Badge>
                      </td>{" "} */}
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center">No data found</p>
          )}
        </CardContent>
      </Card>

      {/* {(fetchedRecentTransactions?.data?.total ?? 0) > 0 && !isPending && (
        <div className="flex justify-center gap-8 p-3 rounded-md bg-white shadow-md">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
          >
            <ChevronLeft />
          </Button>
          <div className="flex gap-3 ">
            {(totalPages <= 10
              ? Array.from({ length: totalPages }, (_, i) => i)
              : Array.from({ length: totalPages }, (_, i) => i)
                  .filter((page) => {
                    return (
                      page === 0 ||
                      page === totalPages - 1 ||
                      Math.abs(page - currentPage) <= 1
                    );
                  })
                  .reduce<(number | "...")[]>((acc, page, i, arr) => {
                    if (i > 0 && page - (arr[i - 1] as number) > 1) {
                      acc.push("...");
                    }
                    acc.push(page);
                    return acc;
                  }, [])
            ).map((item, index) =>
              item === "..." ? (
                <span key={index} className="px-2 text-gray-500">
                  ...
                </span>
              ) : (
                <Button
                  key={item}
                  size="sm"
                  variant={currentPage === item ? "default" : "outline"}
                  onClick={() => setCurrentPage(item)}
                >
                  {item + 1}
                </Button>
              )
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages - 1}
          >
            <ChevronRight />
          </Button>
        </div>
      )} */}
    </>
  );
};

export default RecentTransactions;
