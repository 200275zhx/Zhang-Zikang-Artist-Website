import { routing } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { ExhibitionsMap } from '@/app/data/exhibitions/map';
import type { ExhibitionItem } from '@/app/data/exhibitions/item';
import { getTranslations } from 'next-intl/server';

type NewsDict = Record<string, ExhibitionItem>;

export async function generateMetadata() {
    const t = await getTranslations('ExhibitionsPage.metadata');
    return {
      title: t('title'),
      description: t('description'),
      keywords: t('keywords'),
    };
}

export default async function ExhibitionsPage({
  params,
}: {
  params: Promise<{ locale: (typeof routing.locales)[number] }>;
}) {
  const { locale } = await params;
  const dict = ExhibitionsMap[locale] as NewsDict;
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
                pathname: '/exhibitions/[exhibitionId]',
                params: { exhibitionId: slug },
              }}
              className="block"
            >
              <div
                className="relative flex items-center justify-center bg-cover bg-center overflow-hidden aspect-square w-full max-w-md"
                style={{
                  backgroundColor: item.bgcolor,
                  backgroundImage: `url(/assets/exhibitions/image/paper-texture-6.webp)`,
                  backgroundBlendMode: 'multiply',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {/* light gradient overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-bl from-white/20 to-black/20" />

                {/* inner container at 80% size, centered by flex */}
                <div className="relative w-4/5 aspect-square">
                  {/* image + shadow: smaller spread, higher opacity */}
                  <div
                    className="relative w-full h-full"
                    style={{
                      filter: 'drop-shadow(-6px 6px 6px rgba(0,0,0,0.7))',
                    }}
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-contain object-center"
                    />
                  </div>
                </div>
              </div>
              
              <p>{item.title}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
