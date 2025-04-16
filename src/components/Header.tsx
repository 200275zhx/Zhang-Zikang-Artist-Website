// app/components/Header.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "./LocaleSwitcher";
import MobileNavbar from "./MobileNavbar";


export default function Header() {
  const t = useTranslations("Navbar");
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY;
      // Hide header on scroll down, show on scroll up
      if (currentScrollY > lastScrollY) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setLastScrollY(currentScrollY);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`transition-transform duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {/* Optional padding and container to match your styling */}
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
