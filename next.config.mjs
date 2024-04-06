/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
      return [
        {
          source: '/',
          destination: '/home',
          permanent: true, // Sử dụng permanent để thiết lập redirect 301 (permanent)
        },
      ]
    },
  };

export default nextConfig;
