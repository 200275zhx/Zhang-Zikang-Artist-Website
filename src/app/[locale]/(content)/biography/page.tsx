import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export default async function BiographyPage() {
    const t = await getTranslations('BiographyPage');
  return (
    <div>
      <h1>{t('title')}</h1>
      <Link href="/">{t('go back')}</Link>
    </div>
  );
}