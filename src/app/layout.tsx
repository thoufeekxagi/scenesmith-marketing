import type {Metadata, Viewport} from "next";
import {OG_IMAGE, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME, SITE_TITLE, SITE_URL} from "../lib/seo";
import "./globals.css";
import "./app-clean.css";
import {Plus_Jakarta_Sans} from "next/font/google";
import {GoogleAnalytics} from "../components/google-analytics";

const jakarta = Plus_Jakarta_Sans({subsets: ["latin"], variable: "--font-jakarta", display: "swap"});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: SITE_KEYWORDS,
  authors: [{name: "Thoufeek Baber", url: "https://www.linkedin.com/in/thoufeekx"}],
  creator: "Thoufeek Baber",
  alternates: {canonical: "/"},
  robots: {index: true, follow: true, googleBot: {index: true, follow: true, "max-image-preview": "large", "max-snippet": -1}},
  openGraph: {type: "website", url: "/", siteName: SITE_NAME, title: SITE_TITLE, description: SITE_DESCRIPTION, locale: "en_CA", images: [{...OG_IMAGE}]},
  twitter: {card: "summary_large_image", title: SITE_TITLE, description: SITE_DESCRIPTION, images: [OG_IMAGE.url]},
  icons: {icon: "/favicon.svg"},
  category: "technology"
};

export const viewport: Viewport = {themeColor: "#183c2b"};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalytics />
        <link rel="stylesheet" href="/trial-modal-fix.css?v=20260918-3" />
      </head>
      <body className={jakarta.variable}>{children}</body>
    </html>
  );
}
