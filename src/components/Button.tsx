import type {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  PropsWithChildren,
} from "react";

type ButtonProps = PropsWithChildren<
  DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > & { loading?: boolean; variant?: "outline" | "fill" }
>;

export default function Button({
  children,
  className,
  loading,
  variant,
  ...props
}: ButtonProps) {
  const variantClass =
    variant === "outline"
      ? "border border-fuchsia-700 text-fuchsia-700 hover:bg-pink-100"
      : "bg-fuchsia-700 hover:bg-pink-600 text-white";

  return (
    <button
      className={`flex gap-2 items-center rounded-lg px-4 py-2 select-none ${variantClass} ${className}`}
      {...props}
    >
      {loading && <img className="animate-spin w-6" src="/loading.svg" />}
      {children}
    </button>
  );
}
