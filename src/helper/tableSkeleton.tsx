import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 6,
}) => {
  return (
    <div className="w-full border rounded-md overflow-hidden">
      {/* Table Header Skeleton */}
      <div className="grid grid-cols-6 gap-2 bg-muted p-2">
        {Array.from({ length: columns }).map((_, idx) => (
          <Skeleton key={idx} className="h-4 w-full" />
        ))}
      </div>

      {/* Table Row Skeletons */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="grid grid-cols-6 gap-2 items-center p-2 border-t"
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton key={colIdx} className="h-4 w-full" />
          ))}
        </div>
      ))}
    </div>
  );
};
