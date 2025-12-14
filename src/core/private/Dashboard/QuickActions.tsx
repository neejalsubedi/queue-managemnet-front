import { useDashboardContext } from "@/components/ContextApi/DashboardProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Ban, Package, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const { lowStock, outOfStock } = useDashboardContext();
  const navigate = useNavigate();
  return (
    <>
      <Card
        className="bg-gradient-primary text-primary-foreground shadow-lg"
        onClick={() => navigate("billing")}
      >
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5" />
            <span>Quick Sale</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-primary-foreground/80 mb-4">
            Start a new sale transaction quickly
          </p>
          <button className="bg-primary-foreground text-primary px-4 py-2 rounded-lg font-medium hover:bg-primary-foreground/90 transition-colors">
            New Sale
          </button>
        </CardContent>
      </Card>

      <Card className="bg-gradient-secondary text-secondary-foreground shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Inventory Alert</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            {/* Low Stock Box */}
            <div className="flex items-center gap-3 bg-white border border-yellow-200 text-yellow-800 rounded-lg px-4 py-3 w-full sm:w-1/2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-semibold">
                  {lowStock ?? 0} product{(lowStock ?? 0) !== 1 ? "s" : ""} low
                  on stock
                </p>
                <p className="text-xs text-yellow-800">Reorder soon</p>
              </div>
            </div>

            {/* Out of Stock Box */}
            <div className="flex items-center gap-3 bg-white border border-red-200 text-red-600 rounded-lg px-4 py-3 w-full sm:w-1/2">
              <Ban className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-semibold">
                  {outOfStock ?? 0} product{(outOfStock ?? 0) !== 1 ? "s" : ""}{" "}
                  out of stock
                </p>
                <p className="text-xs text-red-600">Needs urgent restock</p>
              </div>
            </div>
          </div>

          {/* <button className="bg-secondary-foreground text-secondary px-4 py-2 rounded-lg font-medium hover:bg-secondary-foreground/90 transition-colors w-full sm:w-auto">
            View Products
          </button> */}
        </CardContent>
      </Card>
    </>
  );
};

export default QuickActions;
