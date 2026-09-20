import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link, routing } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import type { WorkDict } from './workDetailPage';

/** e.g. "/works/2025/[workId]" — the detail route a year page links into. */
export type WorkDetailPathname = Extract<
  keyof typeof routing.pathnames,
  `/works/${string}[workId]`
>;

type Params = Promise<{ locale: Locale }>;

/**
 * Shared implementation behind every /works/<year> listing page. The per-year
 * files are thin wrappers so grid markup and metadata live in one place.
 */
export function createYearListPage(options: {
  year: string;
  detailPathname: WorkDetailPathname;
  dicts: Record<Locale, WorkDict>;
}) {
  const { year, detailPathname, dicts } = options;

  async function generateMetadata() {
    const t = await getTranslations('WorksPage.metadata');
    return {
      title: `${t('title')} - ${year}`,
      description: t('description'),
      keywords: t('keywords'),
    };
  }

  async function Page({ params }: { params: Params }) {
    const { locale } = await params;
    const dict = dicts[locale];
    const slugs = Object.keys(dict);

    return (
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
          {slugs.map((slug) => {
            const item = dict[slug];
            return (
              <Link
                key={slug}
                href={{
                  pathname: detailPathname,
                  params: { workId: slug },
                }}
                className="block"
              >
                <div className="relative aspect-square">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover"
                  />
                </div>
                <p>{item.title}</p>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  return { generateMetadata, Page };
}
