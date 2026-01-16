"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale as useLocaleNextIntl } from "next-intl";
import { useSelectedLayoutSegments } from "next/navigation";

export default function Navbar() {
  const t = useTranslations("Navbar");
  const locale = useLocaleNextIntl();             // "en" or "zh"
  const rawSegments = useSelectedLayoutSegments();
  const segments = rawSegments.filter((seg) => seg !== locale);

  // Works submenu logic
  const worksIndex = segments.indexOf("works");
  const isWorksPage = worksIndex !== -1;
  const activeYear =
    isWorksPage && segments.length > worksIndex + 1
      ? segments[worksIndex + 1]
      : null;

  // Publications submenu logic (canonical detection)
  const pubIndex = segments.indexOf("publications");
  const isPublicationsPage = pubIndex !== -1;
  const activePubSlug =
    isPublicationsPage && segments.length > pubIndex + 1
      ? segments[pubIndex + 1]
      : null;

  const years = [2025, 2024, 2023, 2022, 2019, 2017, 2016, 2015, 2014];
  const PUB_TYPE_SLUGS: Record<string, Record<string, string>> = {
    articles: { en: "articles", zh: "xue-shu-wen-zhang" },
    editions: { en: "editions", zh: "bian-ji-tu-shu" },
    interviews: { en: "interviews", zh: "fang-tan" },
    monographs: { en: "monographs", zh: "xue-shu-zhuan-zhu" },
  };
  const PUBLICATION_TYPES = Object.keys(PUB_TYPE_SLUGS);

  // News submenu logic (canonical detection)
  const newsIndex = segments.indexOf("news");
  const isNewsPage = newsIndex !== -1;
  const activeNewsSlug =
    isNewsPage && segments.length > newsIndex + 1
      ? segments[newsIndex + 1]
      : null;

  const NEWS_TYPE_SLUGS: Record<string, Record<string, string>> = {
    interviews: { en: "interviews", zh: "fang-tan" },
    exhibitions: { en: "exhibitions", zh: "can-zhan" },
    curations: { en: "curations", zh: "ce-zhan" },
  };
  const NEWS_TYPES = Object.keys(NEWS_TYPE_SLUGS);

  return (
    <nav className="sticky top-0 h-screen pt-12 pl-20 pr-16 text-sm flex flex-col justify-between pb-8">
      <div className="flex flex-col space-y-4">

        {/* News */}
        <div>
          <Link
            href="/news"
            className={`block w-full px-2 py-1 whitespace-nowrap min-w-max transition-colors rounded-sm
              ${isNewsPage ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}
            `}
          >
            {t("news")}
          </Link>
          {isNewsPage && (
            <div className="mt-2 ml-4 flex flex-col space-y-2">
              {NEWS_TYPES.map((type) => {
                const localized = NEWS_TYPE_SLUGS[type][locale];
                const isActive = activeNewsSlug === type;
                return (
                  <Link
                    key={type}
                    href={{ pathname: "/news/[newstype]", params: { newstype: localized } }}
                    className={`whitespace-nowrap transition-colors
                      ${isActive
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground"}
                    `}
                  >
                    {t(type)}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Works */}
        <div>
          <Link
            href="/works"
            className={`block w-full px-2 py-1 whitespace-nowrap min-w-max transition-colors rounded-sm
              ${isWorksPage ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}
            `}
          >
            {t("works")}
          </Link>
          {isWorksPage && (
            <div className="mt-2 ml-4 flex flex-col space-y-2">
              {years.map((year) => {
                const slug = String(year);
                const isActive = activeYear === slug;
                return (
                  <Link
                    key={year}
                    href={{ pathname: "/works/[workId]", params: { workId: slug } }}
                    className={`whitespace-nowrap transition-colors
                      ${isActive
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground"}
                    `}
                  >
                    {year}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Exhibitions */}
        <Link
          href="/exhibitions"
          className={`block w-full px-2 py-1 whitespace-nowrap min-w-max transition-colors rounded-sm
            ${segments[0] === "exhibitions" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}
          `}
        >
          {t("exhibitions")}
        </Link>

        {/* Publications */}
        <div>
          <Link
            href="/publications"
            className={`block w-full px-2 py-1 whitespace-nowrap min-w-max transition-colors rounded-sm
              ${isPublicationsPage ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}
            `}
          >
            {t("publications")}
          </Link>
          {isPublicationsPage && (
            <div className="mt-2 ml-4 flex flex-col space-y-2">
              {PUBLICATION_TYPES.map((type) => {
                const localized = PUB_TYPE_SLUGS[type][locale];
                const isActive = activePubSlug === type;
                return (
                  <Link
                    key={type}
                    href={{ pathname: "/publications/[pubtype]", params: { pubtype: localized } }}
                    className={`whitespace-nowrap transition-colors
                      ${isActive
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground"}
                    `}
                  >
                    {t(type)}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Biography */}
        <Link
          href="/biography"
          className={`block w-full px-2 py-1 whitespace-nowrap min-w-max transition-colors rounded-sm
            ${segments[0] === "biography" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}
          `}
        >
          {t("biography")}
        </Link>

        {/* Contact */}
        <a
          href="https://mail.google.com/mail/u/0/?fs=1&tf=cm&source=mailto&to=hexunzh@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          className={`block w-full px-2 py-1 whitespace-nowrap min-w-max transition-colors rounded-sm
            ${segments[0] === undefined ? "" : ""}
            text-muted-foreground hover:text-foreground`
          }
        >
          {t("contact")}
        </a>
      </div>

    </nav>
  );
}
