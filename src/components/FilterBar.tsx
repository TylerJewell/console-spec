import { Button } from "@heroui/button";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterDef {
  name: string;
  label: string;
  options: FilterOption[];
  value: string;
}

interface FilterBarProps {
  filters: FilterDef[];
  onFilterChange: (name: string, value: string) => void;
  onClear: () => void;
}

export function FilterBar({ filters, onFilterChange, onClear }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {filters.map((filter) => (
        <select
          key={filter.name}
          value={filter.value}
          onChange={(e) => onFilterChange(filter.name, e.target.value)}
          className="bg-content2 border border-content4 rounded-small text-tiny px-2 py-1.5 outline-none focus:outline-primary"
          aria-label={filter.label}
        >
          <option value="">{filter.label}</option>
          {filter.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ))}
      <Button variant="light" size="sm" onPress={onClear}>
        Clear
      </Button>
    </div>
  );
}
