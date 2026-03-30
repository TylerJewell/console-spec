import { Chip } from "@heroui/chip";

interface StatusChipProps {
  value: string;
  color: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  label?: string;
}

function formatValue(value: string): string {
  const text = value.replace(/_/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function StatusChip({ value, color, label }: StatusChipProps) {
  return (
    <Chip
      size="sm"
      radius="sm"
      color={color}
      classNames={{ content: "text-tiny font-[450] dark:font-[400]" }}
    >
      {label || formatValue(value)}
    </Chip>
  );
}
