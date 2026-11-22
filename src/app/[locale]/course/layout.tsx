import { NextIntlClientProvider } from 'next-intl'
import { getLocale } from 'next-intl/server'
import type { ReactNode } from 'react'

export default async function CourseLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale()

  return <NextIntlClientProvider locale={locale} messages={null}>{children}</NextIntlClientProvider>
}
