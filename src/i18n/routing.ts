import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'zh'],
 
  // Used when no locale matches
  defaultLocale: 'en',
  pathnames: {
    "/": {
      en: "/",
      zh: "/",
    },
    "/works": {
      en: "/works",
      zh: "/zuopin",
    },
    "/news": {
      en: "/news",
      zh: "/xinwen",
    },
    "/exhibitions": {
      en: "/exhibitions",
      zh: "/zhanlan",
    },
    "/publications": {
      en: "/publications",
      zh: "/chuban",
    },
    "/biography": {
      en: "/biography",
      zh: "/jingli",
    },
    "/contact": {
      en: "/contact",
      zh: "/lianxi",
    },
    "/works/[workId]": {
      en: "/works/[workId]",
      zh: "/zuopin/[workId]"
    },
    "/news/[newsId]": {
      en: "/news/[newsId]",
      zh: "/news/[newsId]"
    },
    "/exhibitions/[exhibitionId]": {
      en: "/exhibitions/[exhibitionId]",
      zh: "/exhibitions/[exhibitionId]"
    },
    "/publications/[publicationId]": {
      en: "/publications/[publicationId]",
      zh: "/publications/[publicationId]"
    }
  }
});
 
// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export type Locale = (typeof routing.locales)[number];
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);