import pathnames from '@/i18n/pathnames.js';
import type { Locale } from '@/i18n/routing';
import type { WorkItem } from '@/app/data/works/item';

/**
 * A work is reachable both bare (/works/27-1, linked from the /works grid)
 * and year-scoped (/works/2025/27-1, which is what the sitemap publishes).
 * Both forms point at the year-scoped URL so search engines consolidate on
 * one, instead of treating them as two pages with identical content.
 */
export function canonicalWorkPath(
  locale: Locale,
  workId: string,
  item: WorkItem
): string {
  const year = item.detail?.[0]?.year;
  const map = pathnames as Record<string, Record<string, string>>;

  const yearTemplate = year ? map[`/works/${year}/[workId]`] : undefined;
  const template = yearTemplate ?? map['/works/[workId]'];

  return `/${locale}${template[locale].replace('[workId]', workId)}`;
}
