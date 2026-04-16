import { useGetDashboardDoctorsAtWork } from "@/components/ApiCall/Api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Stethoscope } from "lucide-react";

interface DoctorsAtWorkCardProps {
  clinicId?: string | null;
}

export function DoctorsAtWorkCard({ clinicId }: DoctorsAtWorkCardProps) {
  const { data, isLoading } = useGetDashboardDoctorsAtWork(clinicId);

  const doctorsList = data?.data ?? [];

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Doctors at work</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-24 w-full rounded-md" />
        ) : doctorsList.length === 0 ? (
          <p className="text-sm text-muted-foreground">No doctors at work</p>
        ) : (
          <ul className="space-y-3">
            {doctorsList.map((d) => (
              <li
                key={d.id}
                className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 px-3 py-2 text-sm"
              >
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{d.name}</span>
                  {d.shift ? (
                    <span className="text-xs text-muted-foreground">({d.shift})</span>
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {d.patient_count} patient{d.patient_count !== 1 ? "s" : ""}
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-green-500/15 text-green-700 dark:text-green-400"
                  >
                    {d.status ?? "At Work"}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
