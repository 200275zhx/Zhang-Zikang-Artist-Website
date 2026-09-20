/** @type {import('next-sitemap').IConfig} */
const fs = require('fs');
const path = require('path');

// Localized URL segments, shared with src/i18n/routing.ts. Reading the same
// map both places is what keeps <loc> values pointing at the URLs the app
// actually serves instead of their English equivalents.
const pathnames = require('./src/i18n/pathnames.js');

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.zhang-zikang.com';
const locales = ['en', 'zh']; // this have to be manually update in sync with the i18n locales
// Force a clean origin to avoid path-carryover like /en/works/en/works
const siteOrigin = (() => {
  try { return new URL(siteUrl).origin; } catch { return 'https://www.zhang-zikang.com'; }
})();
const defaultLocale = 'en'; // pick your default

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf-8'));
}

/**
 * Translate an English base path into `locale`'s URL, e.g.
 *   /works/2025/27-1  ->  /zuo-pin/2025/27-1   (zh)
 * Handles both static entries and dynamic templates such as
 * "/works/2025/[workId]". Returns null when no route matches, so the
 * caller can drop the URL rather than publish one that 404s or redirects.
 */
function localizePath(basePath, locale) {
  const exact = pathnames[basePath];
  if (exact) return exact[locale];

  const baseSegs = basePath.split('/').filter(Boolean);
  for (const [template, variants] of Object.entries(pathnames)) {
    if (!template.includes('[')) continue;
    const tplSegs = template.split('/').filter(Boolean);
    if (tplSegs.length !== baseSegs.length) continue;

    const params = [];
    let matched = true;
    for (let i = 0; i < tplSegs.length; i++) {
      if (tplSegs[i].startsWith('[')) params.push(baseSegs[i]);
      else if (tplSegs[i] !== baseSegs[i]) { matched = false; break; }
    }
    if (!matched) continue;

    let p = 0;
    const localized = variants[locale]
      .split('/')
      .filter(Boolean)
      .map((seg) => (seg.startsWith('[') ? params[p++] : seg))
      .join('/');
    return '/' + localized;
  }
  return null;
}

const withLocale = (locale, basePath) => {
  const localized = localizePath(basePath, locale);
  if (localized === null) return null;
  return localized === '/' ? `/${locale}` : `/${locale}${localized}`;
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
];

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  sitemapSize: 7000,

  // Rely entirely on additionalPaths; don't auto-emit anything to avoid duplicates.
  transform: async () => null,

  // Add your full set (static + dynamic) explicitly so nothing is missed
  additionalPaths: async () => {
    const now = new Date().toISOString();
    const allBasePaths = Array.from(new Set([...staticPaths, ...buildDynamicPaths()]));

    // Drop anything that has no route in routing.ts rather than publishing a
    // URL that would redirect or 404.
    const routable = allBasePaths.filter((p) => {
      const ok = locales.every((l) => localizePath(p, l) !== null);
      if (!ok) console.warn(`[next-sitemap] skipping unroutable path: ${p}`);
      return ok;
    });

    // For each base path, output one <url> per locale (en & zh)
    return locales.flatMap((locCode) =>
      routable.map((p) => ({
        loc: withLocale(locCode, p),
        lastmod: now,
        changefreq: 'weekly',
        priority: p === '/' ? 1 : 0.7,
        alternateRefs: locales.map((l) => ({
          hreflang: l,
          href: `${siteOrigin}${withLocale(l, p)}`,
          hrefIsAbsolute: true,
        })).concat([{
          hreflang: 'x-default',
          href: `${siteOrigin}${withLocale(defaultLocale, p)}`,
          hrefIsAbsolute: true,
        }]),
      }))
    );
  },

  // Robots: default is fine; no Host line needed
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
    // additionalSitemaps: [`${siteUrl}/sitemap.xml`], // optional
  },
};
