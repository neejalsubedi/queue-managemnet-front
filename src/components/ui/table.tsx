import React, { useState, useMemo, useEffect } from "react";
import {
    FiChevronUp,
    FiChevronDown,
    FiEdit,
    FiTrash2,
    FiEye,
    FiCheckCircle,
} from "react-icons/fi";
import { useDebounce } from "use-debounce";

import ConfirmModal from "./ConfirmModal";
import { FaShieldAlt } from "react-icons/fa";

import { COLORS } from "./Theme";
import {useIsMobile} from "@/hooks/use-mobile.tsx";
import {Input} from "@/components/ui/input.tsx";

type StringKeyOf<T> = Extract<keyof T, string>;

function isStringKeyOf<T>(
    key: keyof T | ((row: T, index: number) => React.ReactNode) | undefined,
): key is StringKeyOf<T> {
    return typeof key === "string";
}

export type Column<T> = {
    header: string | React.ReactNode;
    accessor?: keyof T | ((row: T, index: number) => React.ReactNode);
    className?: string;
    expandable?: (row: T) => React.ReactNode; // new property
};
// export type TableFilterOption = {
//     label: string;
//     value: string | number;
// };

type TableProps<T extends { id: number | string }> = {
    data: T[];
    columns: Column<T>[];
    className?: string;
    emptyText?: string;
    searchable?: boolean;
    showPageSize?: boolean;
    sortable?: boolean;
    pagination?: boolean;
    onView?: (row: T) => void;
    onEdit?: (row: T) => void;
    onApprove?: (row: T) => void;
    onDelete?: (row: T) => void;
    onPermission?: (row: T) => void;
    totalItems?: number;
    page?: number;
    itemsPerPage?: number;
    onPageChange?: (page: number) => void;
    onSearchChange?: (search: string) => void;
    onItemsPerPageChange?: (itemsPerPage: number) => void;
    showEditButton?: (index: number) => boolean;
    // filters?: TableFilterOption[];
    // selectedFilter?: string | number;
    // onFilterChange?: (value: string | number) => void;
    selectable?: boolean;              // show checkbox column or not
    selectedRowIds?: Array<T["id"]>;   // controlled selected rows
    onSelectionChange?: (ids: Array<T["id"]>) => void;
};


function Table<T extends { id: number | string }>({
                                                      data,
                                                      columns,
                                                      className = "",
                                                      emptyText = "No data found.",
                                                      searchable = false,
                                                      showPageSize = false,
                                                      sortable = false,
                                                      pagination = true,
                                                      onView,
                                                      onEdit,
                                                      onApprove,
                                                      onDelete,
                                                      onPermission,
                                                      totalItems,
                                                      page,
                                                      itemsPerPage,
                                                      onPageChange,
                                                      onSearchChange,
                                                      onItemsPerPageChange,
                                                      showEditButton,
                                                      selectable = false,
                                                      selectedRowIds = [],
                                                      onSelectionChange,
                                                  }: TableProps<T>) {

    /* ✅ NORMALIZE DATA HERE */
    const tableData = useMemo<T[]>(() => {
        if (Array.isArray(data)) return data;

        // backend response safeguard (extra safety)
        if (data && typeof data === "object" && "data" in (data as any)) {
            return ((data as any).data ?? []) as T[];
        }

        return [];
    }, [data]);
    const isMobile = useIsMobile();
    const [searchText, setSearchText] = useState("");
    const [debouncedSearch] = useDebounce(searchText, 500);

    const [sortConfig, setSortConfig] = useState<{
        key: StringKeyOf<T> | null;
        direction: "asc" | "desc";
    }>({
        key: null,
        direction: "asc",
    });
    const [jumpPage, setJumpPage] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const isBackend = !!onPageChange;
    const [pageSize, setPageSize] = useState(itemsPerPage ?? 10);
    const [expandedRowId, setExpandedRowId] = useState<T["id"] | null>(null);

    const toggleRow = (id: T["id"]) => {
        setExpandedRowId((prev) => (prev === id ? null : id));
    };

    useEffect(() => {
        if (itemsPerPage && itemsPerPage !== pageSize) {
            setPageSize(itemsPerPage);
        }
    }, [itemsPerPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [data, searchText, sortConfig]);

    const [confirmState, setConfirmState] = useState<{
        type: "delete" | "approve";
        row: T | null;
    } | null>(null);

    const handleConfirm = () => {
        if (!confirmState || !confirmState.row) return;

        const { type, row } = confirmState;

        if (type === "delete" && onDelete) {
            onDelete(row);
        } else if (type === "approve" && onApprove) {
            onApprove(row);
        }

        setConfirmState(null);
    };

    const filteredData = useMemo(() => {
        if (!searchText.trim()) return tableData;

        const lowerSearch = searchText.toLowerCase();

        return data.filter((row) =>
            Object.values(row).some((value) => {
                if (value == null) return false;
                if (typeof value === "string")
                    return value.toLowerCase().includes(lowerSearch);
                if (typeof value === "number")
                    return value.toString().includes(lowerSearch);
                return false;
            }),
        );
    }, [tableData, searchText]);

    const sortedData = useMemo(() => {
        if (!sortable || !sortConfig.key) return filteredData;
        return [...filteredData].sort((a, b) => {
            const aVal = a[sortConfig.key!];
            const bVal = b[sortConfig.key!];
            if (typeof aVal === "string" && typeof bVal === "string") {
                return sortConfig.direction === "asc"
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            }
            if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
            if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
            return 0;
        });
    }, [filteredData, sortConfig, sortable]);

    const currentPageNumber = page ?? currentPage;
    const perPage = isBackend ? (itemsPerPage ?? 10) : pageSize;
    const totalPages = isBackend
        ? Math.ceil((totalItems ?? 0) / perPage)
        : Math.ceil(sortedData.length / perPage);


    const paginatedData = useMemo(() => {
        if (isBackend) return tableData; // already paginated by backend
        const start = (currentPage - 1) * perPage;
        return sortedData.slice(start, start + perPage);
    }, [tableData, sortedData, currentPage, perPage, isBackend]);


    const handleSort = (key: StringKeyOf<T>) => {
        if (!sortable) return;
        setSortConfig((prev) =>
            prev.key === key
                ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
                : { key, direction: "asc" },
        );
    };

    const handleSearchChange = (text: string) => {
        setSearchText(text);
        setCurrentPage(1);

        // if (onSearchChange) onSearchChange(text);
    };
    useEffect(() => {
        if (onSearchChange) onSearchChange(debouncedSearch);
    }, [debouncedSearch]);

    const handlePageSizeChange = (size: number) => {
        if (isBackend) {
            onItemsPerPageChange?.(size); // let parent fetch new data
        } else {
            setPageSize(size); // frontend: update local state
            setCurrentPage(1);
        }
    };
    const currentRowIds = useMemo(
        () => paginatedData.map((row) => row.id),
        [paginatedData],
    );

    const isAllCurrentSelected =
        currentRowIds.length > 0 &&
        currentRowIds.every((id) => selectedRowIds.includes(id));

    const toggleSelectAllCurrent = () => {
        if (!onSelectionChange) return;

        if (isAllCurrentSelected) {
            // remove only current page rows
            onSelectionChange(
                selectedRowIds.filter((id) => !currentRowIds.includes(id)),
            );
        } else {
            // add current page rows
            onSelectionChange([
                ...new Set([...selectedRowIds, ...currentRowIds]),
            ]);
        }
    };

    const toggleRowSelection = (id: T["id"]) => {
        if (!onSelectionChange) return;

        onSelectionChange(
            selectedRowIds.includes(id)
                ? selectedRowIds.filter((x) => x !== id)
                : [...selectedRowIds, id],
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

    const sizeClassMap = {
        16: "text-base w-4 h-4 p-1",
        20: "text-lg w-5 h-5 p-1.5",
        24: "text-xl w-6 h-6 p-2",
        28: "text-2xl w-7 h-7 p-2",
    };

    // const renderActions = (row: T, size: keyof typeof sizeClassMap = 16) => {
    const renderActions = (
        row: T,
        index: number,
        size: keyof typeof sizeClassMap = 16,
    ) => {
        const btnClass = sizeClassMap[size] || sizeClassMap[16];
        const canShowEdit = !showEditButton || showEditButton(index) === true;
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
                {onEdit && canShowEdit && (
                    <button
                        onClick={() => onEdit(row)}
                        className={`text-blue-600 rounded hover:bg-blue-100  transition ${btnClass}`}
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
                {onView && (
                    <button
                        onClick={() => onView(row)}
                        className={`text-indigo-600 rounded hover:bg-indigo-100 transition ${btnClass}`}
                        title="View"
                    >
                        <FiEye />
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
                {/* Expand/Collapse toggle */}
                {columns.some((col) => col.expandable) && (
                    <button
                        onClick={() => toggleRow(row.id)}
                        className={`text-gray-600 rounded hover:bg-gray-100 transition ${btnClass}`}
                        title={expandedRowId === row.id ? "Collapse" : "Expand"}
                    >
                        {expandedRowId === row.id ? "▲" : "▼"}
                    </button>
                )}
            </div>
        );
    };

    // const generatePageNumbers = (): (number | "...")[] => {
    //   if (totalPages <= 7)
    //     return Array.from({ length: totalPages }, (_, i) => i + 1);
    //   const pages: (number | "...")[] = [1, 2];
    //   if (currentPage > 5) pages.push("...");
    //   for (let i = currentPage - 1; i <= currentPage + 1; i++) {
    //     if (i > 2 && i < totalPages - 1) pages.push(i);
    //   }
    //   if (currentPage < totalPages - 3) pages.push("...");
    //   pages.push(totalPages - 1, totalPages);
    //   return [...new Set(pages)];
    // };

    const getPaginationRange = (
        current: number,
        total: number,
        delta = 2,
    ): (number | "...")[] => {
        const range: number[] = [];
        const rangeWithDots: (number | "...")[] = [];

        const left = Math.max(2, current - delta);
        const right = Math.min(total - 1, current + delta);

        for (let i = left; i <= right; i++) {
            range.push(i);
        }

        if (left > 2) rangeWithDots.push("...");
        rangeWithDots.push(...range);
        if (right < total - 1) rangeWithDots.push("...");

        return [1, ...rangeWithDots, total];
    };

    const handlePageChange = (pageNum: number) => {
        if (onPageChange) {
            onPageChange(pageNum); // backend: let parent fetch new data
        } else {
            setCurrentPage(pageNum); // frontend: use local state
        }
    };

    const renderPagination = () =>
        totalPages > 1 && (
            <div className="flex flex-col items-center gap-3 py-4">
                {/* Page info */}
                <div className="text-xs text-gray-500">
                    Page <span className="font-semibold">{currentPageNumber}</span> of{" "}
                    <span className="font-semibold">{totalPages}</span>
                </div>

                {/* Controls */}
                <div className="flex flex-wrap items-center gap-1">
                    {/* First */}
                    <button
                        disabled={currentPageNumber === 1}
                        onClick={() => handlePageChange(1)}
                        className={`px-2 py-1 text-sm rounded border transition
            ${
                            currentPageNumber === 1
                                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                                : "hover:bg-gray-100"
                        }`}
                    >
                        ⏮
                    </button>

                    {/* Prev */}
                    <button
                        disabled={currentPageNumber === 1}
                        onClick={() => handlePageChange(currentPageNumber - 1)}
                        className={`px-2 py-1 text-sm rounded border transition
            ${
                            currentPageNumber === 1
                                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                                : "hover:bg-gray-100"
                        }`}
                    >
                        ‹
                    </button>

                    {/* Page numbers */}
                    {getPaginationRange(currentPageNumber, totalPages).map((p, idx) =>
                            p === "..." ? (
                                <span
                                    key={idx}
                                    className="px-2 py-1 text-sm text-gray-400 select-none"
                                >
                …
              </span>
                            ) : (
                                <button
                                    key={idx}
                                    onClick={() => handlePageChange(p)}
                                    className={`px-3 py-1 text-sm rounded border transition
                ${
                                        p === currentPageNumber
                                            ? "bg-blue-600 text-white border-blue-600 shadow"
                                            : "hover:bg-gray-100 text-gray-700 border-gray-300"
                                    }`}
                                >
                                    {p}
                                </button>
                            ),
                    )}

                    {/* Next */}
                    <button
                        disabled={currentPageNumber === totalPages}
                        onClick={() => handlePageChange(currentPageNumber + 1)}
                        className={`px-2 py-1 text-sm rounded border transition
            ${
                            currentPageNumber === totalPages
                                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                                : "hover:bg-gray-100"
                        }`}
                    >
                        ›
                    </button>

                    {/* Last */}
                    <button
                        disabled={currentPageNumber === totalPages}
                        onClick={() => handlePageChange(totalPages)}
                        className={`px-2 py-1 text-sm rounded border transition
            ${
                            currentPageNumber === totalPages
                                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                                : "hover:bg-gray-100"
                        }`}
                    >
                        ⏭
                    </button>

                    {/* Jump to page */}
                    <div className="flex items-center gap-1 ml-3">
                        <span className="text-xs text-gray-500">Go to</span>
                        <input
                            type="number"
                            min={1}
                            max={totalPages}
                            value={jumpPage}
                            onChange={(e) => setJumpPage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    const pageNum = Number(jumpPage);
                                    if (pageNum >= 1 && pageNum <= totalPages) {
                                        handlePageChange(pageNum);
                                        setJumpPage("");
                                    }
                                }
                            }}
                            className="w-16 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>
        );

    const getSN = (index: number) =>
        isBackend
            ? (currentPageNumber - 1) * (itemsPerPage ?? 10) + index + 1
            : (currentPage - 1) * pageSize + index + 1;

    if (isMobile) {
        const firstColumn = columns[0];
        const remainingColumns = columns.slice(1);

        const renderCellValue = (value: unknown): React.ReactNode => {
            if (React.isValidElement(value)) return value;
            if (
                typeof value === "string" ||
                typeof value === "number" ||
                typeof value === "boolean"
            )
                return value;
            if (value === null || value === undefined) return "—";
            if (typeof value === "object") return JSON.stringify(value);
            return String(value);
        };

        return (
            <div className={`overflow-x-auto ${className}`}>
                <div className={"flex justify-between"}>
                    {/* Search */}
                    {searchable && (
                        <Input
                            className="px-4 py-2 border rounded-md w-full mb-4 shadow-sm"
                            name="search"
                            type="search"
                            placeholder="Search"
                            value={searchText}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                    )}
                    {showPageSize && (
                        <div className={"mt-1 py-1 border mb-8 px-2 rounded-md "}>
                            <label className="mr-2">Page size:</label>
                            <select
                                value={pageSize}
                                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                                className="border-0 rounded px-2 py-1"
                            >
                                {[5, 10, 20, 50, 100].map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                <table className="min-w-full rounded-xl overflow-hidden shadow-md border border-gray-300">
                    {/* Header */}
                    <thead className={`${COLORS.primary} text-white`}>
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold">
                            <div className="flex items-center gap-2">
                                {selectable && (
                                    <input
                                        type="checkbox"
                                        checked={isAllCurrentSelected}
                                        onChange={toggleSelectAllCurrent}
                                    />
                                )}
                                SN
                            </div>
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold border-r border-gray-700">
                            {firstColumn.header}
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold">
                            Details
                        </th>
                    </tr>
                    </thead>

                    <tbody className="bg-white">
                    {paginatedData.map((row, index) => {
                        const firstValue =
                            typeof firstColumn.accessor === "function"
                                ? firstColumn.accessor(row, index)
                                : isStringKeyOf(firstColumn.accessor)
                                    ? row[firstColumn.accessor]
                                    : null;

                        const isExpanded = expandedRowId === row.id;

                        return (
                            <React.Fragment key={row.id}>
                                {/* Main Row */}
                                <tr className="border-b last:border-b-0 hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-700">
                                        <div className="flex items-center gap-2">
                                            {selectable && (
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRowIds.includes(row.id)}
                                                    onChange={() => toggleRowSelection(row.id)}
                                                />
                                            )}
                                            {getSN(index)}
                                        </div>
                                    </td>


                                    <td className="px-4 py-3 text-sm font-medium text-gray-800 border-r">
                                        {renderCellValue(firstValue)}
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => toggleRow(row.id)}
                                            className={`inline-flex items-center justify-center
                        w-8 h-8 rounded-full
                        ${COLORS.secondary} text-gray-900
                        shadow-sm hover:opacity-90 transition`}
                                            aria-label="Toggle details"
                                        >
                                            {isExpanded ? "−" : "+"}
                                        </button>
                                    </td>
                                </tr>

                                {/* Expanded Row */}
                                {isExpanded && (
                                    <tr>
                                        <td colSpan={3} className="px-4 py-4 bg-gray-50">
                                            <div className="bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden">
                                                <div className="divide-y divide-gray-200">
                                                    {remainingColumns.map((col, i) => {
                                                        const value =
                                                            typeof col.accessor === "function"
                                                                ? col.accessor(row, index)
                                                                : isStringKeyOf(col.accessor)
                                                                    ? row[col.accessor]
                                                                    : null;

                                                        return (
                                                            <div
                                                                key={i}
                                                                className="grid grid-cols-2 items-start"
                                                            >
                                                                <div className="px-4 py-3 text-xs font-semibold text-gray-500 bg-gray-100 border-r">
                                                                    {col.header}
                                                                </div>
                                                                <div className="px-4 py-3 text-sm text-gray-800 break-words">
                                                                    {renderCellValue(value)}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}

                                                    {/* Actions */}
                                                    {(onEdit || onDelete || onView || onApprove) && (
                                                        <div className="grid grid-cols-2 items-center bg-gray-100">
                                                            <div className="px-4 py-3 text-xs font-semibold text-gray-500 border-r">
                                                                Actions
                                                            </div>
                                                            <div className="px-4 py-3">
                                                                {renderActions(row, index, 20)}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}
                    </tbody>
                </table>

                {pagination && renderPagination()}
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

    return (
        <div
            className={`overflow-x-auto border border-gray-300 rounded-lg shadow-sm ${className}`}
        >
            <div className="flex justify-between items-center p-2">
                {searchable ?(
                    // <div className="p-2">
                    <Input
                        placeholder="Search"
                        required
                        className="border rounded w-full max-w-md mb-0"
                        name="search"
                        type="search"
                        value={searchText}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                ) : (
                    // </div>
                    <div></div>
                )}
                {showPageSize && (
                    <div>
                        <label className="mr-2">Page size:</label>
                        <select
                            value={pageSize}
                            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                            className="border rounded px-2 py-1"
                        >
                            {[5, 10, 20, 50, 100].map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                {/*{filters && filters.length > 0 && (*/}
                {/*    <select*/}
                {/*        value={selectedFilter ?? ""}*/}
                {/*        onChange={(e) => onFilterChange?.(e.target.value)}*/}
                {/*        className="border rounded px-3 py-2 text-sm"*/}
                {/*    >*/}
                {/*        <option value="">All</option>*/}
                {/*        {filters.map((filter) => (*/}
                {/*            <option key={filter.value} value={filter.value}>*/}
                {/*                {filter.label}*/}
                {/*            </option>*/}
                {/*        ))}*/}
                {/*    </select>*/}
                {/*)}*/}
            </div>
            <table className="min-w-full border rounded-2xl table-auto divide-y divide-gray-200">
                <thead className={`bg-white text-black border-b-4 shadow-2xl`}>
                <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold">
                        <div className="flex items-center gap-2">
                            {selectable && (
                                <input
                                    type="checkbox"
                                    checked={isAllCurrentSelected}
                                    onChange={toggleSelectAllCurrent}
                                />
                            )}
                            SN
                        </div>
                    </th>
                    {columns.map((col, i) => {
                        const isSortableCol = sortable && isStringKeyOf<T>(col.accessor);
                        return (
                            <th
                                key={i}
                                className={`px-6 py-3 text-left text-sm font-semibold tracking-wider ${
                                    col.className || ""
                                } ${isSortableCol ? "cursor-pointer select-none" : ""}`}
                                onClick={() => {
                                    if (isSortableCol && isStringKeyOf<T>(col.accessor)) {
                                        handleSort(col.accessor);
                                    }
                                }}
                            >
                                <div className="flex items-center text-sm">
                                    {col.header}
                                    {isSortableCol &&
                                        isStringKeyOf<T>(col.accessor) &&
                                        renderSortIcon(col.accessor)}
                                </div>
                            </th>
                        );
                    })}
                    {(onEdit || onDelete || onView || onApprove) && (
                        <th className="px-6 py-3 text-left text-sm font-semibold tracking-wider">
                            Actions
                        </th>
                    )}
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.length === 0 ? (
                    <tr>
                        <td
                            colSpan={columns.length + (selectable ? 1 : 0) + ((onEdit || onDelete || onView || onApprove || columns.some((col) => col.expandable)) ? 1 : 0)}
                            className="px-6 py-8 text-center text-gray-400 italic"
                        >
                            {emptyText }
                        </td>
                    </tr>
                ) : (
                    paginatedData.map((row, index) => (
                        <React.Fragment key={row.id}>
                            <tr
                                className={`transition-colors duration-150 ${
                                    index % 2 === 0 ? "bg-[#F2F8FA]" : "bg-white"
                                } hover:bg-gray-50`}
                            >
                                {" "}
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-700">
                                    <div className="flex items-center gap-2">
                                        {selectable && (
                                            <input
                                                type="checkbox"
                                                checked={selectedRowIds.includes(row.id)}
                                                onChange={() => toggleRowSelection(row.id)}
                                            />
                                        )}
                                        {getSN(index)}
                                    </div>
                                </td>
                                {columns.map((col, i) => {
                                    const rawValue =
                                        typeof col.accessor === "function"
                                            ? col.accessor(row, i)
                                            : isStringKeyOf<T>(col.accessor)
                                                ? row[col.accessor]
                                                : "-";

                                    // const value =
                                    //   React.isValidElement(rawValue)
                                    //     ? rawValue
                                    //     : typeof rawValue === "object" && rawValue !== null
                                    //     ? JSON.stringify(rawValue)
                                    //     : rawValue;
                                    return (
                                        <td
                                            key={i}
                                            className="px-6 py-4 whitespace-nowrap text-xs text-gray-700"
                                            title={
                                                typeof rawValue === "string" ? rawValue : undefined
                                            }
                                        >
                                            {typeof rawValue === "function"
                                                ? rawValue(row, i)
                                                : React.isValidElement(rawValue)
                                                    ? rawValue
                                                    : typeof rawValue === "object" && rawValue !== null
                                                        ? JSON.stringify(rawValue)
                                                        : (rawValue ?? "-")}
                                        </td>
                                    );
                                })}
                                {(onEdit ||
                                    onDelete ||
                                    onView ||
                                    onApprove ||
                                    columns.some((col) => col.expandable)) && (
                                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-700">
                                        {renderActions(row, index)}
                                    </td>
                                )}
                            </tr>

                            {/* Expandable content row */}
                            {expandedRowId === row.id && (
                                <tr className="bg-gray-50">
                                    <td colSpan={columns.length + 2} className="px-6 py-4">
                                        {columns.map((col, i) =>
                                            col.expandable ? (
                                                <div key={i} className="mb-2">
                                                    {col.expandable(row)}
                                                </div>
                                            ) : null,
                                        )}
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))
                )}
                </tbody>
            </table>
            {pagination && renderPagination()}

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
