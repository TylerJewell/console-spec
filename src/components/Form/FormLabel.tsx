export function FormLabel({
  label,
  id,
  required = false,
}: {
  label: string;
  id: string;
  required?: boolean;
}) {
  return (
    <label
      className="block mb-1 text-tiny font-[550] dark:font-[500]"
      htmlFor={id}
    >
      {label}
      {required ? " *" : ""}
    </label>
  );
}
