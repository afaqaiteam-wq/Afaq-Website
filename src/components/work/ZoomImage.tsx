"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef, type ReactNode } from "react";

/**
 * Wraps a screenshot preview in a button that opens the full image in a modal dialog.
 * On phones the full image is shown wider than the screen, so it can be panned and read;
 * the native <dialog> handles focus, Escape and the backdrop.
 */
export function ZoomImage({
  full,
  alt,
  hint,
  close,
  children,
}: {
  full: StaticImageData;
  alt: string;
  hint: string;
  close: string;
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = () => {
    window.__lenis?.stop();
    dialogRef.current?.showModal();
  };
  const shut = () => dialogRef.current?.close();

  return (
    <>
      <button type="button" onClick={open} className="group relative block w-full cursor-zoom-in text-start" aria-label={`${hint}: ${alt}`}>
        {children}
        <span className="pointer-events-none absolute bottom-3 end-3 z-[2] inline-flex items-center gap-2 rounded-pill border border-white/15 bg-bg/70 px-3 py-1.5 text-xs text-soft backdrop-blur-md transition-colors group-hover:border-lav/50 group-hover:text-ink sm:bottom-5 sm:end-5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
          {hint}
        </span>
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => window.__lenis?.start()}
        onClick={(e) => {
          if (e.target === e.currentTarget) shut();
        }}
        aria-label={alt}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 text-ink backdrop:bg-bg/90 backdrop:backdrop-blur-md"
      >
        <div className="flex h-full flex-col">
          <div className="flex justify-end p-4 pt-[max(1rem,env(safe-area-inset-top))]">
            <button
              type="button"
              onClick={shut}
              className="inline-flex size-11 items-center justify-center rounded-xl border border-line bg-bg/80"
              aria-label={close}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-auto overscroll-contain px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <Image
              src={full}
              alt={alt}
              sizes="(min-width: 640px) 1600px, 220vw"
              className="mx-auto h-auto w-[220vw] max-w-none rounded-2xl border border-white/10 sm:w-full sm:max-w-[1600px]"
            />
          </div>
        </div>
      </dialog>
    </>
  );
}
