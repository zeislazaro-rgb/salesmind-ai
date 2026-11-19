/** @type {import('next').NextConfig} */

// Endereço da API visto pelo SERVIDOR do Next (não pelo navegador).
// O navegador sempre chama /api/..., e o Next repassa para cá.
// Assim funciona no celular, no Codespaces e em qualquer rede.
const API_INTERNAL_URL = process.env.API_INTERNAL_URL || 'http://localhost:3001';

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${API_INTERNAL_URL}/:path*` }];
  },
  // PWA config para funcionar como app de celular
  async headers() {
    return [
      {
        source: '/manifest.json',
        headers: [{ key: 'Content-Type', value: 'application/manifest+json' }]
      }
    ];
  }
};

module.exports = nextConfig;
