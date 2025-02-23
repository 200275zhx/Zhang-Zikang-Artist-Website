// app/components/Navbar.tsx
"use client";

import React from "react";
import {Link} from '@/i18n/routing';
import { useTranslations } from "next-intl";

export default function Navbar() {
  const t = useTranslations("Navbar");

  return (
    <nav className="sticky top-0 h-screen pt-12 pl-20 pr-16 text-sm">
      <div className="flex flex-col space-y-4">
        <Link href="/works" className="hover:text-gray-600">
          {t("works")}
        </Link>
        <Link href="/news" className="hover:text-gray-600">
          {t("news")}
        </Link>
        <Link href="/exhibitions" className="hover:text-gray-600">
          {t("exhibitions")}
        </Link>
        <Link href="/publications" className="hover:text-gray-600">
          {t("publications")}
        </Link>
        <Link href="/biography" className="hover:text-gray-600">
          {t("biography")}
        </Link>
        <Link href="/contact" className="hover:text-gray-600">
          {t("contact")}
        </Link>
      </div>
    </nav>
  );
}
