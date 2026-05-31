import type { NextConfig } from 'next'
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co'              },
      { protocol: 'https', hostname: '*.supabase.in'              },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com'  },
      { protocol: 'https', hostname: 'img.clerk.com'              },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',       value: 'DENY'                          },
          { key: 'X-Content-Type-Options', value: 'nosniff'                       },
          { key: 'Referrer-Policy',        value: 'origin-when-cross-origin'      },
          { key: 'X-DNS-Prefetch-Control', value: 'on'                            },
          { key: 'Permissions-Policy',     value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
  compress: true,
}

export default withBundleAnalyzer(nextConfig)
