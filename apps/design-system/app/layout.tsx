import type { Metadata } from "next";
import { sourceSans, sourceSerif, jetbrainsMono } from "./fonts";
import { DesignNav } from "@/components/design-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Frontpage Design System",
  description: "Design system explorations for Frontpage",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sourceSans.variable} ${sourceSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <DesignNav />
        {children}
      </body>
    </html>
  );
}
