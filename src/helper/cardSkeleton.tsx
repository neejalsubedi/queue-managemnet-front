import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const CardSkeleton = () => (
  <Card className="bg-gradient-card shadow-md">
    <CardHeader className="pb-3">
      <div className="flex justify-between items-start">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-4 w-1/6" />
      </div>
      <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-8" />
      </div>
    </CardHeader>
    <CardContent className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex justify-between">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
      <Skeleton className="h-4 w-full" />
      <div className="grid grid-cols-4 gap-3 pt-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-8 col-span-1" />
        ))}
      </div>
    </CardContent>
  </Card>
);
