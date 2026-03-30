import type { SelectHTMLAttributes } from "react";
import { FormLabel } from "./FormLabel";
import { FormErrors } from "./FormErrors";

interface FormSelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "id" | "className"> {
  label: string;
  id: string;
  required?: boolean;
  errors?: string[];
  className?: string;
  widthClassName?: string;
  options: { value: string; label: string }[];
}

export function FormSelect({
  label,
  id,
  required,
  errors = [],
  className = "",
  widthClassName = "w-80",
  options,
  ...rest
}: FormSelectProps) {
  const hasError = errors.length > 0;

  return (
    <div className={className}>
      <FormLabel label={label} id={id} required={required} />
      <select
        id={id}
        required={required}
        className={`${widthClassName} bg-content2 border border-content4 rounded-small text-small px-3 py-2 outline-none focus:outline-primary ${
          hasError ? "outline-danger" : ""
        }`}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <FormErrors errors={errors} />
    </div>
  );
}
