import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDown01,
  ArrowDownAZ,
  ArrowDownNarrowWide,
  ArrowDownWideNarrow,
  ArrowUp10,
  ArrowUpAZ,
  ArrowUpNarrowWide,
  Check,
  Radio,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X as CloseIcon,
} from 'lucide-react';
import { Drawer } from '@/components/ui/drawer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import useCategoryStore from '../../store/useCategoryStore.js';
import useFlagStore from '../../store/useFlagStore.js';

const SORT_OPTIONS = [
  { value: 'all', label: 'Default', shortLabel: 'Sort', icon: Radio },
  {
    value: 'price_high',
    label: 'Price: High to Low',
    shortLabel: 'Price ↑',
    icon: ArrowUp10,
  },
  {
    value: 'price_low',
    label: 'Price: Low to High',
    shortLabel: 'Price ↓',
    icon: ArrowDown01,
  },
  {
    value: 'name_asc',
    label: 'Name: A to Z',
    shortLabel: 'A → Z',
    icon: ArrowDownAZ,
  },
  {
    value: 'name_desc',
    label: 'Name: Z to A',
    shortLabel: 'Z → A',
    icon: ArrowUpAZ,
  },
  {
    value: 'latest',
    label: 'Latest',
    shortLabel: 'Latest',
    icon: ArrowUpNarrowWide,
  },
  {
    value: 'oldest',
    label: 'Oldest',
    shortLabel: 'Oldest',
    icon: ArrowDownNarrowWide,
  },
];

const LIMIT_OPTIONS = [5, 10, 20, 50];

const STOCK_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'in', label: 'In Stock' },
  { value: 'out', label: 'Out of Stock' },
];

const CHIP_TINTS = {
  blue: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200',
  green: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
  purple: 'bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-200',
  orange: 'bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-200',
  gray: 'bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-200',
};

const pillTriggerClass = (isSet, tinted) =>
  cn(
    'h-10 w-full min-w-0 rounded-full border bg-white px-3.5 shadow-xs transition-all duration-200 outline-none',
    'hover:border-gray-300 hover:shadow-sm',
    'focus-visible:border-[var(--primaryColor)] focus-visible:ring-4 focus-visible:ring-[var(--primaryColor)]/10',
    'data-[placeholder]:text-gray-400 [&_svg]:shrink-0',
    isSet && tinted
      ? 'border-[var(--primaryColor)]/40 bg-[var(--primaryColor)]/5 text-[var(--primaryColor)]'
      : 'border-gray-200 text-gray-700',
  );

const SearchField = memo(function SearchField({
  value,
  onChange,
  onClear,
  className,
}) {
  return (
    <div
      className={cn(
        'group relative flex w-full min-w-0 items-center rounded-full border border-gray-200 bg-gray-50 transition-all duration-300',
        'hover:border-gray-300 hover:bg-white',
        'focus-within:border-[var(--primaryColor)] focus-within:bg-white focus-within:ring-4 focus-within:ring-[var(--primaryColor)]/10',
        className,
      )}
    >
      <Search className="pointer-events-none absolute left-3.5 size-4 text-gray-400 transition-colors group-focus-within:text-[var(--primaryColor)]" />
      <input
        type="search"
        placeholder="Search products..."
        value={value}
        onChange={onChange}
        aria-label="Search products"
        autoComplete="off"
        className="w-full min-w-0 bg-transparent py-2.5 pl-11 pr-10 text-sm text-gray-800 placeholder:text-gray-400 outline-none [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="absolute right-2 grid size-7 place-items-center rounded-full text-gray-400 transition hover:bg-gray-200/60 hover:text-gray-700"
        >
          <CloseIcon className="size-3.5" />
        </button>
      )}
    </div>
  );
});

const FilterPill = memo(function FilterPill({
  label,
  value,
  options,
  onValueChange,
  tinted = true,
  className,
}) {
  const radixValue = value === '' || value == null ? 'all' : String(value);
  const isSet = radixValue !== 'all';
  const selected = options.find((option) => option.value === radixValue);

  return (
    <Select
      value={radixValue}
      onValueChange={(next) => onValueChange(next === 'all' ? '' : next)}
    >
      <SelectTrigger
        aria-label={label}
        className={cn(pillTriggerClass(isSet, tinted), className)}
      >
        <span className="flex min-w-0 items-center gap-1.5">
          <span
            className={cn(
              'shrink-0 text-[11px] font-semibold uppercase tracking-wide',
              isSet && tinted
                ? 'text-[var(--primaryColor)]/70'
                : 'text-gray-400',
            )}
          >
            {label}
          </span>
          <span className="truncate">{selected?.label ?? 'All'}</span>
        </span>
      </SelectTrigger>
      <SelectContent position="popper" align="start" className="rounded-xl">
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="rounded-lg"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
});

const Chip = memo(function Chip({ label, tint, onRemove }) {
  return (
    <div
      className={cn(
        'inline-flex max-w-full items-center gap-1.5 rounded-full py-1 pr-1 pl-3 text-xs font-medium',
        CHIP_TINTS[tint] || CHIP_TINTS.gray,
      )}
    >
      <span className="min-w-0 truncate">{label}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="grid size-5 shrink-0 place-items-center rounded-full opacity-60 transition hover:bg-black/5 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primaryColor)]/40"
      >
        <CloseIcon className="size-3" />
      </button>
    </div>
  );
});

const ActiveFilterChips = memo(function ActiveFilterChips({
  filters,
  onRemove,
  onClearAll,
}) {
  const chips = [];

  if (filters.search) {
    chips.push({
      key: 'search',
      label: `Search: "${filters.search}"`,
      tint: 'blue',
    });
  }
  if (filters.category) {
    chips.push({
      key: 'category',
      label: `Category: ${filters.category}`,
      tint: 'green',
    });
  }
  if (filters.flags) {
    chips.push({
      key: 'flags',
      label: `Flag: ${filters.flags}`,
      tint: 'purple',
    });
  }
  if (filters.stock) {
    chips.push({
      key: 'stock',
      label: `Stock: ${filters.stock === 'in' ? 'In Stock' : 'Out of Stock'}`,
      tint: 'orange',
    });
  }
  if (filters.sort) {
    const sortLabel =
      SORT_OPTIONS.find((option) => option.value === filters.sort)?.label ||
      filters.sort;
    chips.push({ key: 'sort', label: `Sort: ${sortLabel}`, tint: 'gray' });
  }

  if (chips.length === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <Chip
          key={chip.key}
          label={chip.label}
          tint={chip.tint}
          onRemove={() => onRemove(chip.key)}
        />
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-gray-500 transition hover:text-[var(--primaryColor)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primaryColor)]/40"
      >
        <RotateCcw className="size-3" />
        Clear all
      </button>
    </div>
  );
});

const MobileToolbar = memo(function MobileToolbar({
  activeCount,
  sortLabel,
  onOpenFilters,
  onOpenSort,
}) {
  const baseBtn =
    'inline-flex h-10 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 shadow-xs transition-all duration-200 hover:border-gray-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--primaryColor)]/10';

  return (
    <div className="mb-4 flex items-center justify-between gap-3 md:hidden">
      <button
        type="button"
        onClick={onOpenFilters}
        aria-label="Open filters"
        className={baseBtn}
      >
        <SlidersHorizontal className="size-4 text-[var(--primaryColor)]" />
        Filters
        {activeCount > 0 && (
          <span className="primaryBgColor accentTextColor grid h-5 min-w-5 place-items-center rounded-full px-1 text-[10px] font-bold">
            {activeCount}
          </span>
        )}
      </button>
      <button
        type="button"
        onClick={onOpenSort}
        aria-label="Open sort options"
        className={cn(baseBtn, 'max-w-[55%]')}
      >
        <ArrowDownWideNarrow className="size-4 shrink-0 text-[var(--primaryColor)]" />
        <span className="truncate">{sortLabel}</span>
      </button>
    </div>
  );
});

const ProductFilterToolbar = ({ filters, onFilterChange, totalProducts }) => {
  const { categories } = useCategoryStore();
  const { flags, fetchFlags } = useFlagStore();

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [sortSheetOpen, setSortSheetOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search);
  const searchTimeoutRef = useRef(null);

  const memoizedCategories = useMemo(() => categories || [], [categories]);
  const memoizedFlags = useMemo(
    () => (flags || []).filter((flag) => flag.isActive),
    [flags],
  );

  const categoryOptions = useMemo(
    () => [
      { value: 'all', label: 'All categories' },
      ...memoizedCategories.map((cat) => ({
        value: cat.name,
        label: cat.name,
      })),
    ],
    [memoizedCategories],
  );

  const flagOptions = useMemo(
    () => [
      { value: 'all', label: 'All flags' },
      ...memoizedFlags.map((flag) => ({ value: flag.name, label: flag.name })),
    ],
    [memoizedFlags],
  );

  const stockOptions = STOCK_OPTIONS;
  const sortOptions = useMemo(
    () => SORT_OPTIONS.map(({ value, label }) => ({ value, label })),
    [],
  );
  const limitOptions = useMemo(
    () => LIMIT_OPTIONS.map((n) => ({ value: String(n), label: `${n} items` })),
    [],
  );

  // Sync local search box when the URL-driven value changes (back/forward, chip removal)
  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  useEffect(() => {
    if (!flags || flags.length === 0) {
      fetchFlags();
    }
  }, [fetchFlags, flags]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSearchChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchInput(value);

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        onFilterChange({ search: value, page: 1 });
      }, 500);
    },
    [onFilterChange],
  );

  const handleClearSearch = useCallback(() => {
    setSearchInput('');
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    onFilterChange({ search: '', page: 1 });
  }, [onFilterChange]);

  const handleFieldChange = useCallback(
    (name, value) => {
      onFilterChange({ [name]: value, page: 1 });
    },
    [onFilterChange],
  );

  const handleSortChange = useCallback(
    (sortValue) => {
      onFilterChange({ sort: sortValue, page: 1 });
      setSortSheetOpen(false);
    },
    [onFilterChange],
  );

  const handleRemoveChip = useCallback(
    (key) => {
      if (key === 'search') {
        setSearchInput('');
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }
      }
      onFilterChange({ [key]: '', page: 1 });
    },
    [onFilterChange],
  );

  const handleClearAll = useCallback(() => {
    setSearchInput('');
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    onFilterChange({
      search: '',
      category: '',
      flags: '',
      stock: '',
      sort: '',
      page: 1,
    });
  }, [onFilterChange]);

  const activeCount = useMemo(
    () =>
      ['search', 'category', 'flags', 'stock', 'sort'].filter(
        (key) => filters[key],
      ).length,
    [filters],
  );

  const currentSort =
    SORT_OPTIONS.find((option) => option.value === (filters.sort || 'all')) ||
    SORT_OPTIONS[0];

  return (
    <>
      <MobileToolbar
        activeCount={activeCount}
        sortLabel={
          currentSort.value === 'all' ? 'Sort' : currentSort.shortLabel
        }
        onOpenFilters={() => setFilterDrawerOpen(true)}
        onOpenSort={() => setSortSheetOpen(true)}
      />

      {/* Mobile filter drawer */}
      <Drawer
        anchor="left"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        className="w-[320px] max-w-[88vw] rounded-r-3xl"
        aria-label="Filter options"
      >
        <div className="flex h-full flex-col">
          <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-3.5">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Filters</h2>
              <p className="text-xs text-gray-500">Narrow down products</p>
            </div>
            <button
              type="button"
              onClick={() => setFilterDrawerOpen(false)}
              aria-label="Close filters"
              className="grid size-9 place-items-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
            >
              <CloseIcon className="size-4" />
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            <SearchField
              value={searchInput}
              onChange={handleSearchChange}
              onClear={handleClearSearch}
            />
            <FilterPill
              label="Category"
              value={filters.category}
              options={categoryOptions}
              onValueChange={(value) => handleFieldChange('category', value)}
            />
            <FilterPill
              label="Flag"
              value={filters.flags}
              options={flagOptions}
              onValueChange={(value) => handleFieldChange('flags', value)}
            />
            <FilterPill
              label="Stock"
              value={filters.stock}
              options={stockOptions}
              onValueChange={(value) => handleFieldChange('stock', value)}
            />
            <FilterPill
              label="Sort"
              value={filters.sort}
              options={sortOptions}
              onValueChange={(value) => handleFieldChange('sort', value)}
            />
          </div>

          <div className="flex shrink-0 gap-2 border-t border-gray-100 p-3">
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full border border-gray-200 text-sm font-semibold text-gray-600 transition hover:border-[var(--primaryColor)]/40 hover:text-[var(--primaryColor)]"
            >
              <RotateCcw className="size-3.5" />
              Clear all
            </button>
            <button
              type="button"
              onClick={() => setFilterDrawerOpen(false)}
              className="primaryBgColor accentTextColor inline-flex h-11 flex-[1.4] items-center justify-center rounded-full text-sm font-semibold shadow-sm transition hover:opacity-90"
            >
              {typeof totalProducts === 'number'
                ? `Show ${totalProducts} product${totalProducts === 1 ? '' : 's'}`
                : 'Show results'}
            </button>
          </div>
        </div>
      </Drawer>

      {/* Mobile sort sheet */}
      <Drawer
        anchor="bottom"
        open={sortSheetOpen}
        onClose={() => setSortSheetOpen(false)}
        className="h-auto max-h-[80vh] rounded-t-3xl"
        aria-label="Sort options"
      >
        <div className="flex flex-col">
          <div className="touch-none px-4 pt-3 pb-1">
            <div className="mx-auto h-1.5 w-10 rounded-full bg-gray-300" />
          </div>
          <div className="flex items-center justify-between px-4 pb-2">
            <h2 className="text-base font-semibold text-gray-900">Sort by</h2>
            <button
              type="button"
              onClick={() => setSortSheetOpen(false)}
              aria-label="Close sort options"
              className="grid size-9 place-items-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
            >
              <CloseIcon className="size-4" />
            </button>
          </div>

          <div className="max-h-[60vh] space-y-1 overflow-y-auto px-3 pb-6">
            {SORT_OPTIONS.map(({ value, label, icon: Icon }) => {
              const selected = (filters.sort || 'all') === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleSortChange(value === 'all' ? '' : value)}
                  aria-pressed={selected}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm transition',
                    selected
                      ? 'bg-[var(--primaryColor)]/5 text-[var(--primaryColor)]'
                      : 'text-gray-700 hover:bg-gray-50',
                  )}
                >
                  <span
                    className={cn(
                      'grid size-9 shrink-0 place-items-center rounded-full',
                      selected
                        ? 'primaryBgColor accentTextColor'
                        : 'bg-gray-100 text-gray-500',
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="flex-1 font-medium">{label}</span>
                  {selected && <Check className="size-4 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </Drawer>

      {/* Desktop filter bar */}
      <div className="mb-6 hidden md:block">
        <div className="rounded-2xl border border-gray-200/80 bg-white p-3 shadow-xs">
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4 md:col-span-3">
              <FilterPill
                label="Category"
                value={filters.category}
                options={categoryOptions}
                onValueChange={(value) => handleFieldChange('category', value)}
              />
            </div>
            <div className="col-span-4 md:col-span-3">
              <FilterPill
                label="Flag"
                value={filters.flags}
                options={flagOptions}
                onValueChange={(value) => handleFieldChange('flags', value)}
              />
            </div>
            <div className="col-span-4 md:col-span-2">
              <FilterPill
                label="Stock"
                value={filters.stock}
                options={stockOptions}
                onValueChange={(value) => handleFieldChange('stock', value)}
              />
            </div>
            <div className="col-span-6 md:col-span-2">
              <FilterPill
                label="Sort"
                value={filters.sort}
                options={sortOptions}
                onValueChange={(value) => handleFieldChange('sort', value)}
              />
            </div>
            <div className="col-span-6 md:col-span-2">
              <FilterPill
                label="Per page"
                value={String(filters.limit)}
                options={limitOptions}
                tinted={false}
                onValueChange={(value) =>
                  handleFieldChange('limit', parseInt(value, 10))
                }
              />
            </div>
          </div>
        </div>
      </div>

      <ActiveFilterChips
        filters={filters}
        onRemove={handleRemoveChip}
        onClearAll={handleClearAll}
      />
    </>
  );
};

export default ProductFilterToolbar;
