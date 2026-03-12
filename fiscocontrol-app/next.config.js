/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Necessário para rodar em Docker (cria pasta .next/standalone)
    output: 'standalone',
};

module.exports = nextConfig;
