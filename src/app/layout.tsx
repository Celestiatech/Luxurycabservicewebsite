import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'Luxury Cab Service',
  description: 'Luxury cab booking with Shopify checkout',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://cdn.shopify.com" />
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
