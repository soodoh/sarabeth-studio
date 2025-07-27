import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  images: {
    loader: "custom",
    loaderFile: "./utils/server/image-loader.ts",
  },
  output: "standalone",
};

export default config;
