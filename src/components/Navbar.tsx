// app/components/Navbar.tsx
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

  // DEBUG
  // console.log("rawSegments:", rawSegments);
  // console.log("strippedSegments:", segments);

  //
  // Works submenu logic
  //
  const worksIndex = segments.indexOf("works");
  const isWorksPage = worksIndex !== -1;
  const activeYear =
    isWorksPage && segments.length > worksIndex + 1
      ? segments[worksIndex + 1]
      : null;

  //
  // Publications submenu logic (canonical detection)
  //
  const pubIndex = segments.indexOf("publications");
  const isPublicationsPage = pubIndex !== -1;
  // This is the canonical child slug, e.g. "articles" or "editions"
  const activePubSlug =
    isPublicationsPage && segments.length > pubIndex + 1
      ? segments[pubIndex + 1]
      : null;

  // DEBUG
  // console.log("isPublicationsPage:", isPublicationsPage);
  // console.log("activePubSlug (canonical):", activePubSlug);

  const YEARS = [2025, 2024, 2023, 2022, 2019, 2017, 2016, 2015, 2014];
  const PUB_TYPE_SLUGS: Record<string, Record<string, string>> = {
    articles:   { en: "articles",            zh: "xue-shu-wen-zhang"   },
    editions:   { en: "editions",            zh: "bian-ji-tu-shu"      },
    interviews: { en: "interviews",          zh: "fang-tan"            },
    monographs: { en: "monographs",          zh: "xue-shu-zhuan-zhu"   },
  };
  const PUBLICATION_TYPES = Object.keys(PUB_TYPE_SLUGS);

  return (
    <nav className="sticky top-0 h-screen pt-12 pl-20 pr-16 text-sm">
      <div className="flex flex-col space-y-4">

        {/* Works */}
        <div>
          <Link href="/works" className="hover:text-gray-400">
            {t("works")}
          </Link>
          {isWorksPage && (
            <div className="mt-2 ml-4 flex flex-col space-y-2">
              {YEARS.map((year) => {
                const slug = String(year);
                const isActive = activeYear === slug;
                // console.log(`Works year ${year}: active=${isActive}`);
                return (
                  <Link
                    key={year}
                    href={{
                      pathname: "/works/[workId]",
                      params: { workId: slug },
                    }}
                    className={
                      isActive
                        ? "text-black"
                        : "text-gray-400 hover:text-gray-400"
                    }
                  >
                    {year}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Publications */}
        <div>
          <Link href="/publications" className="hover:text-gray-400">
            {t("publications")}
          </Link>
          {isPublicationsPage && (
            <div className="mt-2 ml-4 flex flex-col space-y-2">
              {PUBLICATION_TYPES.map((type) => {
                // localized slug for link
                const localized = PUB_TYPE_SLUGS[type][locale];
                // active if canonical segment matches the type key
                const isActive = activePubSlug === type;
                // console.log( `Pub type ${type} => localized="${localized}", active=${isActive}` );
                return (
                  <Link
                    key={type}
                    href={{
                      pathname: "/publications/[pubtype]",
                      params: { pubtype: localized },
                    }}
                    className={
                      isActive
                        ? "text-black"
                        : "text-gray-400 hover:text-gray-400"
                    }
                  >
                    {t(type)}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* News */}
        <Link href="/news" className="hover:text-gray-400">
          {t("news")}
        </Link>

        {/* Exhibitions */}
        <Link href="/exhibitions" className="hover:text-gray-400">
          {t("exhibitions")}
        </Link>

        {/* Biography */}
        <Link href="/biography" className="hover:text-gray-400">
          {t("biography")}
        </Link>

        {/* Contact */}
        <a
          href="https://mail.google.com/mail/u/0/?fs=1&tf=cm&source=mailto&to=hexunzh@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-400"
        >
          {t("contact")}
        </a>
      </div>
    </nav>
  );
}
