/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force transpilation of problematic packages
  transpilePackages: ['lucide-react'],
  
  // Optimize bundling
  experimental: {
    optimizeCss: false,
  },

  // Completely skip TypeScript type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },

  // Skip ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },

  webpack: (config, { isServer }) => {
    // Completely ignore API directory
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        "**/node_modules/**",
        "**/packages/api/**",
        "**/api/**",
        "**/../api/**",
      ],
    };

    // Add resolve fallbacks
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };

    // Exclude API files from webpack processing
    config.module.rules.push({
      test: /\.ts$/,
      include: [/packages\/api/, /\.\.\/api/],
      use: "ignore-loader",
    });

    // Fix lucide-react bundling issues for both server and client
    config.resolve.alias = {
      ...config.resolve.alias,
      'lucide-react': 'lucide-react',
    };

    // Fix module resolution for external packages
    config.resolve.modules = [
      'node_modules',
      ...config.resolve.modules || []
    ];

    // Force bundling of lucide-react instead of externalizing
    if (isServer) {
      config.externals = config.externals || [];
      // Remove lucide-react from externals if it exists
      if (Array.isArray(config.externals)) {
        config.externals = config.externals.filter(ext => ext !== 'lucide-react');
      }
    }

    return config;
  },

  images: {
    unoptimized: true,
    remotePatterns: [
      { hostname: "localhost" },
      { hostname: "images.unsplash.com" },
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "drive.google.com" },
    ],
  },
};

export default nextConfig;
