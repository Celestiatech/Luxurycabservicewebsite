import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Affordable Cabs Ltd - Premium Transport in Auckland, NZ | 24/7 Service',
  description: 'Book affordable cabs in Auckland with Affordable Cabs Ltd. Premium airport transfers, city tours, wedding services & intercity travel. Professional drivers, 24/7 service, fixed prices. Call +64 27 777 7242',
  keywords: 'affordable cabs Auckland, cab booking, airport transfer Auckland, taxi service New Zealand, wedding car hire, city tours Auckland',
  authors: [{ name: 'Affordable Cabs Ltd' }],
  creator: 'Affordable Cabs Ltd',
  publisher: 'Affordable Cabs Ltd',
  robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  alternates: {
    canonical: 'https://affordablecabsltd.nz',
  },
  openGraph: {
    type: 'website',
    locale: 'en_NZ',
    url: 'https://affordablecabsltd.nz',
    siteName: 'Affordable Cabs Ltd',
    title: 'Affordable Cabs Ltd - Premium Transport in Auckland, NZ',
    description: 'Book affordable cabs in Auckland. Professional drivers, 24/7 service, airport transfers, wedding cars & city tours.',
    images: [
      {
        url: 'https://affordablecabsltd.nz/logo-square.png',
        width: 400,
        height: 400,
        alt: 'Affordable Cabs Ltd - Premium Transportation',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Affordable Cabs Ltd - Auckland Transport',
    description: 'Professional cab service in Auckland. Book now for airport transfers, tours & more.',
    creator: '@affordablecabs',
  },
  formatDetection: {
    email: false,
    telephone: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1f2937',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://affordablecabsltd.nz',
  name: 'Affordable Cabs Ltd',
  image: 'https://affordablecabsltd.nz/logo-square.png',
  description: 'Premium affordable transportation services in Auckland, New Zealand',
  telephone: '+64 27 777 7242',
  email: 'Luxurycabsltd@gmail.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Auckland',
    addressRegion: 'Auckland',
    addressCountry: 'NZ',
  },
  areaServed: [
    'Auckland',
    'Hamilton',
    'Rotorua',
    'Tauranga',
    'Wellington',
    'Queenstown',
    'New Zealand',
  ],
  priceRange: '$$',
  sameAs: [
    'https://www.facebook.com/affordablecabsltd',
    'https://www.instagram.com/affordablecabsltd',
    'https://wa.me/64277777242',
  ],
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'NZD',
    lowPrice: '65',
    highPrice: '350',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://cdn.shopify.com" />
        <link rel="icon" href="/logo-square.png" type="image/png" />
        <link rel="shortcut icon" href="/logo-square.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo-square.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#1f2937" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="theme-color" content="#1f2937" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
