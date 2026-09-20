import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';
import pathnames from './pathnames.js';
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'zh'],
 
  // Used when no locale matches
  defaultLocale: 'en',

  // Localized URL segments live in ./pathnames.js so that the sitemap
  // generator can read the same map. See that file for details.
  pathnames
});
 
// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export type Locale = (typeof routing.locales)[number];
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
