import Image from 'next/image';
import { PublicationsMap } from '@/app/data/publications/map';
import type { PublicationItem } from '@/app/data/publications/item';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('PublicationsPage.metadata');
  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

type PublicationsDict = Record<string, PublicationItem>;

export default async function PublicationsPage({ params }: { params: Promise<{ locale: (typeof import('@/i18n/routing').routing.locales)[number] }> }) {
  const { locale } = await params;
  const dict = PublicationsMap[locale] as PublicationsDict;
  const slugs = Object.keys(dict);
  const t = await getTranslations('PublicationsPage.labels');

  return (
    <div className="space-y-16 px-4 md:px-8 lg:px-16">
      {slugs.map((slug) => {
        const item = dict[slug];
        return (
          <div key={slug} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left column: publication info */}
            <div className="space-y-2">
              <h2 className="text-2xl mb-10">{item.title}</h2>
              
              {item.category && (
                <div className="grid grid-cols-[140px_1fr] md:grid-cols-[200px_1fr] gap-x-4 items-start text-sm">
                <div className="font-medium leading-loose">{t('category')}</div>
                <div className="leading-loose">{item.category}</div>
              </div>
              )}
              {item.ISBN && (
                <div className="grid grid-cols-[140px_1fr] md:grid-cols-[200px_1fr] gap-x-4 items-start text-sm">
                  <div className="font-medium leading-loose">ISBN</div>
                  <div className="leading-loose">{item.ISBN}</div>
                </div>
              )}
              {item.publisher && (
                <div className="grid grid-cols-[140px_1fr] md:grid-cols-[200px_1fr] gap-x-4 items-start text-sm">
                  <div className="font-medium leading-loose">{t('publisher')}</div>
                  <div className="leading-loose">{item.publisher}</div>
                </div>
              )}
              {item.date && (
                <div className="grid grid-cols-[140px_1fr] md:grid-cols-[200px_1fr] gap-x-4 items-start text-sm">
                  <div className="font-medium leading-loose">{t('date')}</div>
                  <div className="leading-loose">{item.date}</div>
                </div>
              )}
            </div>

            {/* Right column: cover image */}
            <div className="relative w-full h-80">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-contain rounded-lg"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
