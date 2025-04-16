"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useSelectedLayoutSegments } from "next/navigation";
import LocaleSwitcher from "./LocaleSwitcher";

export default function MobileNavbar() {
  const t = useTranslations("Navbar");
  const segments = useSelectedLayoutSegments(); // e.g. ["en", "works", "2025"]

  // Determine if we're on a /works or /works/[year] page.
  const worksIndex = segments.indexOf("works");
  const isWorksPage = worksIndex !== -1;
  const activeYear =
    isWorksPage && segments.length > worksIndex + 1
      ? segments[worksIndex + 1]
      : null;

  // Array of years to render in the submenu.
  const years = [2025, 2024, 2023, 2022, 2019, 2017, 2016, 2015, 2014];

  // Local state to control mobile menu open/close.
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  // Ensure we're running on the client.
  const [isBrowser, setIsBrowser] = useState(false);
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  // Close the mobile menu if the viewport exceeds mobile size (e.g., 768px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileMenuOpen]);

  // The overlay is wrapped in a container that mimics your content layout.
  const overlay = (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      {/* Mimic your centered layout and max width */}
      <div className="relative mx-auto max-w-[1920px] min-h-full flex flex-col">
        {/* Header area with matching padding */}
        <div className="px-10 py-20 flex items-center justify-between">
          <Link href="/" onClick={toggleMobileMenu} className="font-normal text-2xl">
            {t("name")}
          </Link>
          <button onClick={toggleMobileMenu} className="text-3xl font-light">
            X
          </button>
        </div>
        {/* Navigation content area */}
        <nav className="px-10 flex-1">
          <div className="flex flex-col space-y-4 text-base font-light">
            <div>
              <Link
                href="/works"
                onClick={toggleMobileMenu}
                className="hover:text-gray-400"
              >
                {t("works")}
              </Link>
              {isWorksPage && (
                <div className="mt-2 ml-4 flex flex-col space-y-2">
                  {years.map((year) => {
                    const isActive = activeYear === String(year);
                    return (
                      <Link
                        key={year}
                        href={{
                          pathname: "/works/[workId]",
                          params: { workId: String(year) },
                        }}
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

            <Link
              href="/news"
              onClick={toggleMobileMenu}
              className="hover:text-gray-400"
            >
              {t("news")}
            </Link>
            <Link
              href="/exhibitions"
              onClick={toggleMobileMenu}
              className="hover:text-gray-400"
            >
              {t("exhibitions")}
            </Link>
            <Link
              href="/publications"
              onClick={toggleMobileMenu}
              className="hover:text-gray-400"
            >
              {t("publications")}
            </Link>
            <Link
              href="/biography"
              onClick={toggleMobileMenu}
              className="hover:text-gray-400"
            >
              {t("biography")}
            </Link>
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
        {/* LocaleSwitcher positioned at the bottom */}
        <div className="px-10 pb-20">
          <LocaleSwitcher />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile navigation button in Header */}
      <button onClick={toggleMobileMenu} className="text-3xl font-light">
        {mobileMenuOpen ? "X" : "三"}
      </button>
      {isBrowser && mobileMenuOpen && createPortal(overlay, document.body)}
    </>
  );
}
