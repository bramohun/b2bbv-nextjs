/**
 * ============================================================================
 * FUNKCIONÁLIS SPECIFIKÁCIÓ (FSR) - ROOT LAYOUT
 * ============================================================================
 * 
 * HASZNÁLAT ÉS CÉL:
 * A teljes portál gyökér elrendezése. Betölti az arculati tipográfiát (Ubuntu Google Font),
 * a Material Symbols ikonkészletet, a globális CSS stílusokat, valamint biztosítja
 * a hitelesítési környezetet (AuthProvider).
 * 
 * USER STORYK:
 * - Felhasználóként szeretném, hogy az oldal arculata, betűtípusa és vizuális
 *   megjelenése megegyezzen a hivatalos BENU márka és a benuveny.hu stílusával.
 * 
 * KAPCSOLÓDÓ ELEMEK:
 * - src/app/globals.css
 * - src/context/AuthContext.tsx
 * ============================================================================
 */

import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "BENUvény Orvosi Portál",
  description: "Benuveny Orvosi Készlet és Információs Portál",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu" data-theme="BV2026">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body
        className={`${ubuntu.variable} font-sans antialiased bg-[#F9F9FB] text-[#002664]`}
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
