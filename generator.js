const workbox = require("workbox-build");

workbox.generateSW({
    cacheId: "example",
    globDirectory: "./",
    globPatterns: [
        "**/*.{css,js}"
    ],
    globIgnores: [
        "node_modules/**/*",
        "**/gulpfile.js",
        "**/sw.js"
    ],
    swDest: "./sw.js",
    runtimeCaching: [
        {
            urlPattern: /\.(?:html|htm|xml)$/,
            handler: "staleWhileRevalidate",
            options: {
                cacheName: "markup",
                expiration: {
                    maxAgeSeconds: 60 * 60 * 24 * 7,
                },
            },
        }
    ],
});