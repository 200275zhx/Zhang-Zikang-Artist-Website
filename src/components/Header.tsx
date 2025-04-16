"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "./LocaleSwitcher";
import MobileNavbar from "./MobileNavbar";

export default function Header() {
  const t = useTranslations("Navbar");
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      // if scrolling down past 50px, hide; if scrolling up, show
      if (currentY > lastScrollY.current && currentY > 50) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`transition-transform duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="px-10 py-20 md:px-20 flex items-center justify-between">
        <Link href="/" className="font-normal text-2xl">
          {t("name")}
        </Link>
        <div className="hidden md:block">
          <LocaleSwitcher />
        </div>
        <div className="md:hidden">
          <MobileNavbar />
        </div>
      </div>
    </div>
  );
}
