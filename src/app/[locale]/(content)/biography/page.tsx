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
      {/* brief intro & selfie grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-[2fr_1fr] gap-16 items-stretch">
        {/* brief intro */}
        <div>
          <h1 className="text-2xl mb-12">{t('name')}</h1>
          {t.rich('brief', { div: (chunks) => <div>{chunks}</div> })}
        </div>
        {/* selfie image */}
        <div className="relative">
          <Image
            src="/assets/biopage/zhangzikangbio.webp"
            alt={t('name')}
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* detail content */}
      <div>

        {/* education */}
        <div className='pt-4 text-2xl my-12'>{t('education-title')}</div>
        {t.rich('education-content.[Year]', { div: (chunks) => <div>{chunks}</div> })}

        {/* career */}
        <div className='pt-4 text-2xl my-12'>{t('career-title')}</div>
        <div className='grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-[1fr_12fr] gap-4'>
          <div>[年份]</div>
          <div>
            <div>{t.rich('career-content.[Year1]', { div: (chunks) => <div>{chunks}</div> })}</div>
            <div>{t.rich('career-content.[Year2]', { div: (chunks) => <div>{chunks}</div> })}</div>
            <div>{t.rich('career-content.[Year3]', { div: (chunks) => <div>{chunks}</div> })}</div>
          </div>
          <div>[年份]</div>
          <div>
            <div>{t.rich('career-content.[Year4]', { div: (chunks) => <div>{chunks}</div> })}</div>
            <div>{t.rich('career-content.[Year5]', { div: (chunks) => <div>{chunks}</div> })}</div>
            <div>{t.rich('career-content.[Year6]', { div: (chunks) => <div>{chunks}</div> })}</div>
            <div>{t.rich('career-content.[Year7]', { div: (chunks) => <div>{chunks}</div> })}</div>
            <div>{t.rich('career-content.[Year8]', { div: (chunks) => <div>{chunks}</div> })}</div>
            <div>{t.rich('career-content.[Year9]', { div: (chunks) => <div>{chunks}</div> })}</div>
            <div>{t.rich('career-content.[Year0]', { div: (chunks) => <div>{chunks}</div> })}</div>
          </div>
        </div>

        {/* solo exhibitions */}
        <div className='pt-4 text-2xl my-12'>{t('solo-exhibitions-title')}</div>
        <div className='grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-[1fr_12fr] gap-4'>
          <div>2024</div>
          <div>{t.rich('solo-exhibitions-content.2024', { div: (chunks) => <div>{chunks}</div> })}</div>
          <div>2022</div>
          <div>{t.rich('solo-exhibitions-content.2022', { div: (chunks) => <div>{chunks}</div> })}</div>
        </div>

        {/* group exhibitions */}
        <div className='pt-4 text-2xl my-12'>{t('group-exhibitions-title')}</div>
        <div className='grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-[1fr_12fr] gap-4'>
          <div>2025</div>
          <div>{t.rich('group-exhibitions-content.2025', { div: (chunks) => <div>{chunks}</div> })}</div>
          <div>2024</div>
          <div>{t.rich('group-exhibitions-content.2024', { div: (chunks) => <div>{chunks}</div> })}</div>
          <div>2023</div>
          <div>{t.rich('group-exhibitions-content.2023', { div: (chunks) => <div>{chunks}</div> })}</div>
          <div>2022</div>
          <div>{t.rich('group-exhibitions-content.2022', { div: (chunks) => <div>{chunks}</div> })}</div>
          <div>2020</div>
          <div>{t.rich('group-exhibitions-content.2020', { div: (chunks) => <div>{chunks}</div> })}</div>
          <div>2017</div>
          <div>{t.rich('group-exhibitions-content.2017', { div: (chunks) => <div>{chunks}</div> })}</div>
        </div>

        {/* public collections */}
        <div className='pt-4 text-2xl my-12'>{t('public-collections-title')}</div>
        <div className='grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-[1fr_12fr] gap-4'>
          <div>[年份]</div>
          <div>{t.rich('public-collections-content.[Year1]', { div: (chunks) => <div>{chunks}</div> })}</div>
          <div>[年份]</div>
          <div>{t.rich('public-collections-content.[Year2]', { div: (chunks) => <div>{chunks}</div> })}</div>
          <div>[年份]</div>
          <div>{t.rich('public-collections-content.[Year3]', { div: (chunks) => <div>{chunks}</div> })}</div>
        </div>

        {/* curations */}
        <div className='pt-4 text-2xl my-12'>{t('curations-title')}</div>
        <div className='grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-[1fr_12fr] gap-4'>
          <div>2024</div>
          <div>{t.rich('curations-content.2024', { div: (chunks) => <div>{chunks}</div> })}</div>
          <div>2023</div>
          <div>{t.rich('curations-content.2023', { div: (chunks) => <div>{chunks}</div> })}</div>
          <div>2022</div>
          <div>{t.rich('curations-content.2022', { div: (chunks) => <div>{chunks}</div> })}</div>
          <div>2021</div>
          <div>{t.rich('curations-content.2021', { div: (chunks) => <div>{chunks}</div> })}</div>
          <div>2020</div>
          <div>{t.rich('curations-content.2020', { div: (chunks) => <div>{chunks}</div> })}</div>
          <div>2019</div>
          <div>{t.rich('curations-content.2019', { div: (chunks) => <div>{chunks}</div> })}</div>
          <div>2018</div>
          <div>{t.rich('curations-content.2018', { div: (chunks) => <div>{chunks}</div> })}</div>
        </div>

        {/* awards */}
        <div className='pt-4 text-2xl my-12'>{t('awards-title')}</div>
        <div className='grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-[1fr_12fr] gap-4'>
          <div>[年份]</div>
          <div>{t.rich('awards-content.[Year]', { div: (chunks) => <div>{chunks}</div> })}</div>
        </div>


        {/* <div className='pt-4'>{t('summary-1')}</div>
        <div className='pt-4'>{t('summary-2')}</div>
        <div className='pt-4'>{t('summary-3')}</div> */}
      </div>
    </div>
  );
}

// {t.rich('summary-1', {
//   div: (chunks) => <div>{chunks}</div>
// })}