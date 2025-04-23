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

  return (
    <div className="space-y-16 px-4 md:px-8 lg:px-16">
      {slugs.map((slug) => {
        const item = dict[slug];
        return (
          <div key={slug} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left column: publication info */}
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">{item.title}</h2>
              {item.ISBN && (
                <p>
                  <span className="font-medium">ISBN:</span> {item.ISBN}
                </p>
              )}
              {item.publisher && (
                <p>
                  <span className="font-medium">Publisher:</span> {item.publisher}
                </p>
              )}
              {item.date && (
                <p>
                  <span className="font-medium">Date:</span> {item.date}
                </p>
              )}
              {item.category && (
                <p>
                  <span className="font-medium">Category:</span> {item.category}
                </p>
              )}
            </div>

            {/* Right column: cover image */}
            <div className="relative w-full h-64 md:h-80 lg:h-96">
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
