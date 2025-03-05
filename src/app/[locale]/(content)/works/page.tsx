import { routing } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { WorksMap } from '@/app/data/works/map';
import type { WorkItem } from '@/app/data/works/item';
import { getTranslations } from 'next-intl/server';

type WorkDict = Record<string, WorkItem>;

export async function generateMetadata() {
    const t = await getTranslations('WorksPage.metadata');
    return {
      title: t('title'),
      description: t('description'),
      keywords: t('keywords'),
    };
}

export default async function WorksPage({
  params,
}: {
  params: Promise<{ locale: (typeof routing.locales)[number] }>;
}) {
  const { locale } = await params;
  const dict = WorksMap[locale] as WorkDict;
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
                pathname: '/works/[workId]',
                params: { workId: slug },
              }}
              className="block"
            >
              <div className="relative aspect-square">
                <Image src={item.src} alt={item.alt} fill className="object-cover" />
              </div>
              <p>{item.title}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
