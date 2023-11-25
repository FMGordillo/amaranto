import type {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  PropsWithChildren,
} from "react";

type ButtonVariant = "outline" | "fill";

type ButtonProps = PropsWithChildren<
  DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > & { loading?: boolean; variant?: ButtonVariant }
>;

export const getButtonClass = (variant: ButtonVariant | undefined) =>
  `flex select-none items-center gap-2 rounded-lg px-4 py-2 ${
    variant === "outline"
      ? "border border-fuchsia-700 text-fuchsia-700 hover:bg-pink-100"
      : "bg-fuchsia-700 hover:bg-pink-600 text-white"
  }`;

export default function Button({
  children,
  className,
  loading,
  variant,
  ...props
}: ButtonProps) {
  const baseClassName = getButtonClass(variant);

  return (
    <button className={`${baseClassName} ${className}`} {...props}>
      {loading && <img className="w-6 animate-spin" src="/loading.svg" />}
      {children}
    </button>
  );
}
