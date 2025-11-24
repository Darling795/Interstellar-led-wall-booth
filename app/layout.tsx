import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Interstellar Gala 2025 - LED Wall Photo Booth',
  description: 'Interactive LED wall background controller for Interstellar Gala 2025',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}