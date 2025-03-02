"use client";

import React from "react";
import { useRouter, usePathname, Locale } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams() as { locale?: string };
  const t = useTranslations("Translations");

  function handleLocaleClick(nextLocale: Locale) {
    router.replace(
      // @ts-expect-error We know `params` and `pathname` match
      { pathname, params },
      { locale: nextLocale }
    );
  }

  const currentLocale = params.locale; 
  
  return (
    <div className="text-sm space-x-4">
      <span
        className={
          // If current locale is English, show EN as normal, else muted
          `cursor-pointer ${
            currentLocale === "en" ? "text-black" : "text-gray-400"
          }`
        }
        onClick={() => handleLocaleClick("en")}
      >
        {t("en")}
      </span>

      <span className="text-gray-600">|</span>

      <span
        className={
          // If current locale is Chinese, show ZH as normal, else muted
          `cursor-pointer ${
            currentLocale === "zh" ? "text-black" : "text-gray-400"
          }`
        }
        onClick={() => handleLocaleClick("zh")}
      >
        {t("zh")}
      </span>
    </div>
  );
}
// "use client";

// import React from "react";
// import { useRouter, usePathname, Locale } from "@/i18n/routing";
// import { useParams } from "next/navigation";
// import { useTranslations } from "next-intl";

// // Example dictionary imports (optional if you're using cross-locale detail logic)
// import worksEn from "@/app/data/works/en.json";
// import worksZh from "@/app/data/works/zh.json";

// // If your detail page uses a dictionary shape like this:
// type WorkDictItem = {
//   url: string;  // local slug
//   title: string;
//   src: string;
//   alt: string;
// };
// type WorkDict = Record<string, WorkDictItem>;

// export default function LocaleSwitcher() {
//   const router = useRouter();
//   const pathname = usePathname();
//   const params = useParams() as { locale?: string; workId?: string };
//   const t = useTranslations("Translations");

//   function handleLocaleClick(nextLocale: Locale) {
//     // If there's no 'workId', do your original simple approach
//     if (!params.workId) {
//       router.replace(
//         // @ts-expect-error We know `params` and `pathname` match
//         { pathname, params },
//         { locale: nextLocale }
//       );
//       return;
//     }

//     // If you *do* have a 'workId', and you have different slugs in each locale:
//     // 1) Identify the current locale and slug
//     const currentLocale = params.locale;
//     const currentSlug = params.workId;

//     // 2) Load the appropriate dictionary if you want cross-locale rewriting
//     const currentDict =
//       currentLocale === "en"
//         ? (worksEn as WorkDict)
//         : (worksZh as WorkDict);

//     // 3) Find the universal key by searching for an entry whose url === currentSlug
//     const [universalKey] =
//       Object.entries(currentDict).find(([, item]) => item.url === currentSlug) ??
//       [];

//     // If not found, fallback to just switching locale
//     if (!universalKey) {
//       router.replace(
//         // @ts-expect-error
//         { pathname, params },
//         { locale: nextLocale }
//       );
//       return;
//     }

//     // 4) Load the next locale’s dictionary
//     const newDict =
//       nextLocale === "en"
//         ? (worksEn as WorkDict)
//         : (worksZh as WorkDict);

//     // 5) Get the new slug from that universal key
//     const newItem = newDict[universalKey];
//     if (!newItem) {
//       // fallback
//       router.replace(
//         // @ts-expect-error
//         { pathname, params },
//         { locale: nextLocale }
//       );
//       return;
//     }

//     // 6) Replace with the new slug
//     router.replace(
//       {
//         pathname,
//         params: {
//           // keep the same object shape but override workId
//           ...params,
//           workId: newItem.url,
//         },
//       },
//       { locale: nextLocale }
//     );
//   }

//   const currentLocale = params.locale;

//   return (
//     <div className="text-sm ml-auto space-x-4">
//       <span
//         className={`cursor-pointer ${
//           currentLocale === "en" ? "text-black" : "text-gray-400"
//         }`}
//         onClick={() => handleLocaleClick("en")}
//       >
//         {t("en")}
//       </span>

//       <span className="text-gray-600">|</span>

//       <span
//         className={`cursor-pointer ${
//           currentLocale === "zh" ? "text-black" : "text-gray-400"
//         }`}
//         onClick={() => handleLocaleClick("zh")}
//       >
//         {t("zh")}
//       </span>
//     </div>
//   );
// }
