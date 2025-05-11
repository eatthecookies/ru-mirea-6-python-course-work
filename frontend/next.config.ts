import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    env: {
        AUTH_SECRET: process.env.AUTH_SECRET, // Переменные окружения
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "storage.yandexcloud.net", // замени на нужный домен
            },
        ],
    },
};

export default nextConfig;
