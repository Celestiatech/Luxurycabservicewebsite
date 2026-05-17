/**
 * SEO Utilities for Affordable Cabs Ltd
 * Provides structured data helpers and schema generators
 */

export const SITE_CONFIG = {
  name: 'Affordable Cabs Ltd',
  description: 'Premium affordable transportation services in Auckland, New Zealand',
  url: 'https://affordablecabsltd.nz',
  phone: '+64 27 777 7242',
  email: 'Luxurycabsltd@gmail.com',
  locale: 'en-NZ',
};

/**
 * Generate Organization Schema
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo-square.png`,
    description: SITE_CONFIG.description,
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    sameAs: [
      'https://www.facebook.com/affordablecabsltd',
      'https://www.instagram.com/affordablecabsltd',
      'https://wa.me/64277777242',
    ],
  };
}

/**
 * Generate BreadcrumbList Schema
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate FAQPage Schema
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate Service Schema
 */
export function generateServiceSchema(service: {
  name: string;
  description: string;
  provider?: string;
  areaServed?: string[];
  priceRange?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'LocalBusiness',
      name: service.provider || SITE_CONFIG.name,
    },
    areaServed: service.areaServed
      ? service.areaServed.map((area) => ({ '@type': 'City', name: area }))
      : undefined,
    priceRange: service.priceRange,
  };
}

/**
 * Generate AggregateRating Schema
 */
export function generateRatingSchema(
  ratingValue: number,
  ratingCount: number,
  bestRating: number = 5,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    ratingValue: ratingValue.toString(),
    bestRating: bestRating.toString(),
    ratingCount: ratingCount.toString(),
  };
}

/**
 * Generate LocalBusiness Schema
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'TaxiService'],
    '@id': SITE_CONFIG.url,
    name: SITE_CONFIG.name,
    image: `${SITE_CONFIG.url}/logo-square.png`,
    description: SITE_CONFIG.description,
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Auckland',
      addressRegion: 'Auckland',
      addressCountry: 'NZ',
    },
    areaServed: [
      { '@type': 'City', name: 'Auckland' },
      { '@type': 'City', name: 'Hamilton' },
      { '@type': 'City', name: 'Rotorua' },
      { '@type': 'City', name: 'Tauranga' },
      { '@type': 'City', name: 'Wellington' },
      { '@type': 'City', name: 'Queenstown' },
    ],
    url: SITE_CONFIG.url,
    priceRange: '$$',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '500',
    },
  };
}

/**
 * Generate Product/Booking Schema
 */
export function generateOfferSchema(offer: {
  name: string;
  description: string;
  price: number | string;
  currency?: string;
  availability?: 'InStock' | 'OutOfStock';
  validFrom?: string;
  validThrough?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    name: offer.name,
    description: offer.description,
    price: offer.price.toString(),
    priceCurrency: offer.currency || 'NZD',
    availability: offer.availability || 'InStock',
    url: SITE_CONFIG.url,
    ...(offer.validFrom && { validFrom: offer.validFrom }),
    ...(offer.validThrough && { validThrough: offer.validThrough }),
  };
}

/**
 * Generate Contact Point Schema
 */
export function generateContactPointSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPoint',
    telephone: SITE_CONFIG.phone,
    contactType: 'Customer Support',
    email: SITE_CONFIG.email,
    areaServed: 'NZ',
    availableLanguage: 'en',
  };
}

/**
 * Generate Event Schema (for bookings)
 */
export function generateEventSchema(event: {
  name: string;
  description: string;
  startDate: string;
  location: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    location: {
      '@type': 'Place',
      name: event.location,
      address: {
        '@type': 'PostalAddress',
        addressLocality: event.location,
        addressCountry: 'NZ',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
  };
}

/**
 * Merge schema arrays
 */
export function mergeSchemas(schemas: any[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': schemas,
  };
}
