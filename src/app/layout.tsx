import type React from "react";
import type { Metadata } from "next";
import { Lato } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { Suspense } from "react";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ReactQueryProvider } from "@/src/providers/react-query";

export const metadata: Metadata = {
  title: "CRM System",
  description: "Sistema completo de CRM para gestão de relacionamento com clientes",
};
const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-lato", // 👈 define uma CSS variable
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`font-lato ${lato.variable}`}>
        <ReactQueryProvider>
          <NuqsAdapter>
            <Suspense fallback={null}>
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
              >
                {children}
                <Toaster position="bottom-center" richColors />
              </ThemeProvider>
            </Suspense>
            <Analytics />
          </NuqsAdapter>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
