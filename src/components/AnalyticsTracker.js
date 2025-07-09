'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { pageview, GA_MEASUREMENT_ID } from '@/app/lib/gtag';

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (GA_MEASUREMENT_ID) {
      pageview(pathname);
    }
  }, [pathname]);

  return null;
}