const routes = require("./src/data/public-routes.json");
/** Explicit list keeps private, callback and completion URLs out of the sitemap. */
module.exports = {
  siteUrl: "https://adrcarriers.com",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  outDir: "./public",
  exclude: ["/**"],
  additionalPaths: async () => routes.map((route) => ({ loc: route })),
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/auth"],
      },
    ],
  },
};
