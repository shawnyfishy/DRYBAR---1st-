/**
 * NOTE: This file is scaffolding pending native Arabic copy.
 * There is currently no [locale] route segment and no middleware.ts configured for Arabic localization.
 * Do not assume multi-language Arabic routing is active until localized routes and middleware are implemented.
 */

import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'as-needed'
});

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
