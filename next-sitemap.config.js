/** @type {import('next-sitemap').IConfig} */
const fs = require('fs');
const path = require('path');

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.zhang-zikang.com';
const locales = ['en', 'zh']; // this have to be manually update in sync with the i18n locales
const defaultLocale = 'en'; // pick your default

const pathSeg = {
  works: { en: 'works', zh: 'works' },
  exhibitions: { en: 'exhibitions', zh: 'exhibitions' },
};

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf-8'));
}

// normalize helpers
const LOCALE_RE = /^\/(en|zh)(?=\/|$)/;
const baseOf = (p) => p.replace(LOCALE_RE, '') || '/';
const withLocale = (l, p) => {
  const base = baseOf(p);
  return base === '/' ? `/${l}` : `/${l}${base}`;
};

/** Build dynamic URLs from your JSON dictionaries (base paths, no locale prefix) */
function buildDynamicPaths() {
  const out = [];

  // Works detail pages: /works/:year/:workId
  for (const locale of locales) {
    const file = path.join(process.cwd(), 'src/app/data/works/json', `${locale}.json`);
    if (!fs.existsSync(file)) continue;
    const dict = readJson(file);
    for (const workId of Object.keys(dict)) {
      const item = dict[workId];
      const year = Array.isArray(item?.detail) && item.detail[0]?.year ? String(item.detail[0].year) : null;
      if (!year) continue;
      out.push(`/works/${year}/${workId}`);
    }
  }

  // Exhibitions detail pages: /exhibitions/:exhibitionId
  for (const locale of locales) {
    const file = path.join(process.cwd(), 'src/app/data/exhibitions/json', `${locale}.json`);
    if (!fs.existsSync(file)) continue;
    const dict = readJson(file);
    for (const exhibitionId of Object.keys(dict)) {
      out.push(`/exhibitions/${exhibitionId}`);
    }
  }

  return Array.from(new Set(out));
}

/** Hand-list static base paths (no locale prefix) */
const staticPaths = [
  '/',
  '/biography',
  '/works',
  '/works/2014','/works/2015','/works/2016','/works/2017','/works/2019','/works/2022','/works/2023','/works/2024','/works/2025',
  '/exhibitions',
  '/news','/news/curations','/news/exhibitions','/news/interviews',
  '/publications','/publications/articles','/publications/editions','/publications/interviews','/publications/monographs',
  '/contact',
];

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  sitemapSize: 7000,

  // Ensure EVERY entry has hreflang, and loc points to the default-locale URL
  transform: async (_config, path) => {
    const loc = withLocale(defaultLocale, path);
    const alternateRefs = locales.map((l) => ({
      hreflang: l,
      href: `${siteUrl}${withLocale(l, path)}`,
    }));
    return {
      loc,
      changefreq: 'weekly',
      priority: baseOf(path) === '/' ? 1 : 0.7,
      lastmod: new Date().toISOString(),
      alternateRefs, // no x-default
    };
  },

  // Add your full set (static + dynamic) explicitly so nothing is missed
  additionalPaths: async () => {
    const now = new Date().toISOString();
    const allBasePaths = Array.from(new Set([...staticPaths, ...buildDynamicPaths()]));

    return allBasePaths.map((p) => ({
      loc: withLocale(defaultLocale, p),
      lastmod: now,
      changefreq: 'weekly',
      priority: baseOf(p) === '/' ? 1 : 0.7,
      alternateRefs: locales.map((l) => ({
        hreflang: l,
        href: `${siteUrl}${withLocale(l, p)}`,
      })),
    }));
  },

  // Robots: default is fine; no Host line needed
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
    // additionalSitemaps: [`${siteUrl}/sitemap.xml`], // optional
  },
};
