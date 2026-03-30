import type { TextareaHTMLAttributes } from "react";
import { FormLabel } from "./FormLabel";
import { FormErrors } from "./FormErrors";

interface FormTextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "className"> {
  label: string;
  id: string;
  required?: boolean;
  errors?: string[];
  className?: string;
  widthClassName?: string;
}

export function FormTextarea({
  label,
  id,
  required,
  errors = [],
  className = "",
  widthClassName = "w-80",
  ...rest
}: FormTextareaProps) {
  const hasError = errors.length > 0;

  return (
    <div className={className}>
      <FormLabel label={label} id={id} required={required} />
      <textarea
        id={id}
        required={required}
        className={`${widthClassName} min-h-20 bg-content2 border border-content4 rounded-small text-small px-3 py-2 outline-none focus:outline-primary ${
          hasError ? "outline-danger" : ""
        }`}
        {...rest}
      />
      <FormErrors errors={errors} />
    </div>
  );
}
