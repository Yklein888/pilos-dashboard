/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output creates a self-contained Node.js server in
  // .next/standalone/server.js that Tauri starts automatically on launch.
  // During `tauri dev`, the Next.js dev server runs at localhost:3000.
  output: 'standalone',
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  eslint: {
    dirs: ['app', 'components', 'lib', 'hooks'],
  },
}

module.exports = nextConfig
