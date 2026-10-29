import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WalletProvider } from "@/lib/wallet";
import { SITE } from "@/site.config";

export const metadata: Metadata = {
  metadataBase: new URL(`https://${SITE.domain}`),
  title: `${SITE.name} — ${SITE.tagline}`,
  description: "Launch a coin on pump.fun in 60 seconds, stamp its Deed of Fees, and use 6 free trench tools. $" + SITE.ticker,
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: "Launch a coin. Stamp the deed. Track every fee. Free Solana toolbox.",
    url: `https://${SITE.domain}`,
    images: ["/og.png"],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};
export const viewport: Viewport = { themeColor: "#0b0b0e" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600..900;1,9..144,600..900&family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">
        <WalletProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </WalletProvider>
      </body>
    </html>
  );
}
