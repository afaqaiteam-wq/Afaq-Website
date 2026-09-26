import Image from "next/image";

import mark from "@/assets/brand/logo-mark.png";

/** The Afaq AI mark, cropped from the original logo file (the artwork itself is unchanged). */
export function LogoMark({ size, alt = "", priority = false }: { size: number; alt?: string; priority?: boolean }) {
  return <Image src={mark} alt={alt} width={size} height={size} priority={priority} sizes={`${size}px`} />;
}
