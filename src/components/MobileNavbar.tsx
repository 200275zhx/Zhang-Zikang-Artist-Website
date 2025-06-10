"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, Locale } from "@/i18n/routing";
import { useTranslations, useLocale as useLocaleNextIntl } from "next-intl";
import { useSelectedLayoutSegments } from "next/navigation";
import LocaleSwitcher from "./LocaleSwitcher";

export default function MobileNavbar() {
  const t = useTranslations("Navbar");
  const locale = useLocaleNextIntl() as Locale;
  const rawSegments = useSelectedLayoutSegments();
  const segments = rawSegments.filter((s) => s !== locale);

  // Works submenu logic
  const worksIndex = segments.indexOf("works");
  const isWorksPage = worksIndex !== -1;
  const activeYear =
    isWorksPage && segments.length > worksIndex + 1
      ? segments[worksIndex + 1]
      : null;
  const years = [2025, 2024, 2023, 2022, 2019, 2017, 2016, 2015, 2014];

  // Publications submenu logic
  const pubIndex = segments.indexOf("publications");
  const isPublicationsPage = pubIndex !== -1;
  const activePubSlug =
    isPublicationsPage && segments.length > pubIndex + 1
      ? segments[pubIndex + 1]
      : null;
  const PUB_TYPE_SLUGS = {
    articles: { en: "articles", zh: "xue-shu-wen-zhang" },
    editions: { en: "editions", zh: "bian-ji-tu-shu" },
    interviews: { en: "interviews", zh: "fang-tan" },
    monographs: { en: "monographs", zh: "xue-shu-zhuan-zhu" },
  } as const;
  type PubType = keyof typeof PUB_TYPE_SLUGS;
  const PUB_TYPE_ROUTES = {
    articles: "/publications/articles",
    editions: "/publications/editions",
    interviews: "/publications/interviews",
    monographs: "/publications/monographs",
  } as const;
  const PUBLICATION_TYPES = Object.keys(PUB_TYPE_SLUGS) as PubType[];

  // News submenu logic
  const newsIndex = segments.indexOf("news");
  const isNewsPage = newsIndex !== -1;
  const activeNewsSlug =
    isNewsPage && segments.length > newsIndex + 1
      ? segments[newsIndex + 1]
      : null;
  const NEWS_TYPE_SLUGS = {
    interviews: { en: "interviews", zh: "fang-tan" },
    exhibitions: { en: "exhibitions", zh: "can-zhan" },
    curations: { en: "curations", zh: "ce-zhan" },
  } as const;
  type NewsType = keyof typeof NEWS_TYPE_SLUGS;
  const NEWS_TYPE_ROUTES = {
    interviews: "/news/interviews",
    exhibitions: "/news/exhibitions",
    curations: "/news/curations",
  } as const;
  const NEWS_TYPES = Object.keys(NEWS_TYPE_SLUGS) as NewsType[];

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  // client-only guard
  const [isBrowser, setIsBrowser] = useState(false);
  useEffect(() => { setIsBrowser(true); }, []);

  // close on resize
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [mobileMenuOpen]);

  const overlay = (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      <div className="relative mx-auto max-w-[1920px] min-h-full flex flex-col">
        <div className="px-10 py-20 flex items-center justify-between">
          <Link href="/" onClick={toggleMobileMenu} className="font-normal text-2xl">
            {t("name")}
          </Link>
          <button onClick={toggleMobileMenu} className="text-3xl font-light">X</button>
        </div>
        <nav className="px-10 flex-1">
          <div className="flex flex-col space-y-4 text-base font-light">

            {/* Works */}
            <div>
              <Link href="/works" onClick={toggleMobileMenu} className="hover:text-gray-400">
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
                        onClick={toggleMobileMenu}
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

            {/* News */}
            <div>
              <Link href="/news" onClick={toggleMobileMenu} className="hover:text-gray-400">
                {t("news")}
              </Link>
              {isNewsPage && (
                <div className="mt-2 ml-4 flex flex-col space-y-2">
                  {NEWS_TYPES.map((type) => {
                    const isActive = activeNewsSlug === type;
                    return (
                      <Link
                        key={type}
                        href={NEWS_TYPE_ROUTES[type]}
                        locale={locale}
                        onClick={toggleMobileMenu}
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

            {/* Exhibitions */}
            <Link href="/exhibitions" onClick={toggleMobileMenu} className="hover:text-gray-400">
              {t("exhibitions")}
            </Link>

            {/* Publications */}
            <div>
              <Link href="/publications" onClick={toggleMobileMenu} className="hover:text-gray-400">
                {t("publications")}
              </Link>
              {isPublicationsPage && (
                <div className="mt-2 ml-4 flex flex-col space-y-2">
                  {PUBLICATION_TYPES.map((type) => {
                    const isActive = activePubSlug === type;
                    return (
                      <Link
                        key={type}
                        href={PUB_TYPE_ROUTES[type]}
                        locale={locale}
                        onClick={toggleMobileMenu}
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

            {/* Biography */}
            <Link href="/biography" onClick={toggleMobileMenu} className="hover:text-gray-400">
              {t("biography")}
            </Link>

            {/* Contact */}
            <a
              href="https://mail.google.com/mail/u/0/?fs=1&tf=cm&source=mailto&to=hexunzh@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={toggleMobileMenu}
              className="hover:text-gray-400"
            >
              {t("contact")}
            </a>
          </div>
        </nav>
        <div className="px-10 py-20">
          <LocaleSwitcher />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button onClick={toggleMobileMenu} className="text-3xl font-light">
        {mobileMenuOpen ? "X" : "三"}
      </button>
      {isBrowser && mobileMenuOpen && createPortal(overlay, document.body)}
    </>
  );
}
