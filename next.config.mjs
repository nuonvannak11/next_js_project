/** @type {import('next').NextConfig} */
import i18nConfig from './src/next-i18next.config.js';

const nextConfig = {
  i18n: i18nConfig.i18n,
  images: {
    domains: ['i.postimg.cc'],
  },
};

export default nextConfig;
