import {Link} from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import LocaleSwitcher from "@/components/LocaleSwitcher";

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
      {/* <h1>{t('title')}</h1>
      <Link href="/contact">{t('contact')}</Link> */}

      <div className="relative w-full h-screen overflow-hidden">
        <video 
          src="/assets/homepage/webm_placeholder.webm" 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="absolute top-0 left-0 w-full h-full object-cover"
        />

        {/* White background container for the title */}
        <div className="absolute top-1/2 transform -translate-y-1/2 w-full bg-white py-8 px-20"> 
          <div className="max-w-[2560px] ml-auto items-center flex"> {/* Element layout */}
            <Link href="/" className="font-normal text-2xl text-left">
              {t('navbar.name')}
            </Link>
            <span className="text-sm ml-40 space-x-8">
              <Link href="/works" className="hover:text-gray-600">{t('navbar.works')}</Link>
              <Link href="/news" className="hover:text-gray-600">{t('navbar.news')}</Link>
              <Link href="/exhibitions" className="hover:text-gray-600">{t('navbar.exhibitions')}</Link>
              <Link href="/publications" className="hover:text-gray-600">{t('navbar.publications')}</Link>
              <Link href="/biography" className="hover:text-gray-600">{t('navbar.biography')}</Link>
              <Link href="/contact" className="hover:text-gray-600">{t('navbar.contact')}</Link>
            </span>
            <LocaleSwitcher />
          </div>
        </div>
      </div>
      
    </div>
  );
}