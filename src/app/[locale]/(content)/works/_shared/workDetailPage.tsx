import { notFound } from 'next/navigation';
import Image from 'next/image';
import { routing } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import type { WorkItem, WorkDetailBlock } from '@/app/data/works/item';
import { canonicalWorkPath } from './canonical';

export type WorkDict = Record<string, WorkItem>;
type Params = Promise<{ locale: Locale; workId: string }>;

/**
 * Shared implementation behind /works/[workId] and every /works/<year>/[workId]
 * route. Each route passes only the works it is allowed to serve, so a work no
 * longer renders under all nine years.
 */
export function createWorkDetailPage(dicts: Record<Locale, WorkDict>) {
  function generateStaticParams() {
    return routing.locales.flatMap((locale) =>
      Object.keys(dicts[locale]).map((workId) => ({ locale, workId }))
    );
  }

  async function generateMetadata({ params }: { params: Params }) {
    const { locale, workId } = await params;
    const item = dicts[locale]?.[workId];
    if (!item) return {};

    return {
      title: item.metadata.title,
      description: item.metadata.description,
      keywords: item.metadata.keywords,
      alternates: {
        canonical: canonicalWorkPath(locale, workId, item),
      },
    };
  }

  async function Page({ params }: { params: Params }) {
    const { locale, workId } = await params;
    const item = dicts[locale]?.[workId];
    // A work requested under the wrong year should 404 outright rather than
    // return 200 with a "Not found" body, which reads as a soft 404.
    if (!item) notFound();

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

            {/* Right Column: title & info & description */}
            <div className="text-xl">
              {block.title && <h2 className="mb-10">{block.title}</h2>}

              {block.size && (
                <div className="text-sm leading-loose">{block.size}</div>
              )}
              {block.media && (
                <div className="text-sm leading-loose">{block.media}</div>
              )}
              {block.year && (
                <div className="text-sm leading-loose">{block.year}</div>
              )}

              {block.description && (
                <div className="text-sm leading-loose">{block.description}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return { generateStaticParams, generateMetadata, Page };
}
