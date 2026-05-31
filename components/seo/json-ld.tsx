interface InstructorJsonLdProps {
  name: string
  suburb: string
  state: string
  postcode: string
  phone?: string | null
  email?: string | null
  bio?: string | null
  photo?: string | null
  hourlyRate?: number | null
  rating?: number | null
  reviewCount?: number
  slug: string
}

export function InstructorJsonLd({
  name, suburb, state, postcode, phone, email,
  bio, photo, hourlyRate, rating, reviewCount = 0, slug
}: InstructorJsonLdProps) {
  const suburbSlug = suburb.toLowerCase().replace(/\s+/g, '-')
  const url        = `https://lcardrive.com.au/instructors/${suburbSlug}/${slug}`

  const schema: any = {
    '@context':        'https://schema.org',
    '@type':           'LocalBusiness',
    '@id':             url,
    name:              `${name} — Driving Instructor`,
    description:       bio || `${name} is a professional driving instructor in ${suburb}, ${state}.`,
    url,
    telephone:         phone || undefined,
    email:             email || undefined,
    image:             photo || undefined,
    priceRange:        hourlyRate ? `$${hourlyRate}/hr` : undefined,
    address: {
      '@type':          'PostalAddress',
      addressLocality:  suburb,
      addressRegion:    state,
      postalCode:       postcode,
      addressCountry:   'AU',
    },
    geo: {
      '@type':    'GeoCoordinates',
      addressLocality: suburb,
    },
    areaServed: {
      '@type': 'City',
      name:    suburb,
    },
    serviceType:     'Driving Lessons',
    currenciesAccepted: 'AUD',
    paymentAccepted: 'Cash, Bank Transfer',
    openingHoursSpecification: {
      '@type':     'OpeningHoursSpecification',
      dayOfWeek:   ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
      opens:       '07:00',
      closes:      '20:00',
    },
  }

  // Add aggregate rating if reviews exist
  if (rating && reviewCount > 0) {
    schema.aggregateRating = {
      '@type':       'AggregateRating',
      ratingValue:   rating.toFixed(1),
      reviewCount:   reviewCount,
      bestRating:    '5',
      worstRating:   '1',
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Organisation schema for homepage
export function OrganisationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type':    'Organization',
    name:       'LCarDrive',
    url:        'https://lcardrive.com.au',
    logo:       'https://lcardrive.com.au/logo.png',
    description: 'Find local, verified driving instructors across Melbourne. Compare prices, read reviews, and contact instructors directly.',
    sameAs: [],
    contactPoint: {
      '@type':             'ContactPoint',
      contactType:         'customer support',
      email:               'support@lcardrive.com.au',
      availableLanguage:   'English',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Breadcrumb schema
export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    '@context':        'https://schema.org',
    '@type':           'BreadcrumbList',
    itemListElement:   items.map((item, i) => ({
      '@type':   'ListItem',
      position:  i + 1,
      name:      item.name,
      item:      item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
