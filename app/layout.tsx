import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PIXZEN — Future-First Digital Studio',
  description: 'Elite AI, digital product and brand experiences by PIXZEN.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,600,700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div className="grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}