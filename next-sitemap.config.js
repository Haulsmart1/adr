/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://adrcarriers.com',
    generateRobotsTxt: true,
    changefreq: 'weekly',
    priority: 0.7,
    outDir: './public', // ✅ THIS IS IMPORTANT
};
