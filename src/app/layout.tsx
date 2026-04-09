import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { I18nProvider } from '@/lib/i18n';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Digital Lost & Found',
  description: 'Smart, AI-powered secure platform for recovering lost items using QR codes.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-background text-foreground flex flex-col`}>
        <I18nProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <footer className="border-t py-6 md:py-0">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4">
              <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                Built for Hackathon. Digital Lost & Found © 2026.
              </p>
            </div>
          </footer>
        </I18nProvider>
      </body>
    </html>
  );
}
