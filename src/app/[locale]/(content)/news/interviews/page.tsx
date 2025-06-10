import { routing } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { NewsInterviewsMap } from '@/app/data/news/map';
import type { NewsItem } from '@/app/data/news/item';
import { getTranslations } from 'next-intl/server';

type NewsDict = Record<string, NewsItem>;

export async function generateMetadata() {
  const t = await getTranslations('NewsPage.metadata');
  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: (typeof routing.locales)[number] }>;
}) {
  const { locale } = await params;
  const dict = NewsInterviewsMap[locale] as NewsDict;
  const slugs = Object.keys(dict);
  const t = await getTranslations('NewsPage');

  return (
    <div className="space-y-16 px-4 md:px-8 lg:px-16">
      {slugs.map((slug) => {
        const item = dict[slug];
        return (
          <article key={slug} className="w-full py-8">
            <h2 className="mt-4 text-2xl font-medium mb-10">{item.title}</h2>
            <div
              className="overflow-hidden w-full h-auto md:h-[560px] mb-10"
              style={{ clipPath: 'inset(0 10% 0 10%)' }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={800}
                height={800}
                className="object-cover object-top w-full h-auto md:h-full"
              />
            </div>
            {(item.time || item.location) && (
              <div className="mt-2 text-sm">
                {item.time && <p className="pl-2">{t('time')}: {item.time}</p>}
                {item.location && <p className="pl-2">{t('location')}: {item.location}</p>}
              </div>
            )}
            <p className="mt-6 text-sm leading-relaxed">{item.description}</p>
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-blue-600 underline"
              >
                {t('more')}
              </a>
            )}
          </article>
        );
      })}
    </div>
  );
}
