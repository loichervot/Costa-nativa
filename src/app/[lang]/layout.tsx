import { Fraunces, Inter } from "next/font/google";

import { isLocale, locales } from "@/lib/dictionaries";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Only the `opsz` axis is requested. Fraunces also ships `SOFT` and `WONK`
 * character axes, but nothing here varies them, and carrying them cost ~70KB
 * of font that competed with the hero image on mobile. `opsz` earns its place:
 * globals.css drives it through `font-optical-sizing: auto`, which is what
 * keeps the 72px hero headline from looking like scaled-up body copy.
 */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;

  return (
    <html
      lang={isLocale(lang) ? lang : "en"}
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
