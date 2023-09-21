import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'React Email',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-slate-12 font-sans">
        <div className={`${inter.variable} font-sans`}>{children}</div>
      </body>
    </html>
  );
}
