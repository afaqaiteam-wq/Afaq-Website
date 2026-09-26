import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "ghost";
type Size = "md" | "sm";

const base =
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-pill font-medium transition-colors duration-200";

const variants: Record<Variant, string> = {
  primary: "bg-lav text-on-lav hover:bg-lav-hover",
  ghost: "border border-white/15 text-ink hover:border-lav/55",
};

const sizes: Record<Size, string> = {
  md: "h-12 px-6 text-[15px]",
  sm: "h-10 px-[18px] text-sm",
};

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  /** Opens in a new tab (booking links, social profiles). */
  external?: boolean;
  arrow?: boolean;
  className?: string;
  onClick?: () => void;
}

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  external = false,
  arrow = false,
  className = "",
  onClick,
}: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  const content = (
    <>
      {children}
      {arrow && <ArrowIcon />}
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} onClick={onClick}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} onClick={onClick}>
      {content}
    </Link>
  );
}

export function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 rtl:-scale-x-100 ${className}`}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
