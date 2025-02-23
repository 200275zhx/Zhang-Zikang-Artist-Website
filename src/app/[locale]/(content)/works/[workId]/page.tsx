import { routing } from '@/i18n/routing';
import Image from 'next/image';
import { worksMap } from '@/app/data/works/map';
import type { WorkItem, WorkDetailBlock } from '@/app/data/works/item';

type WorkDict = Record<string, WorkItem>;

/**
 * For SSG: Build a static page for each (locale, workId) combo.
 */
export function generateStaticParams() {
  return routing.locales.flatMap((locale) => {
    const dict = worksMap[locale] as WorkDict;
    return Object.keys(dict).map((slug) => ({ locale, workId: slug }));
  });
}

/**
 * Generate metadata from item.metadata, but also treat `params` as a promise.
 */
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: (typeof routing.locales)[number]; workId: string }>;
}) {
  // 1) Await the params before destructuring
  const { locale, workId } = await params;

  const dict = worksMap[locale] as WorkDict;
  const item = dict[workId];
  if (!item) {
    // If not found, return some default or empty object
    return {};
  }

  // Return the SEO fields from item.metadata
  return {
    title: item.metadata.title,
    description: item.metadata.description,
    keywords: item.metadata.keywords
  };
}

/**
 * Main page component. Also treat `params` as a promise and await it.
 */
export default async function WorkDetailPage({
  params
}: {
  params: Promise<{ locale: (typeof routing.locales)[number]; workId: string }>;
}) {
  // 2) Await the params object
  const { locale, workId } = await params;

  const dict = worksMap[locale] as WorkDict;
  const item = dict[workId];
  if (!item) {
    return <div>Not found</div>;
  }

  // 3) Render each block in item.detail
  return (
    <div className="space-y-10">
      {item.detail.map((block: WorkDetailBlock, index) => (
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
