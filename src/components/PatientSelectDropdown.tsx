import { useMemo, useCallback, useState } from "react";
import { useInfinitePatients, useGetPatientById } from "@/components/ApiCall/Api";
import { useDebounce } from "use-debounce";
import { NiceSelect, type Option } from "@/components/ui/NiceSelect";
import { Patient } from "@/core/private/PatientMangement/type";

const DEFAULT_PAGE_SIZE = 15;
const MENU_MAX_HEIGHT_PX = 280;

type PatientOption = Option<number>;

interface PatientSelectDropdownProps {
  value: number | undefined;
  onChange: (patientId: number | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
  label?: string;
  className?: string;
}

interface MenuListScrollProps {
  innerRef: React.Ref<HTMLDivElement>;
  innerProps: React.HTMLAttributes<HTMLDivElement>;
  children: React.ReactNode;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
}

/** Scrollable list container: fixed height, overflow scroll, load more near bottom. */
function MenuListScroll({
  innerRef,
  innerProps,
  children,
  onLoadMore,
  hasMore,
  isLoadingMore,
}: MenuListScrollProps) {
  const onScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const el = e.currentTarget;
      if (!hasMore || isLoadingMore) return;
      const { scrollTop, scrollHeight, clientHeight } = el;
      if (scrollHeight - scrollTop - clientHeight < 80) {
        onLoadMore();
      }
    },
    [hasMore, isLoadingMore, onLoadMore]
  );

  return (
    <div
      ref={innerRef}
      {...innerProps}
      onScroll={onScroll}
      style={{
        maxHeight: MENU_MAX_HEIGHT_PX,
        overflowY: "auto",
        overflowX: "hidden",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {children}
      {isLoadingMore && (
        <div className="px-3 py-2 text-center text-sm text-muted-foreground">
          Loading more…
        </div>
      )}
    </div>
  );
}

export function PatientSelectDropdown({
  value,
  onChange,
  placeholder = "Choose patient",
  disabled = false,
  name = "patient_id",
  label,
  className,
}: PatientSelectDropdownProps) {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch] = useDebounce(searchInput, 300);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfinitePatients(debouncedSearch, DEFAULT_PAGE_SIZE);

  const { data: selectedPatientData } = useGetPatientById(value);

  const options: PatientOption[] = useMemo(() => {
    const pages = data?.pages ?? [];
    const list: Patient[] = [];
    pages.forEach((page) => {
      const arr = page?.data?.data;
      if (Array.isArray(arr)) list.push(...arr);
    });
    return list.map((p) => ({
      value: p.id ?? 0,
      label: `${p.full_name} (${p.phone ?? ""})`,
    }));
  }, [data?.pages]);

  const selectedOption = useMemo((): PatientOption | null => {
    const found = options.find((o) => o.value === value);
    if (found) return found;
    if (value != null && selectedPatientData?.data) {
      const p = selectedPatientData.data;
      return { value: p.id ?? value, label: `${p.full_name} (${p.phone ?? ""})` };
    }
    return null;
  }, [options, value, selectedPatientData?.data]);

  const handleChange = useCallback(
    (option: PatientOption | null) => {
      onChange(option ? (option.value as number) : undefined);
    },
    [onChange]
  );

  const components = useMemo(
    () => ({
      MenuList: (props: any) => (
        <MenuListScroll
          innerRef={props.innerRef}
          innerProps={props.innerProps}
          onLoadMore={() => fetchNextPage()}
          hasMore={!!hasNextPage}
          isLoadingMore={isFetchingNextPage}
        >
          {props.children}
        </MenuListScroll>
      ),
    }),
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  return (
    <NiceSelect<false>
      name={name}
      label={label}
      className={className}
      placeholder={isLoading && options.length === 0 ? "Loading…" : placeholder}
      disabled={disabled}
      value={selectedOption}
      options={options}
      onChange={handleChange as any}
      onInputChange={(v) => setSearchInput(v ?? "")}
      onMenuClose={() => setSearchInput("")}
      filterOption={() => true}
      components={components}
      isLoading={isLoading && options.length === 0}
      menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
      styles={{
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        menu: (base) => ({ ...base, maxHeight: MENU_MAX_HEIGHT_PX }),
      }}
    />
  );
}
