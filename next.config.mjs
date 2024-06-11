/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "www.rw-designer.com",
        port: "",
        pathname: "/cursor-view/**",
      },
    ],
  },
};

export default nextConfig;
