import { routing } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import worksEn2025 from '@/app/data/works/json/en_2023.json';
import worksZh2025 from '@/app/data/works/json/zh_2023.json';
import type { WorkItem } from '@/app/data/works/item';
import { getTranslations } from 'next-intl/server';

type WorkDict = Record<string, WorkItem>;

const Works2023Map: Record<'en' | 'zh', WorkDict> = {
  en: worksEn2025,
  zh: worksZh2025,
};

export async function generateMetadata() {
  const t = await getTranslations('WorksPage.metadata');
  return {
    // keep the same metadata keys, optionally append "2025"
    title: `${t('title')} - 2025`,
    description: t('description'),
    keywords: t('keywords'),
  };
}

export default async function Works2025Page({
  params,
}: {
  params: Promise<{ locale: (typeof routing.locales)[number] }>;
}) {
  const { locale } = await params;
  const dict = Works2023Map[locale] as WorkDict;
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
                pathname: '/works/2023/[workId]',
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
