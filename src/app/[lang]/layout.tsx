import type { Viewport } from "next";
import { Fraunces, Geist } from "next/font/google";

import { isLocale, locales } from "@/lib/dictionaries";
import "../scrollcraft.css";
import "../globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Only the `opsz` axis is requested. Fraunces also ships `SOFT` and `WONK`
 * character axes, but nothing here varies them, and carrying them cost ~70KB
 * of font. `opsz` earns its place: globals.css drives it through
 * `font-optical-sizing: auto`, which keeps the large display lines from
 * looking like scaled-up body copy.
 */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
});

// The film runs under the notch and the home bar; globals.css insets the
// chrome and the copy by the safe areas.
export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#14110e",
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;

  return (
    <html lang={isLocale(lang) ? lang : "en"} className={`${geist.variable} ${fraunces.variable}`}>
      <body>{children}</body>
    </html>
  );
}
