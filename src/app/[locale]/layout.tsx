import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import type { Metadata } from "next"
import { Noto_Sans_SC } from 'next/font/google'
import "./globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"
import Script from 'next/script'
import { AnalyticsTracker } from '@/components/AnalyticsTracker'
import { GA_MEASUREMENT_ID } from '@/app/lib/gtag'

// Load fonts
const notoSansSC = Noto_Sans_SC({
  weight: ['300', '400', '500'], // or an array like ['400', '700'] if needed
  subsets: ['latin'],
});

// Site-wide fallback metadata. Every page supplies its own title and
// description; this block exists so nothing inherits a placeholder, and so
// metadataBase is set for resolving relative canonical URLs.
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.zhang-zikang.com'
  ),
  title: 'Zhang Zikang 张子康',
  description:
    'Official site of Zhang Zikang, artist, curator and museum director.',
};



// Export static params for Next.js to pre-render each locale
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type AvailableLocale = (typeof routing.locales)[number];
function isAvailableLocale(x: string): x is AvailableLocale {
  return (routing.locales as readonly string[]).includes(x);
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  // `params` is declared as a Promise of the object.
  params: Promise<{ locale: string }>;
}) {
  // Await it before using its properties.
  const { locale } = await params;

  // Validate the locale
  if (!isAvailableLocale(locale)) {
    notFound();
  }

  // Enable static rendering for this locale
  setRequestLocale(locale);

  // Load locale-specific messages.
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* GA4 Script */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');
            `,
          }}
        />
      </head>
      {/* <body className={`${notoSansSC.className} font-medium italic antialiased tracking-wide`}> */}
      <body className={`${notoSansSC.className} font-medium antialiased tracking-wide bg-background text-foreground`}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AnalyticsTracker />
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
