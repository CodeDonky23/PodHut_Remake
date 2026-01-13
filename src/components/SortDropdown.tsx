import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SortOption } from "@/types/podcast";

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px] bg-secondary border-border">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="a-z">Title A–Z</SelectItem>
        <SelectItem value="z-a">Title Z–A</SelectItem>
        <SelectItem value="date-desc">Recently Updated</SelectItem>
        <SelectItem value="date-asc">Oldest First</SelectItem>
      </SelectContent>
    </Select>
  );
}
