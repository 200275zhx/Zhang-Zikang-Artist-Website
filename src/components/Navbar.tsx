// app/components/Navbar.tsx
"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale as useLocaleNextIntl } from "next-intl";
import { useSelectedLayoutSegments } from "next/navigation";

export default function Navbar() {
  const t = useTranslations("Navbar");
  const locale = useLocaleNextIntl();              // e.g. "en" or "zh"
  const segments = useSelectedLayoutSegments();    // e.g. ["en","works","2025"]

  console.log("Layout segments:", segments);

  // Find where "works" sits in the segments array
  const worksIndex = segments.indexOf("works");
  const isWorksPage = worksIndex !== -1;
  // If there's something after "works", that's our active workId
  const activeYear =
    isWorksPage && segments.length > worksIndex + 1
      ? segments[worksIndex + 1]
      : null;

  console.log("isWorksPage:", isWorksPage);
  console.log("activeYear:", activeYear);

  // Years to render in the submenu
  const years = [2025, 2024, 2023, 2022, 2019, 2017, 2016, 2015, 2014];

  return (
    <nav className="sticky top-0 h-screen pt-12 pl-20 pr-16 text-sm">
      <div className="flex flex-col space-y-4">
        {/* Works Link */}
        <div>
          <Link href="/works" className="hover:text-gray-400">
            {t("works")}
          </Link>

          {/* Submenu only on /works or /works/[year] */}
          {isWorksPage && (
            <div className="mt-2 ml-4 flex flex-col space-y-2">
              {years.map((year) => {
                const isActive = activeYear === String(year);
                console.log(`Year ${year}: isActive = ${isActive}`);

                return (
                  <Link
                    key={year}
                    href={{
                      pathname: "/works/[workId]",
                      params: { workId: String(year) },
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

        <Link href="/news" className="hover:text-gray-400">
          {t("news")}
        </Link>
        <Link href="/exhibitions" className="hover:text-gray-400">
          {t("exhibitions")}
        </Link>
        <Link href="/publications" className="hover:text-gray-400">
          {t("publications")}
        </Link>
        <Link href="/biography" className="hover:text-gray-400">
          {t("biography")}
        </Link>
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
