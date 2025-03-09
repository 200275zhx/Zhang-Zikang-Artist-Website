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
            src="/assets/biopage/zhangzikang-bio.webp"
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
        <div className='grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-[1fr_10fr]'>
          <div>1985-1989</div>
          {t('education-content.1985-1989')}
          <div>1990-1996</div>
          {t('education-content.1990-1996')}
          <div>2011-2014</div>
          {t('education-content.2011-2014')}
          
        </div>

        {/* career */}
        <div className='pt-4 text-2xl my-12'>{t('career-title')}</div>
        <div className='grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-[1fr_10fr]'>
          <div>2024</div>
          {t('career-content.2024')}
          <div>2017-2024</div>
          {t('career-content.2017-2024')}
          <div>2014-2017</div>
          {t('career-content.2014-2017')}
          <div>2009-2014</div>
          {t('career-content.2009-2014')}
          <div>2009-2009</div>
          {t('career-content.2009-2009')}
          <div>2006-2009</div>
          {t.rich('career-content.2006-2009', { div: (chunks) => <div>{chunks}</div> })}
          <div>2004-2011</div>
          {t('career-content.2004-2011')}
          <div>1999-2006</div>
          {t('career-content.1999-2006')}
          <div>1992-1999</div>
          {t.rich('career-content.1992-1999', { div: (chunks) => <div>{chunks}</div> })}
          <div>1989-1992</div>
          {t('career-content.1989-1992')}
          <br/><br/> 
          <div>[年份缺失]</div>
          <div>
            <div>{t.rich('career-content.[Year1]', { div: (chunks) => <div>{chunks}</div> })}</div>
            <div>{t.rich('career-content.[Year2]', { div: (chunks) => <div>{chunks}</div> })}</div>
            <div>{t.rich('career-content.[Year3]', { div: (chunks) => <div>{chunks}</div> })}</div>
          </div>
          <div>[年份缺失]</div>
          <div>
            <div>{t.rich('career-content.[Year5]', { div: (chunks) => <div>{chunks}</div> })}</div>
            <div>{t.rich('career-content.[Year6]', { div: (chunks) => <div>{chunks}</div> })}</div>
            <div>{t.rich('career-content.[Year8]', { div: (chunks) => <div>{chunks}</div> })}</div>
          </div>
        </div>

        {/* solo exhibitions */}
        <div className='pt-4 text-2xl my-12'>{t('solo-exhibitions-title')}</div>
        <div className='grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-[1fr_10fr]'>
          <div>2024</div>
          <div>{t.rich('solo-exhibitions-content.2024', { div: (chunks) => <div>{chunks}</div> })}</div>
          <div>2022</div>
          <div>{t.rich('solo-exhibitions-content.2022', { div: (chunks) => <div>{chunks}</div> })}</div>
        </div>

        {/* group exhibitions */}
        <div className='pt-4 text-2xl my-12'>{t('group-exhibitions-title')}</div>
        <div className='grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-[1fr_10fr]'>
          <div>2025</div>
          <div>{t.rich('group-exhibitions-content.2025', { div: (chunks) => <div>{chunks}</div> })}</div>
          <div>2024</div>
          <div>{t.rich('group-exhibitions-content.2024', { div: (chunks) => <div>{chunks}</div> })}</div>
          <div>2023</div>
          <div>{t.rich('group-exhibitions-content.2023', { div: (chunks) => <div>{chunks}</div> })}</div>
          <div>2022</div>
          <div>{t.rich('group-exhibitions-content.2022', { div: (chunks) => <div>{chunks}</div> })}</div>
          <div>2021</div>
          <div>{t.rich('group-exhibitions-content.2021', { div: (chunks) => <div>{chunks}</div> })}</div>
          <div>2020</div>
          <div>{t.rich('group-exhibitions-content.2020', { div: (chunks) => <div>{chunks}</div> })}</div>
          <div>2017</div>
          <div>{t.rich('group-exhibitions-content.2017', { div: (chunks) => <div>{chunks}</div> })}</div>
        </div>

        {/* public collections */}
        <div className='pt-4 text-2xl my-12'>{t('public-collections-title')}</div>
        <div className='grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-[1fr_10fr]'>
          <div>2023</div>
          <div>{t.rich('public-collections-content.2023', { div: (chunks) => <div>{chunks}</div> })}</div>
          <div>2018</div>
          <div>{t.rich('public-collections-content.2018', { div: (chunks) => <div>{chunks}</div> })}</div>
          <div>2016</div>
          <div>{t.rich('public-collections-content.2016', { div: (chunks) => <div>{chunks}</div> })}</div>
        </div>

        {/* curations */}
        <div className='pt-4 text-2xl my-12'>{t('curations-title')}</div>
        <div className='grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-[1fr_10fr]'>
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
          <div>2016</div>
          <div>{t.rich('curations-content.2016', { div: (chunks) => <div>{chunks}</div> })}</div>
          <div>2015</div>
          <div>{t.rich('curations-content.2015', { div: (chunks) => <div>{chunks}</div> })}</div>
          <div>2012</div>
          <div>{t.rich('curations-content.2012', { div: (chunks) => <div>{chunks}</div> })}</div>
          <div>2011</div>
          <div>{t.rich('curations-content.2011', { div: (chunks) => <div>{chunks}</div> })}</div>
        </div>

        {/* awards */}
        <div className='pt-4 text-2xl my-12'>{t('awards-title')}</div>
        <div className='grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-[1fr_10fr]'>
          <div>[年份缺失]</div>
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