/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        port: "",
        pathname: "/WarlockJa/qt-blogposts/Main/images/**",
      },
    ],
  },
};

module.exports = nextConfig;
