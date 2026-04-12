/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    proxyMiddleware: {
      routes: {
        '/api/govease/:path*': {
          target: 'http://localhost:3000',
          pathFilter: (path, pathname) => pathname.startsWith('/api/govease') && !pathname.includes('/services'),
          headers: async (headers, pathname) => {
            // Auth logic moved to API routes
            return headers;
          },
        },
      },
    },
  },
  ignoreBuildErrors: false,
  transpilePackages: ['@xenova/transformers'],
};

export default nextConfig;
