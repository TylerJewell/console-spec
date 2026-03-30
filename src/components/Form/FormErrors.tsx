export function FormErrors({ errors }: { errors: string[] }) {
  if (!errors.length) return null;
  return (
    <div className="mt-1">
      {errors.map((e, i) => (
        <p key={i} className="text-tiny text-danger">
          {e}
        </p>
      ))}
    </div>
  );
}
