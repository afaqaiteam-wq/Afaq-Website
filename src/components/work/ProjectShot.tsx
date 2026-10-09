import Image from "next/image";

import type { Project } from "@/content/work";
import { ZoomImage } from "@/components/work/ZoomImage";

/**
 * A project's screenshot in its glowing frame: a readable crop on phones, the whole dashboard
 * on larger screens, and a full-screen view on tap. Used on the Work page and on project pages.
 */
export function ProjectShot({
  project: p,
  zoomHint,
  closeLabel,
  priority = false,
}: {
  project: Project;
  zoomHint: string;
  closeLabel: string;
  priority?: boolean;
}) {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-y-10 inset-x-0 rounded-[48px] sm:-inset-x-6 bg-[radial-gradient(60%_55%_at_50%_45%,rgb(124_77_255/0.38),transparent_75%)] blur-2xl"
      />
      {/* A subtle tilt that straightens as it reveals (globals.css .work-tilt) */}
      <div className="work-tilt relative rounded-[18px] border border-white/12 bg-surface/80 p-1.5 shadow-[0_50px_120px_-40px_rgb(124_77_255/0.6),0_0_0_1px_rgb(200_168_255/0.08)] sm:rounded-[22px] sm:p-2">
        <div
          aria-hidden="true"
          className="absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,#c8a8ff,transparent)]"
        />
        <ZoomImage full={p.image} alt={p.imageAlt} hint={zoomHint} close={closeLabel}>
          <Image
            src={p.mobileImage}
            alt={p.imageAlt}
            placeholder="blur"
            sizes="calc(100vw - 32px)"
            className="h-auto w-full rounded-[12px] md:hidden"
          />
          <Image
            src={p.image}
            alt={p.imageAlt}
            placeholder="blur"
            sizes="(min-width: 1440px) 1330px, calc(100vw - 64px)"
            priority={priority}
            className="hidden h-auto w-full rounded-[16px] md:block"
          />
        </ZoomImage>
      </div>
    </div>
  );
}
