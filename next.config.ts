import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/the-academy/hijama",
        destination: "/the-academy/hijama-diploma",
        permanent: true,
      },
      {
        source: "/the-academy/student-handbook",
        destination: "/the-academy/course-handbook",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
