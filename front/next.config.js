/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.css': {
          loaders: ['postcss-load-config'],
          as: 'style'
        }
      }
    }
  }
}

module.exports = nextConfig