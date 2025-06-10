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
      zh: "/zuo-pin",
    },
    "/news": {
      en: "/news",
      zh: "/xin-wen",
    },
    "/exhibitions": {
      en: "/exhibitions",
      zh: "/zhan-lan",
    },
    "/publications": {
      en: "/publications",
      zh: "/chu-ban",
    },
    "/biography": {
      en: "/biography",
      zh: "/jing-li",
    },
    "/contact": {
      en: "/contact",
      zh: "/lian-xi",
    },
    "/publications/[pubtype]": {
      en: "/publications/[pubtype]",
      zh: "/chu-ban/[pubtype]",
    },
    "/publications/articles": {
      en: "/publications/articles",
      zh: "/chu-ban/xue-shu-wen-zhang",
    },
    "/publications/editions": {
      en: "/publications/editions",
      zh: "/chu-ban/bian-ji-tu-shu",
    },
    "/publications/interviews": {
      en: "/publications/interviews",
      zh: "/chu-ban/fang-tan",
    },
    "/publications/monographs": {
      en: "/publications/monographs",
      zh: "/chu-ban/xue-shu-zhuan-zhu",
    },
    "/works/[workId]": {
      en: "/works/[workId]",
      zh: "/zuo-pin/[workId]"
    },
    "/news/[newstype]": {
      en: "/news/[newstype]",
      zh: "/xin-wen/[newstype]",
    },
    "/news/interviews": {
      en: "/news/interviews",
      zh: "/xin-wen/fang-tan",
    },
    "/news/exhibitions": {
      en: "/news/exhibitions",
      zh: "/xin-wen/can-zhan",
    },
    "/news/curations": {
      en: "/news/curations",
      zh: "/xin-wen/ce-zhan",
    },
    "/exhibitions/[exhibitionId]": {
      en: "/exhibitions/[exhibitionId]",
      zh: "/zhan-lan/[exhibitionId]"
    },
    "/works/2025/[workId]": {
      en: "/works/2025/[workId]",
      zh: "/zuo-pin/2025/[workId]"
    },
    "/works/2024/[workId]": {
      en: "/works/2024/[workId]",
      zh: "/zuo-pin/2024/[workId]"
    },
    "/works/2023/[workId]": {
      en: "/works/2023/[workId]",
      zh: "/zuo-pin/2023/[workId]"
    },
    "/works/2022/[workId]": {
      en: "/works/2022/[workId]",
      zh: "/zuo-pin/2022/[workId]"
    },
    "/works/2019/[workId]": {
      en: "/works/2019/[workId]",
      zh: "/zuo-pin/2019/[workId]"
    },
    "/works/2017/[workId]": {
      en: "/works/2017/[workId]",
      zh: "/zuo-pin/2017/[workId]"
    },
    "/works/2016/[workId]": {
      en: "/works/2016/[workId]",
      zh: "/zuo-pin/2016/[workId]"
    },
    "/works/2015/[workId]": {
      en: "/works/2015/[workId]",
      zh: "/zuo-pin/2015/[workId]"
    },
    "/works/2014/[workId]": {
      en: "/works/2014/[workId]",
      zh: "/zuo-pin/2014/[workId]"
    },
    "/works/2025": {
      en: "/works/2025",
      zh: "/zuo-pin/2025"
    },
    "/works/2024": {
      en: "/works/2024",
      zh: "/zuo-pin/2024"
    },
    "/works/2023": {
      en: "/works/2023",
      zh: "/zuo-pin/2023"
    },
    "/works/2022": {
      en: "/works/2022",
      zh: "/zuo-pin/2022"
    },
    "/works/2019": {
      en: "/works/2019",
      zh: "/zuo-pin/2019"
    },
    "/works/2017": {
      en: "/works/2017",
      zh: "/zuo-pin/2017"
    },
    "/works/2016": {
      en: "/works/2016",
      zh: "/zuo-pin/2016"
    },
    "/works/2015": {
      en: "/works/2015",
      zh: "/zuo-pin/2015"
    },
    "/works/2014": {
      en: "/works/2014",
      zh: "/zuo-pin/2014"
    }
  }
});
 
// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export type Locale = (typeof routing.locales)[number];
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);