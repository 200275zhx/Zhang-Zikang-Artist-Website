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
    },
    "/works/2025/[workId]": {
      en: "/works/2025/[workId]",
      zh: "/zuopin/2025/[workId]"
    },
    "/works/2024/[workId]": {
      en: "/works/2024/[workId]",
      zh: "/zuopin/2024/[workId]"
    },
    "/works/2023/[workId]": {
      en: "/works/2023/[workId]",
      zh: "/zuopin/2023/[workId]"
    },
    "/works/2022/[workId]": {
      en: "/works/2022/[workId]",
      zh: "/zuopin/2022/[workId]"
    },
    "/works/2019/[workId]": {
      en: "/works/2019/[workId]",
      zh: "/zuopin/2019/[workId]"
    },
    "/works/2017/[workId]": {
      en: "/works/2017/[workId]",
      zh: "/zuopin/2017/[workId]"
    },
    "/works/2016/[workId]": {
      en: "/works/2016/[workId]",
      zh: "/zuopin/2016/[workId]"
    },
    "/works/2015/[workId]": {
      en: "/works/2015/[workId]",
      zh: "/zuopin/2015/[workId]"
    },
    "/works/2014/[workId]": {
      en: "/works/2014/[workId]",
      zh: "/zuopin/2014/[workId]"
    }
  }
});
 
// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export type Locale = (typeof routing.locales)[number];
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);