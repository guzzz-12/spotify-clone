/** @type {import("next").NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rbqinxbprdpgittiiwbt.supabase.co"
      }
    ]
  }
}

module.exports = nextConfig
