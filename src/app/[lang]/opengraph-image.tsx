import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { isLocale, locales } from "@/i18n/config";
import { ar } from "@/i18n/dictionaries/ar";
import { en } from "@/i18n/dictionaries/en";

export const alt = "Afaq AI · AI agents, automation and custom software";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Render both images at build time.
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const asset = (...p: string[]) => readFile(join(process.cwd(), "src/assets", ...p));

/**
 * The image renderer does not reorder right-to-left text reliably, so Arabic lines are laid
 * out word by word: each word is shaped on its own and the row runs right to left.
 */
function Words({ text, rtl, gap }: { text: string; rtl: boolean; gap: number }) {
  if (!rtl) return <>{text}</>;
  return (
    <div style={{ display: "flex", flexDirection: "row-reverse", flexWrap: "wrap", justifyContent: "flex-start" }}>
      {text.split(" ").map((w, i) => (
        <span key={i} style={{ display: "flex", flexShrink: 0, marginRight: i === 0 ? 0 : gap }}>
          {w}
        </span>
      ))}
    </div>
  );
}

export default async function OpenGraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  const lang = isLocale(raw) ? raw : "en";
  const dict = lang === "ar" ? ar : en;
  const rtl = lang === "ar";

  const [mark, sora, plexArabic] = await Promise.all([
    asset("brand", "og-mark.png"),
    asset("fonts", "Sora-SemiBold.ttf"),
    asset("fonts", "IBMPlexSansArabic-SemiBold.ttf"),
  ]);
  const markSrc = `data:image/png;base64,${mark.toString("base64")}`;
  const font = rtl ? "Plex Arabic" : "Sora";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: rtl ? "row-reverse" : "row",
          alignItems: "center",
          gap: 56,
          padding: "0 88px",
          background: "radial-gradient(circle at 24% 50%, #1c1433 0%, #07060b 58%)",
          color: "#f2f0f7",
          fontFamily: font,
        }}
      >
        <img src={markSrc} width={300} height={300} alt="" />
        <div style={{ display: "flex", flexDirection: "column", gap: 22, flex: 1, alignItems: rtl ? "flex-end" : "flex-start" }}>
          <div style={{ display: "flex", fontSize: rtl ? 30 : 26, color: "#c8a8ff", letterSpacing: rtl ? 0 : 4, textTransform: rtl ? "none" : "uppercase" }}>
            <Words text={dict.hero.eyebrow} rtl={rtl} gap={10} />
          </div>
          <div
            style={{
              fontSize: rtl ? 96 : 60,
              lineHeight: rtl ? 1.35 : 1.08,
              letterSpacing: rtl ? 0 : -2,
              textAlign: rtl ? "right" : "left",
              display: "flex",
            }}
          >
            {rtl ? <Words text={dict.meta.siteName} rtl gap={22} /> : `${dict.hero.title} ${dict.hero.titleAccent}`}
          </div>
          {!rtl && <div style={{ fontSize: 30, color: "#a9a4b8", display: "flex" }}>{dict.meta.siteName}</div>}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Sora", data: sora, weight: 600, style: "normal" },
        { name: "Plex Arabic", data: plexArabic, weight: 600, style: "normal" },
      ],
    },
  );
}
