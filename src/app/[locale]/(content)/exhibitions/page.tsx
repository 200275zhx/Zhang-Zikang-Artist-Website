import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export default async function ExhibitionsPage() {
    const t = await getTranslations('ExhibitionsPage');
  return (
    <div>
      <h1>{t('title')}</h1>
      <Link href="/">{t('go back')}</Link>
    </div>
  );
}