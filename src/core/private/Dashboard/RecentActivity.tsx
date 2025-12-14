import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RecentActivity = () => {
  return (
    <>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                action: "Sale completed",
                patient: "Ram Sharma",
                amount: "NPR 1,250",
                time: "5 minutes ago",
              },
              {
                action: "Product added",
                item: "Paracetamol 500mg",
                quantity: "100 units",
                time: "12 minutes ago",
              },
              {
                action: "Low stock alert",
                item: "Amoxicillin 250mg",
                quantity: "5 units left",
                time: "1 hour ago",
              },
              {
                action: "New patient",
                patient: "Sita Poudel",
                phone: "9841234567",
                time: "2 hours ago",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {activity.action}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.patient && `Patient: ${activity.patient}`}
                    {activity.item && `Item: ${activity.item}`}
                    {activity.phone && `Phone: ${activity.phone}`}
                    {activity.amount && ` • Amount: ${activity.amount}`}
                    {activity.quantity && ` • ${activity.quantity}`}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default RecentActivity;
