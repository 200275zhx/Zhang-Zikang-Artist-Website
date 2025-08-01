import {Link} from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import LocaleSwitcher from "@/components/LocaleSwitcher";
import MobileNavbar from '@/components/MobileNavbar';
import AnimatedBackgroundGallery from '@/components/AnimatedBackgroundGallery';

export async function generateMetadata() {
  const t = await getTranslations('HomePage.metadata');
  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    
    // // Open Graph: For sharing on social media
    // openGraph: {
    //   title: "Zhang Zikang - Featured Works",
    //   description: "Zhang Zikang's featured works",
    //   videos: [
    //     {
    //       url: "/assets/homepage/homepage_background_demo.webm",
    //       width: 1920,
    //       height: 1080,
    //       alt: "Zhang Zikang - Featured Works",
    //     },
    //   ],
    // },

    // // Twitter Card: For sharing on Twitter
    // twitter: {
    //   // 'card' is the type of Twitter Card you want:
    //   //  - 'summary' or 'summary_large_image' for static images
    //   //  - 'player' to embed a video
    //   card: "player",
    //   title: "Zhang Zikang - Featured Works",
    //   description: "Zhang Zikang's featured works",
    // },
  };
}
 
export default async function HomePage() {
  const t = await getTranslations('HomePage');
  return (
    <div>
      <div className="relative w-full h-screen overflow-hidden">
      <AnimatedBackgroundGallery
        images={[
          '/assets/homepage/21-1.webp',
          '/assets/homepage/21-2.webp',
          '/assets/homepage/23-1.webp',
          '/assets/homepage/23-2.webp',
          // add as many as you like
        ]}
        duration={5000}          // each image: 5s total (1s fade in, 3s hold, 1s fade out)
        fadeInDuration={1000}    // optional: how long the fade-in lasts
        fadeOutDuration={1000}   // optional: how long the fade-out lasts
        offset={100}             // optional: start images 100px above the viewport
      />

        {/* White background container for the title */}
        <div className="absolute top-1/2 transform -translate-y-1/2 w-full bg-white/90 py-8 px-10 md:px-20"> 
          <div className="items-center flex"> {/* Element layout */}
            <Link href="/" className="font-normal text-2xl text-left">
              {t('navbar.name')}
            </Link>
            <span className="text-sm ml-auto mr-48 text-right space-x-8 hidden xl:block">
              <Link href="/news" className="hover:text-gray-600">{t('navbar.news')}</Link>
              <Link href="/works" className="hover:text-gray-600">{t('navbar.works')}</Link>
              <Link href="/exhibitions" className="hover:text-gray-600">{t('navbar.exhibitions')}</Link>
              <Link href="/publications" className="hover:text-gray-600">{t('navbar.publications')}</Link>
              <Link href="/biography" className="hover:text-gray-600">{t('navbar.biography')}</Link>
              <Link href="/contact" className="hover:text-gray-600">{t('navbar.contact')}</Link>
            </span>
            <span className="hidden xl:block">
              <LocaleSwitcher />
            </span>
            <span className="ml-auto text-right xl:hidden">
              <MobileNavbar />
            </span>
          </div>
        </div>
      </div>
      
    </div>
  );
}