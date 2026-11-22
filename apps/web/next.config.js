/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@salesmind/shared'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/:path*`
      }
    ];
  },
  // PWA config para funcionar como app de celular
  headers: async () => [
    {
      source: '/manifest.json',
      headers: [{ key: 'Content-Type', value: 'application/manifest+json' }]
    }
  ]
};

module.exports = nextConfig;