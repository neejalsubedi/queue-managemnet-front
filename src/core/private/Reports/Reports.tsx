import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Download,
  DollarSign,
  TrendingUp,
  FileText,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBranches } from "@/hooks/useBranches";
import { useApiGet } from "@/components/ApiCall/ApiGet";
import { QUERY_KEYS } from "@/components/constants/QueryKeys/queryKeys";
import { GetReportsHeaderDataResponse, TimeIntervalType } from "./ReportsTypes";
import TopSellingProducts from "./TopSellingProducts";
import { useReportsContext } from "@/components/ContextApi/ReportsProvider";
import TopCustomers from "./TopCustomers";
import RecentTransactions from "./RecentTransactions";
import { useApiMutation } from "@/components/ApiCall/ApiMutation";
import { API_ENDPOINTS } from "@/components/constants/ApiEndpoints/apiEndpoints";
import { downloadBlobResponse } from "@/helper/downloadBlobResponse";

export default function Reports() {
  // const [selectedPeriod, setSelectedPeriod] = useState(TimeIntervalType.Daily);
  // const [branch, setBranch] = useState<number | null>(null);

  const { branches, branchLoading } = useBranches();
  const {
    globalBranchId,
    setGlobalBranchId,
    globalTimeInterval,
    setGlobalTimeInterval,
  } = useReportsContext();

  useEffect(() => {
    if (branches.length > 0 && globalBranchId === null) {
      setGlobalBranchId(branches[0].value);
    }
  }, [branches]);

  const isQueryEnabled = globalBranchId !== null;

  const { data: fetchedHeaderData } = useApiGet<GetReportsHeaderDataResponse>(
    QUERY_KEYS.GET_REPORTS_HEADER_DATA(globalTimeInterval, globalBranchId),
    {
      enabled: isQueryEnabled,
      retry: 0,
    }
  );

  const { mutate: exportPdfApi, isPending: pendingPdf } = useApiMutation(
    "post",
    API_ENDPOINTS.REPORTS.EXPORT_PDF_REPORT(globalTimeInterval, globalBranchId),
    { responseType: "blob" }
  );

  const getPeriodLabel = () => {
    switch (globalTimeInterval) {
      case TimeIntervalType.Daily:
        return "Today";
      case TimeIntervalType.Weekly:
        return "This Week";
      case TimeIntervalType.Monthly:
        return "This Month";
      case TimeIntervalType.Yearly:
        return "This Year";
      default:
        return "Today";
    }
  };

  const handleExportReport = () => {
    exportPdfApi(undefined, {
      onSuccess: (resp) => {
        // resp.data is Blob / ArrayBuffer depending on server/axios
        downloadBlobResponse(resp, "report.pdf", "application/pdf");
      },
    });
  };

  const salesData = [
    {
      title: `${getPeriodLabel()} Sales`,
      value: `NPR ${Math.round(fetchedHeaderData?.data?.todaySales ?? 0)}`,
      icon: DollarSign,
    },
    {
      title: "VAT Collected (13%)",
      value: `NPR ${Math.round(fetchedHeaderData?.data?.vatCollected ?? 0)}`,
      icon: FileText,
    },
    {
      title: "Transactions",
      value: `${fetchedHeaderData?.data?.transactionCount}`,
      icon: BarChart3,
    },
    {
      title: "Avg. Transaction",
      value: `NPR ${Math.round(
        fetchedHeaderData?.data?.averageTransaction ?? 0
      )}`,
      icon: TrendingUp,
    },
  ];

  // const getCurrentData = () => {
  //   return salesData[globalTimeInterval as keyof typeof salesData];
  // };

  // const currentData = getCurrentData();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground mt-2">
            Nepal VAT compliant reporting and business insights
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Select
            value={globalBranchId !== null ? String(globalBranchId) : undefined}
            onValueChange={(value) => setGlobalBranchId(Number(value))}
            disabled={branchLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              {branches.map((branch) => (
                <SelectItem key={branch.value} value={String(branch.value)}>
                  {branch.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={globalTimeInterval}
            onValueChange={(value) =>
              setGlobalTimeInterval(value as TimeIntervalType)
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(TimeIntervalType).map(([key, value]) => (
                <SelectItem key={value} value={value}>
                  {key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            className="bg-gradient-primary shadow-md hover:shadow-lg transition-all"
            onClick={handleExportReport}
            disabled={pendingPdf}
          >
            <Download className="h-4 w-4 mr-2" />
            {!pendingPdf ? "Export" : "Exporting..."}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div
        id="report-content"
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {salesData?.map((stat) => {
          const IconComponent = stat.icon;

          return (
            <Card key={stat.title} className="bg-gradient-card shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    {/* <p className="text-sm text-success">
                  {currentData?.growth} from last period
                </p> */}
                  </div>
                  <div className="p-2 bg-primary-light rounded-lg">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* <Card className="bg-gradient-card shadow-md"></Card>

        <Card className="bg-gradient-card shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  VAT Collected (13%)
                </p>
                <p className="text-2xl font-bold text-warning">
                  NPR {Math.round(fetchedHeaderData?.data?.vatCollected ?? 0)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Government tax collected
                </p>
              </div>
              <div className="p-2 bg-warning-light rounded-lg">
                <FileText className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="text-2xl font-bold text-foreground">
                  {fetchedHeaderData?.data?.transactionCount}
                </p>
                <p className="text-sm text-muted-foreground">
                  Total sales count
                </p>
              </div>
              <div className="p-2 bg-success-light rounded-lg">
                <BarChart3 className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Avg. Transaction
                </p>
                <p className="text-2xl font-bold text-foreground">
                  NPR{" "}
                  {Math.round(fetchedHeaderData?.data?.averageTransaction ?? 0)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Per sale average
                </p>
              </div>
              <div className="p-2 bg-secondary-light rounded-lg">
                <TrendingUp className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* Report Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <TopSellingProducts />

        {/* Top Patients */}
        <TopCustomers />
      </div>

      {/* Recent Transactions */}
      <div>
        <RecentTransactions />
      </div>

      {/* VAT Summary */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>VAT Summary - Nepal Tax Compliance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-warning-light">
              <div className="text-2xl font-bold text-warning">13%</div>
              <div className="text-sm text-warning/80">Standard VAT Rate</div>
            </div>

            <div className="text-center p-4 rounded-lg bg-success-light">
              <div className="text-2xl font-bold text-success">
                NPR {fetchedHeaderData?.data?.vatCollected.toLocaleString()}
              </div>
              <div className="text-sm text-success/80">
                VAT Collected {getPeriodLabel()}
              </div>
            </div>

            <div className="text-center p-4 rounded-lg bg-primary-light">
              <div className="text-2xl font-bold text-primary">
                NPR{" "}
                {(
                  (fetchedHeaderData?.data?.todaySales ?? 0) -
                  (fetchedHeaderData?.data?.vatCollected ?? 0)
                ).toLocaleString()}
              </div>
              <div className="text-sm text-primary/80">
                Net Sales {getPeriodLabel()}
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">VAT Compliance Notes:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                • All transactions include 13% VAT as per Nepal Tax regulations
              </li>
              <li>
                • VAT collection reports are ready for submission to Inland
                Revenue Department
              </li>
              <li>
                • System maintains detailed transaction records for audit
                purposes
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
