import {Link} from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('HomePage.metadata');
  return {
    title: t('title'),
    description: t('description'),
  };
}
 
export default async function HomePage() {
  const t = await getTranslations('HomePage');
  return (
    <div>
      <h1>{t('title')}</h1>
      <Link href="/contact">{t('contact')}</Link>
    </div>
  );
}