const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: false,
  openAnalyzer: false,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath:
    '' === process.env.NEXT_PUBLIC_PATH
      ? undefined
      : '/' + process.env.NEXT_PUBLIC_PATH,
  reactStrictMode: false, // se desactiva porque React 18 renderiza y llama useEffect 2 veces 🤷‍♂️
  poweredByHeader: false,
  webpack: (config, context) => {
    if (!context.isServer) {
      config.resolve.fallback.child_process = false
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }

    return config
  },
  output: 'standalone',
  eslint: {
    dirs: ['src', 'stories', 'test'],
  },
  images: {
    remotePatterns: [],
  },
}

module.exports = withBundleAnalyzer(nextConfig)
