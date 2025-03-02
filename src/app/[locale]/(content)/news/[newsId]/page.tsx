import { routing } from '@/i18n/routing';
import Image from 'next/image';
import { newsMap } from '@/app/data/news/map';
import type { NewsItem, NewsDetailBlock } from '@/app/data/news/item';

type WorkDict = Record<string, NewsItem>;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => {
    const dict = newsMap[locale] as WorkDict;
    return Object.keys(dict).map((slug) => ({ locale, newsId: slug }));
  });
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: (typeof routing.locales)[number]; newsId: string }>;
}) {
  const { locale, newsId } = await params;

  const dict = newsMap[locale] as WorkDict;
  const item = dict[newsId];
  if (!item) {
    return {};
  }

  return {
    title: item.metadata.title,
    description: item.metadata.description,
    keywords: item.metadata.keywords
  };
}

export default async function WorkDetailPage({
  params
}: {
  params: Promise<{ locale: (typeof routing.locales)[number]; newsId: string }>;
}) {
  const { locale, newsId } = await params;

  const dict = newsMap[locale] as WorkDict;
  const item = dict[newsId];
  if (!item) {
    return <div>Not found</div>;
  }

  return (
    <div className="space-y-10">
      {item.detail.map((block: NewsDetailBlock, index) => (
        <div key={index} className="grid lg:grid-cols-[2fr_1fr] gap-20">
          {/* Left Column: image or video */}
          <div>
            {block.img && (
              <Image
                src={block.img}
                alt={block.alt || ''}
                className="w-full mb-4"
                width={1200}
                height={800}
              />
            )}
            {block.vid && (
              <div
                className="relative w-full mb-4"
                style={{ paddingBottom: '56.25%' }}
              >
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={block.vid.replace('youtu.be/', 'www.youtube.com/embed/')}
                  title={block.alt || 'Video'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>

          {/* Right Column: title & description */}
          <div className="text-xl">
            {block.title && <h2 className="mb-10">{block.title}</h2>}
            {block.description && (
              <div className="text-sm leading-loose">{block.description}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
