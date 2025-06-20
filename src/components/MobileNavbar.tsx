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

  // Animation and menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  // Track which menu link is being clicked
  const [clickedLink, setClickedLink] = useState<string | null>(null);

  const openMenu = () => {
    setClickedLink(null);
    setMenuVisible(true);
    setTimeout(() => setMobileMenuOpen(true), 10);
  };
  const closeMenu = () => {
    setMobileMenuOpen(false);
    setClickedLink(null);
    setMenuVisible(false);
  };

  // client-only guard
  const [isBrowser, setIsBrowser] = useState(false);
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  // close on resize
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        closeMenu();
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [mobileMenuOpen]);

  // Prevent scrolling of body when menu open
  useEffect(() => {
    if (menuVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [menuVisible]);

  // The animated sliding overlay
  const overlay = (
    <div className="fixed inset-0 z-50 flex">
      {/* Sliding Panel */}
      <div
        className={`
          fixed top-0 right-0 h-full w-full max-w-[500px] bg-white overflow-auto
          transition-transform duration-[1000ms] ease-in-out
          ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}
          shadow-2xl
        `}
      >
        <div className="relative mx-auto max-w-[1920px] min-h-full flex flex-col">
          <div className="px-10 py-20 flex items-center justify-between">
            {/* Home link */}
            <Link
              href="/"
              onClick={() => { setClickedLink("home"); closeMenu(); }}
              className={`block w-full font-normal text-2xl px-2 py-1`}
            >
              {t("name")}
            </Link>
            <button onClick={closeMenu} className="font-light whitespace-nowrap">
              {t("return")}
            </button>
          </div>
          <nav className="px-10 flex-1">
            <div className="flex flex-col space-y-4 text-base font-light">
              {/* News */}
              <div>
                <Link
                  href="/news"
                  onClick={() => { setClickedLink("news"); closeMenu(); }}
                  className={`block w-full hover:text-gray-400 px-2 py-1
                    ${clickedLink === "news" || isNewsPage ? "bg-black text-white" : ""}
                  `}
                >
                  {t("news")}
                </Link>
                {isNewsPage && (
                  <div className="mt-2 ml-4 flex flex-col space-y-2">
                    {NEWS_TYPES.map((type) => {
                      const isActive = activeNewsSlug === type;
                      const key = `news-${type}`;
                      return (
                        <Link
                          key={type}
                          href={NEWS_TYPE_ROUTES[type]}
                          locale={locale}
                          onClick={() => { setClickedLink(key); closeMenu(); }}
                          className={
                            isActive
                              ? "text-black font-normal"
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
              {/* Works */}
              <div>
                <Link
                  href="/works"
                  onClick={() => { setClickedLink("works"); closeMenu(); }}
                  className={`block w-full hover:text-gray-400 px-2 py-1
                    ${clickedLink === "works" || isWorksPage ? "bg-black text-white" : ""}
                  `}
                >
                  {t("works")}
                </Link>
                {isWorksPage && (
                  <div className="mt-2 ml-4 flex flex-col space-y-2">
                    {years.map((year) => {
                      const slug = String(year);
                      const isActive = activeYear === slug;
                      const key = `works-${year}`;
                      return (
                        <Link
                          key={year}
                          href={{
                            pathname: "/works/[workId]",
                            params: { workId: slug },
                          }}
                          onClick={() => { setClickedLink(key); closeMenu(); }}
                          className={
                            isActive
                              ? "text-black font-normal"
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
              {/* Exhibitions */}
              <Link
                href="/exhibitions"
                onClick={() => { setClickedLink("exhibitions"); closeMenu(); }}
                className={`block w-full hover:text-gray-400 px-2 py-1
                  ${clickedLink === "exhibitions" || segments[0] === "exhibitions" ? "bg-black text-white" : ""}
                `}
              >
                {t("exhibitions")}
              </Link>
              {/* Publications */}
              <div>
                <Link
                  href="/publications"
                  onClick={() => { setClickedLink("publications"); closeMenu(); }}
                  className={`block w-full hover:text-gray-400 px-2 py-1
                    ${clickedLink === "publications" || isPublicationsPage ? "bg-black text-white" : ""}
                  `}
                >
                  {t("publications")}
                </Link>
                {isPublicationsPage && (
                  <div className="mt-2 ml-4 flex flex-col space-y-2">
                    {PUBLICATION_TYPES.map((type) => {
                      const isActive = activePubSlug === type;
                      const key = `publications-${type}`;
                      return (
                        <Link
                          key={type}
                          href={PUB_TYPE_ROUTES[type]}
                          locale={locale}
                          onClick={() => { setClickedLink(key); closeMenu(); }}
                          className={
                            isActive
                              ? "text-black font-normal"
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
              <Link
                href="/biography"
                onClick={() => { setClickedLink("biography"); closeMenu(); }}
                className={`block w-full hover:text-gray-400 px-2 py-1
                  ${clickedLink === "biography" || segments[0] === "biography" ? "bg-black text-white" : ""}
                `}
              >
                {t("biography")}
              </Link>
              {/* Contact */}
              <a
                href="https://mail.google.com/mail/u/0/?fs=1&tf=cm&source=mailto&to=hexunzh@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => { setClickedLink("contact"); closeMenu(); }}
                className={`block w-full hover:text-gray-400 px-2 py-1
                  ${clickedLink === "contact" ? "bg-black text-white" : ""}
                `}
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
    </div>
  );

  return (
    <>
      <button
        onClick={mobileMenuOpen ? closeMenu : openMenu}
        className="p-2"
        aria-label="Open menu"
      >
        {mobileMenuOpen ? (
          "X"
        ) : (
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect y="2" width="28" height="3" rx="1.5" fill="black" />
            <rect y="12" width="28" height="3" rx="1.5" fill="black" />
            <rect y="22" width="28" height="3" rx="1.5" fill="black" />
          </svg>
        )}
      </button>
      {isBrowser && menuVisible && createPortal(overlay, document.body)}
    </>
  );
}
