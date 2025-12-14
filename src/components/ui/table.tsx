// import * as React from "react"

// import { cn } from "@/lib/utils"

// const Table = React.forwardRef<
//   HTMLTableElement,
//   React.HTMLAttributes<HTMLTableElement>
// >(({ className, ...props }, ref) => (
//   <div className="relative w-full overflow-auto">
//     <table
//       ref={ref}
//       className={cn("w-full caption-bottom text-sm", className)}
//       {...props}
//     />
//   </div>
// ))
// Table.displayName = "Table"
// const TableHeader = React.forwardRef<
//   HTMLTableSectionElement,
//   React.HTMLAttributes<HTMLTableSectionElement>
// >(({ className, ...props }, ref) => (
//   <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
// ))
// TableHeader.displayName = "TableHeader"

// const TableBody = React.forwardRef<
//   HTMLTableSectionElement,
//   React.HTMLAttributes<HTMLTableSectionElement>
// >(({ className, ...props }, ref) => (
//   <tbody
//     ref={ref}
//     className={cn("[&_tr:last-child]:border-0", className)}
//     {...props}
//   />
// ))
// TableBody.displayName = "TableBody"

// const TableFooter = React.forwardRef<
//   HTMLTableSectionElement,
//   React.HTMLAttributes<HTMLTableSectionElement>
// >(({ className, ...props }, ref) => (
//   <tfoot
//     ref={ref}
//     className={cn(
//       "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
//       className
//     )}
//     {...props}
//   />
// ))
// TableFooter.displayName = "TableFooter"

// const TableRow = React.forwardRef<
//   HTMLTableRowElement,
//   React.HTMLAttributes<HTMLTableRowElement>
// >(({ className, ...props }, ref) => (
//   <tr
//     ref={ref}
//     className={cn(
//       "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
//       className
//     )}
//     {...props}
//   />
// ))
// TableRow.displayName = "TableRow"

// const TableHead = React.forwardRef<
//   HTMLTableCellElement,
//   React.ThHTMLAttributes<HTMLTableCellElement>
// >(({ className, ...props }, ref) => (
//   <th
//     ref={ref}
//     className={cn(
//       "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
//       className
//     )}
//     {...props}
//   />
// ))
// TableHead.displayName = "TableHead"

// const TableCell = React.forwardRef<
//   HTMLTableCellElement,
//   React.TdHTMLAttributes<HTMLTableCellElement>
// >(({ className, ...props }, ref) => (
//   <td
//     ref={ref}
//     className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
//     {...props}
//   />
// ))
// TableCell.displayName = "TableCell"

// const TableCaption = React.forwardRef<
//   HTMLTableCaptionElement,
//   React.HTMLAttributes<HTMLTableCaptionElement>
// >(({ className, ...props }, ref) => (
//   <caption
//     ref={ref}
//     className={cn("mt-4 text-sm text-muted-foreground", className)}
//     {...props}
//   />
// ))
// TableCaption.displayName = "TableCaption"

// export {
//   Table,
//   TableHeader,
//   TableBody,
//   TableFooter,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableCaption,
// }
import React, { useEffect, useMemo, useState } from "react";
import { FaShieldAlt } from "react-icons/fa";
import {
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
  FiEdit,
  FiEye,
  FiNavigation2,
  FiTrash2,
} from "react-icons/fi";
import { ImCross } from "react-icons/im";

import ConfirmModal from "./ConfirmModal";

import { COLORS } from "./Theme";
import { Input } from "./input";
import { useIsMobile } from "@/hooks/use-mobile";

type StringKeyOf<T> = Extract<keyof T, string>;

function isStringKeyOf<T>(
  key: keyof T | ((row: T, index: number) => React.ReactNode)
): key is StringKeyOf<T> {
  return typeof key === "string";
}

export type Column<T> = {
  header: string | React.ReactNode;
  accessor: keyof T | ((row: T, index: number) => React.ReactNode);
  className?: string;
};

type PaginationMode = "backend" | "frontend";

type TableProps<T extends { id: number | string }> = {
  data: T[];
  columns: Column<T>[];
  className?: string;
  emptyText?: string;
  searchable?: boolean;
  sortable?: boolean;

  // pagination control
  paginationMode?: PaginationMode; // if omitted: auto-detect (backend if onPageChange is provided, else frontend)

  // backend / frontend shared base props
  page?: number; // used in backend; ignored in frontend (frontend uses internal state)
  limit?: number; // page size (rows per page)
  total?: number; // total count; used in backend; for frontend it's derived from data.length

  // backend callbacks
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;

  // rows per page options
  pageSizeOptions?: number[];

  // actions
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onApprove?: (row: T) => void;
  onReject?: (row: T) => void;
  onDelete?: (row: T) => void;
  onPermission?: (row: T) => void;
  onNavigate?: (row: T) => void;
  snRequired?: boolean;
  headerRequired?: boolean;
};

function Table<T extends { id: number | string }>({
  data,
  columns,
  className = "",
  emptyText = "No data found.",
  searchable = false,
  sortable = false,

  paginationMode,
  page = 1,
  limit: limitProp = 10,
  total = 0,
  onPageChange,
  onLimitChange,
  pageSizeOptions,

  onView,
  onEdit,
  onApprove,
  onDelete,
  onReject,
  onPermission,
  onNavigate,
  snRequired = true,
  headerRequired = true,
}: TableProps<T>) {
  const isMobile = useIsMobile();
  const [searchText, setSearchText] = useState("");

  const [sortConfig, setSortConfig] = useState<{
    key: StringKeyOf<T> | null;
    direction: "asc" | "desc";
  }>({
    key: null,
    direction: "asc",
  });

  // ------ Pagination Mode: backend vs frontend ------
  const resolvedBackend =
    paginationMode === "backend" ||
    (!!onPageChange && paginationMode !== "frontend");
  const isBackendPagination: boolean = resolvedBackend;

  // Page size options and internal state
  const pageSizeOptionsFinal =
    pageSizeOptions && pageSizeOptions.length
      ? pageSizeOptions
      : [10, 25, 50, 100];

  const [internalLimit, setInternalLimit] = useState<number>(
    limitProp || pageSizeOptionsFinal[0]
  );

  useEffect(() => {
    if (limitProp && limitProp > 0) {
      setInternalLimit(limitProp);
    }
  }, [limitProp]);

  const pageSize = internalLimit;

  // Frontend current page internal state
  const [internalPage, setInternalPage] = useState(1);

  const currentPage = isBackendPagination ? page : internalPage;

  const stringColumns = useMemo(() => {
    return columns
      .map((col) => (isStringKeyOf<T>(col.accessor) ? col.accessor : null))
      .filter((c): c is StringKeyOf<T> => c !== null);
  }, [columns]);

  const [confirmState, setConfirmState] = useState<{
    type: "delete" | "approve";
    row: T | null;
  } | null>(null);

  const handleConfirm = () => {
    if (!confirmState || !confirmState.row) return;
    const { type, row } = confirmState;
    if (type === "delete" && onDelete) onDelete(row);
    else if (type === "approve" && onApprove) onApprove(row);
    setConfirmState(null);
  };

  // ----------------- FILTER (search) -----------------
  const filteredData = useMemo(() => {
    if (!searchText.trim()) return data;
    const lowerSearch = searchText.toLowerCase();
    return data.filter((row) =>
      stringColumns.some((key) => {
        const val = row[key];
        return (
          typeof val === "string" && val.toLowerCase().includes(lowerSearch)
        );
      })
    );
  }, [data, searchText, stringColumns]);

  // --------------- SORT (client-side) ----------------
  const sortedData = useMemo(() => {
    if (!sortable || !sortConfig.key) return filteredData;

    const { key, direction } = sortConfig;

    const sorted = [...filteredData].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];

      if (aVal == null && bVal != null) return direction === "asc" ? -1 : 1;
      if (aVal != null && bVal == null) return direction === "asc" ? 1 : -1;
      if (aVal == null && bVal == null) return 0;

      if (typeof aVal === "number" && typeof bVal === "number") {
        return direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal);
      const bStr = String(bVal);

      if (aStr < bStr) return direction === "asc" ? -1 : 1;
      if (aStr > bStr) return direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredData, sortConfig, sortable]);

  // ---- Total items & pages (backend vs frontend) ----
  const totalItems = isBackendPagination
    ? total || data.length
    : sortedData.length;
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / pageSize) : 0;

  // keep frontend current page in bounds when data/pageSize changes
  useEffect(() => {
    if (!isBackendPagination) {
      const newTotalPages =
        totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1;
      if (internalPage > newTotalPages) {
        setInternalPage(newTotalPages);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, pageSize, isBackendPagination]);

  // reset to first page on search in frontend mode
  useEffect(() => {
    if (!isBackendPagination) {
      setInternalPage(1);
    }
  }, [searchText, isBackendPagination]);

  // --------------- Paginated data ----------------
  const displayData = useMemo(() => {
    if (isBackendPagination) {
      // backend: assume sortedData already represents the current page
      return sortedData;
    }
    if (pageSize <= 0) return sortedData;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, isBackendPagination, currentPage, pageSize]);

  const handleSort = (key: StringKeyOf<T>) => {
    if (!sortable) return;
    setSortConfig((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  };

  const renderSortIcon = (key: StringKeyOf<T>) => {
    if (!sortable || sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <FiChevronUp className="inline ml-1 w-4 h-4" />
    ) : (
      <FiChevronDown className="inline ml-1 w-4 h-4" />
    );
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || (totalPages && newPage > totalPages)) return;
    if (isBackendPagination) {
      onPageChange?.(newPage);
    } else {
      setInternalPage(newPage);
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setInternalLimit(newLimit);
    if (isBackendPagination) {
      onLimitChange?.(newLimit);
      // usually when page size changes, go back to page 1
      onPageChange?.(1);
    } else {
      setInternalPage(1);
    }
  };

  const getSN = (index: number) => (currentPage - 1) * pageSize + index + 1;

  const fromItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const toItem =
    totalItems === 0 ? 0 : Math.min(currentPage * pageSize, totalItems);

  const sizeClassMap = {
    16: "text-base w-4 h-4 p-1",
    20: "text-lg w-5 h-5 p-1.5",
    24: "text-xl w-6 h-6 p-2",
    28: "text-2xl w-7 h-7 p-2",
  };

  const renderActions = (row: T, size: keyof typeof sizeClassMap = 16) => {
    const btnClass = sizeClassMap[size] || sizeClassMap[16];
    return (
      <div className="flex gap-2 items-center">
        {onApprove && (
          <button
            onClick={() => setConfirmState({ type: "approve", row })}
            className={`text-green-600 rounded hover:bg-green-100 transition ${btnClass}`}
            title="Approve"
          >
            <FiCheckCircle />
          </button>
        )}
        {onEdit && (
          <button
            onClick={() => onEdit(row)}
            className={`text-blue-600 rounded hover:bg-blue-100 transition ${btnClass}`}
            title="Edit"
          >
            <FiEdit />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => setConfirmState({ type: "delete", row })}
            className={`text-red-600 rounded hover:bg-red-100 transition ${btnClass}`}
            title="Delete"
          >
            <FiTrash2 />
          </button>
        )}
        {onNavigate && (
          <button
            onClick={() => onNavigate(row)}
            className={`text-purple-600 rounded hover:bg-purple-100 transition ${btnClass}`}
            title="Navigate"
          >
            <FiNavigation2 />
          </button>
        )}
        {onView && (
          <button
            onClick={() => onView(row)}
            className={`text-indigo-600 rounded hover:bg-indigo-100 transition ${btnClass}`}
            title="View"
          >
            <FiEye />
          </button>
        )}
        {onReject && (
          <button
            onClick={() => onReject(row)}
            className={`text-red-600 rounded hover:bg-indigo-100 transition ${btnClass}`}
            title="Reject"
          >
            <ImCross />
          </button>
        )}
        {onPermission && (
          <button
            onClick={() => onPermission(row)}
            className={`text-green-600 rounded hover:bg-green-100 transition ${btnClass}`}
            title="Permission"
          >
            <FaShieldAlt />
          </button>
        )}
      </div>
    );
  };

  const renderFooter = () => {
    // Show footer even if only one page, so user can adjust page size
    return (
      <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-700">Rows per page:</span>
          <select
            className="border rounded px-2 py-1 text-sm bg-white"
            value={pageSize}
            onChange={(e) => handleLimitChange(Number(e.target.value))}
          >
            {pageSizeOptionsFinal.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-gray-500">
            {fromItem}-{toItem} of {totalItems}
          </span>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50 text-sm"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => handlePageChange(p)}
                className={`px-3 py-1 border rounded text-sm ${
                  p === currentPage ? "bg-gray-200 font-semibold" : ""
                }`}
              >
                {p}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50 text-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  };

  // ---------------- MOBILE RENDER ----------------
  if (isMobile) {
    return (
      <div className={className}>
        {searchable && (
          <Input
            className="px-3 py-2 border rounded w-full max-w-md"
            name="search"
            type="search"
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        )}
        {displayData.length === 0 ? (
          <div className="text-center text-gray-400 italic py-8">
            {emptyText}
          </div>
        ) : (
          displayData.map((row, index) => (
            <div
              key={row.id}
              className={`${COLORS.primary} rounded-lg p-2 shadow-md space-y-2 mb-4`}
            >
              {snRequired && (
                <div className="text-sm font-semibold text-white p-2 shadow-md rounded-lg">
                  SN: {getSN(index)}
                </div>
              )}
              <div className="bg-white p-2 shadow-md rounded-lg flex flex-col gap-1">
                {columns.map((col, colIndex) => {
                  const rawValue =
                    typeof col.accessor === "function"
                      ? col.accessor(row, colIndex)
                      : (row[col.accessor] as unknown as React.ReactNode);
                  const value = React.isValidElement(rawValue)
                    ? rawValue
                    : typeof rawValue === "object" && rawValue !== null
                    ? JSON.stringify(rawValue)
                    : rawValue;
                  return (
                    <div
                      key={colIndex}
                      className="text-sm flex justify-between"
                    >
                      <span className="font-bold text-gray-600">
                        {col.header}:
                      </span>
                      <span className="text-gray-800">{value}</span>
                    </div>
                  );
                })}
                <div className="mt-6 mb-3 flex gap-2 justify-end">
                  {renderActions(row, 24)}
                </div>
              </div>
            </div>
          ))
        )}
        {renderFooter()}
        <ConfirmModal
          open={!!confirmState}
          onClose={() => setConfirmState(null)}
          onConfirm={handleConfirm}
          confirmText={confirmState?.type === "delete" ? "Delete" : "Approve"}
          title={
            confirmState?.type === "delete"
              ? "Confirm Deletion"
              : "Confirm Approval"
          }
          description={
            confirmState?.row ? (
              <>
                Are you sure you want to <strong>{confirmState.type}</strong>{" "}
                <span className="text-blue-600">
                  {(confirmState.row as any)?.name ?? "this item"}
                </span>
                ?
              </>
            ) : null
          }
          actionType={confirmState?.type === "delete" ? "delete" : "approve"}
        />
      </div>
    );
  }

  // ---------------- DESKTOP RENDER ----------------
  return (
    <div
      className={`overflow-x-auto border border-gray-300 rounded-lg shadow-sm bg-white ${className}`}
    >
      {searchable && (
        <div className="p-2">
          <Input
            placeholder="Search"
            required
            className="border rounded w-full max-w-md mb-0"
            name="search"
            type="search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      )}
      <table className="min-w-full table-auto divide-y divide-gray-200">
        {headerRequired && (
          <thead className={`${COLORS.primary} text-white`}>
            <tr>
              {snRequired && (
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  SN
                </th>
              )}
              {columns.map((col, i) => {
                const isSortableCol =
                  sortable && isStringKeyOf<T>(col.accessor);
                return (
                  <th
                    key={i}
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      col.className || ""
                    } ${isSortableCol ? "cursor-pointer select-none" : ""}`}
                    onClick={() => {
                      if (isSortableCol && isStringKeyOf<T>(col.accessor)) {
                        handleSort(col.accessor);
                      }
                    }}
                  >
                    <div className="flex items-center">
                      {col.header}
                      {isSortableCol &&
                        isStringKeyOf<T>(col.accessor) &&
                        renderSortIcon(col.accessor)}
                    </div>
                  </th>
                );
              })}
              {(onEdit ||
                onDelete ||
                onView ||
                onApprove ||
                onNavigate ||
                onReject ||
                onPermission) && (
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
        )}
        <tbody className="bg-white divide-y divide-gray-200">
          {displayData.length === 0 ? (
            <tr>
              <td
                colSpan={
                  columns.length +
                  (snRequired ? 1 : 0) +
                  (onEdit ||
                  onDelete ||
                  onView ||
                  onApprove ||
                  onNavigate ||
                  onReject ||
                  onPermission
                    ? 1
                    : 0)
                }
                className="px-6 py-12 text-center text-gray-400 italic"
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            displayData.map((row, index) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                {snRequired && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {getSN(index)}
                  </td>
                )}
                {columns.map((col, i) => {
                  const rawValue =
                    typeof col.accessor === "function"
                      ? col.accessor(row, i)
                      : (row[col.accessor] as unknown as React.ReactNode);
                  const value = React.isValidElement(rawValue)
                    ? rawValue
                    : typeof rawValue === "object" && rawValue !== null
                    ? JSON.stringify(rawValue)
                    : rawValue;
                  return (
                    <td
                      key={i}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                    >
                      {value}
                    </td>
                  );
                })}
                {(onEdit ||
                  onDelete ||
                  onView ||
                  onApprove ||
                  onNavigate ||
                  onReject ||
                  onPermission) && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {renderActions(row)}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {renderFooter()}

      <ConfirmModal
        open={!!confirmState}
        onClose={() => setConfirmState(null)}
        onConfirm={handleConfirm}
        confirmText={confirmState?.type === "delete" ? "Delete" : "Approve"}
        title={
          confirmState?.type === "delete"
            ? "Confirm Deletion"
            : "Confirm Approval"
        }
        description={
          confirmState?.row ? (
            <>
              Are you sure you want to <strong>{confirmState.type}</strong>{" "}
              <span className="text-blue-600">
                {(confirmState.row as any)?.name ?? "this item"}
              </span>
              ?
            </>
          ) : null
        }
        actionType={confirmState?.type === "delete" ? "delete" : "approve"}
      />
    </div>
  );
}

export default Table;
