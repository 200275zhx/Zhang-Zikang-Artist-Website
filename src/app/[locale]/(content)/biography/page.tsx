import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

export async function generateMetadata() {
  const t = await getTranslations('BiographyPage.metadata');
  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

export default async function BiographyPage() {
    const t = await getTranslations('BiographyPage');
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-16 items-stretch">
        <div>
          <h1 className="text-2xl mb-12">{t('name')}</h1>
          <div>{t('summary-1')}</div>
          <div className='pt-4'>{t('summary-2')}</div>
          <div className='pt-4'>{t('summary-3')}</div>
        </div>
        <div className="relative">
          <Image
            src="/assets/biopage/zhangzikangbio.webp"
            alt={t('name')}
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}