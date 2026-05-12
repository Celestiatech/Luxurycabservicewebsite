import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'Luxury Cab Service',
  description: 'Luxury cab booking with Shopify checkout',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

