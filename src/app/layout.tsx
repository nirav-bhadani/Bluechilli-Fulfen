import type { Metadata, Viewport } from "next";
import { Outfit, Architects_Daughter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const architects = Architects_Daughter({
  variable: "--font-hand",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

const siteUrl = "https://www.fulfen.staffs.sch.uk";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Fulfen Primary School — Where Learning Comes Alive",
    template: "%s · Fulfen Primary School",
  },
  description:
    "Fulfen Primary School in Burntwood, Staffordshire — a caring school where every child is known, valued and inspired, with a friendly assistant to answer parents' questions.",
  keywords: [
    "Fulfen Primary School",
    "Burntwood primary school",
    "Staffordshire school",
    "primary school admissions",
    "WS7 9BJ school",
  ],
  authors: [{ name: "Fulfen Primary School" }],
  openGraph: {
    title: "Fulfen Primary School — Where Learning Comes Alive",
    description:
      "A caring school in Burntwood where every child is known, valued and inspired.",
    url: siteUrl,
    siteName: "Fulfen Primary School",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fulfen Primary School — Where Learning Comes Alive",
    description:
      "A caring school in Burntwood where every child is known, valued and inspired.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0407a5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${outfit.variable} ${architects.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
