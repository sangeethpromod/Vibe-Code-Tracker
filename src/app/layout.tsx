import type { Metadata } from "next";
import { Poiret_One } from "next/font/google";
import "./globals.css";

const poiretOne = Poiret_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-poiret-one",
});

export const metadata: Metadata = {
  title: "Ramavarma Thampuran AI",
  description: "Brutally honest weekly reflection system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poiretOne.variable} antialiased`} style={{ fontFamily: 'var(--font-poiret-one)' }}>
        {children}
      </body>
    </html>
  );
}
