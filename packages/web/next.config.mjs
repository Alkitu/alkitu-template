/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force transpilation of problematic packages
  transpilePackages: ['lucide-react'],
  
  // Optimize bundling and worker processes
  experimental: {
    optimizeCss: false,
    workerThreads: false,
    cpus: 1,
  },
  
  // HMR and development server configuration
  devIndicators: {
    position: 'bottom-left',
  },
  
  // Force production-like behavior for HMR
  generateEtags: false,
  poweredByHeader: false,

  // Completely skip TypeScript type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },

  // Empty Turbopack config for Next.js 16 compatibility
  turbopack: {},

  webpack: (config, { dev, isServer }) => {
    // Enhanced HMR configuration for development
    if (dev && !isServer) {
      config.devtool = false;
    }
    
    // Optimize watch options to reduce memory usage
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        "**/node_modules/**",
        "**/packages/api/**",
        "**/api/**",
        "**/../api/**",
        "**/.stryker-tmp/**",
        "**/stryker-tmp/**",
        "**/coverage/**",
      ],
      poll: false,
      aggregateTimeout: 300,
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
