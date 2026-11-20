import Image from 'next/image'
import { getCurrentYear } from '@/lib/getCurrentYear'
import { getTranslations } from 'next-intl/server'

export default async function FooterMenu() {
  const date = await getCurrentYear()

  const t = await getTranslations('homePage.footer')

  return (
    <footer className="bg-zinc-900 py-10">
      <div className="container grid grid-cols-1 items-center justify-center gap-6 sm:gap-10 lg:grid-cols-3">
        <Image src="/logo.png" alt="Logo Oblivion Tattoo" width={64} height={91} />
        <p className="= text-left text-white lg:text-center">© {date} Oblivion Tattoo</p>
        <a data-gtm="terms-download" className="w-fit text-white transition-colors hover:text-red-500 lg:ml-auto lg:text-right" href="/terms-en.pdf">
          {t('terms')}
        </a>
      </div>
    </footer>
  )
}
