import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Betaflix - Streaming Anime Rasa Nusantara",
    template: "%s | Betaflix"
  },
  description: "Nikmati koleksi anime terlengkap dengan sentuhan Nusantara. Streaming gratis, kualitas terbaik.",
  keywords: ["anime", "streaming", "indonesia", "nusantara", "betaflix"],
  authors: [{ name: "Betaflix Team" }],
  openGraph: {
    title: "Betaflix - Streaming Anime Rasa Nusantara",
    description: "Nikmati koleksi anime terlengkap dengan sentuhan Nusantara",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "Betaflix - Streaming Anime Rasa Nusantara",
    description: "Nikmati koleksi anime terlengkap dengan sentuhan Nusantara",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-background text-foreground`}>
        <ThemeProvider>
          <div className="flex flex-col min-h-screen w-full relative overflow-x-hidden">
            <Navbar />
            <main className="flex-1 w-full relative z-0">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
