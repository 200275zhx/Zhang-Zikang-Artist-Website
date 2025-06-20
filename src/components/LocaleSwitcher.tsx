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