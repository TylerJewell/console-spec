import type { InputHTMLAttributes } from "react";
import { FormLabel } from "./FormLabel";
import { FormErrors } from "./FormErrors";

interface FormInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className"> {
  label: string;
  id: string;
  required?: boolean;
  errors?: string[];
  className?: string;
  widthClassName?: string;
}

export function FormInput({
  label,
  id,
  required,
  errors = [],
  className = "",
  widthClassName = "w-80",
  ...rest
}: FormInputProps) {
  const hasError = errors.length > 0;

  return (
    <div className={className}>
      <FormLabel label={label} id={id} required={required} />
      <input
        id={id}
        required={required}
        className={`${widthClassName} bg-content2 border border-content4 rounded-small text-small px-3 py-2 outline-none focus:outline-primary ${
          hasError ? "outline-danger" : ""
        }`}
        {...rest}
      />
      <FormErrors errors={errors} />
    </div>
  );
}
