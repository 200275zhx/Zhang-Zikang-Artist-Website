// app/components/Navbar.tsx
"use client";

import React from "react";
import { usePathname, Link } from "@/i18n/routing";
import { useTranslations, useLocale as useLocaleNextIntl } from "next-intl";
import { useParams } from "next/navigation";

export default function Navbar() {
  const t = useTranslations("Navbar");
  const locale = useLocaleNextIntl();
  const pathname = usePathname();
  const params = useParams();
  const currentWorkId = params?.workId; // dynamic parameter, e.g. "2024"

  // Normalize pathname: remove a trailing slash if one exists.
  const normalizedPathname =
    pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;

  // use canonical works route for comparison.
  // When using next-intl, usePathname returns the canonical route—for both zh and en the works landing is "/works".
  const canonicalWorksPath = "/works";

  // Debug logs for overall navigation
  console.log("Locale:", locale);
  console.log("Current pathname:", pathname);
  console.log("Normalized pathname:", normalizedPathname);
  console.log("Canonical worksPath:", canonicalWorksPath);
  console.log("Route params:", params);

  // Determine whether to show the submenu:
  // Show if we're on the works landing page or if a dynamic work id exists.
  const isWorksPage = normalizedPathname === canonicalWorksPath || currentWorkId != null;

  // Define submenu years.
  const years = [2025, 2024, 2023, 2022, 2019, 2017, 2016, 2015, 2014];

  return (
    <nav className="sticky top-0 h-screen pt-12 pl-20 pr-16 text-sm">
      <div className="flex flex-col space-y-4">
        {/* Works Link with conditional submenu */}
        <div>
          <Link href="/works" className="hover:text-gray-400">
            {t("works")}
          </Link>
          {isWorksPage && (
            <div className="mt-4 mb-2 ml-4 flex flex-col space-y-2">
              {years.map((year) => {
                // Determine if this submenu item is active by comparing the current workId.
                const isActiveSubmenu = currentWorkId != null && String(year) === String(currentWorkId);
                console.log(
                  `Year ${year}: currentWorkId = ${currentWorkId}, active = ${isActiveSubmenu}`
                );
                return (
                  <Link
                    key={year}
                    href={{
                      pathname: "/works/[workId]",
                      params: { workId: String(year) },
                    }}
                    className={isActiveSubmenu ? "text-black" : "text-gray-400 hover:text-gray-400"}
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
