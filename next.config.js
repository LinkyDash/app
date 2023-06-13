/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    remotePatterns: [
      {
        hostname: 's.gravatar.com',
      },
      {
        hostname: '*.fbcdn.net'
      },
    ],
  }
}

module.exports = nextConfig