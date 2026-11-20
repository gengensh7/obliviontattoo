import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { FramerMotionContainer } from '@/shared/FramerMotionContainer'

export const CertificateSection = async () => {
  const t = await getTranslations('coursesPage.certificateSection')

  const paragraphs = t.raw('certificates.paragraphs') as string[]
  return (
    <section className="bg-zinc-900 pb-20">
      <div className="container">
        <FramerMotionContainer className="flex flex-col gap-6">
          <h2 className="text-3xl font-bold text-white">{t('certificates.title')}</h2>
          <div className="my-4 h-px w-full bg-gray-700" />
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4 text-lg text-white">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="flex flex-col items-center gap-4 xl:flex-row">
              <Image
                className="h-auto w-full min-w-0 rounded-lg object-cover xl:w-1/2"
                src="/images/coursePage/course-1.webp"
                alt={t('certificates.images.alt1')}
                width={600}
                height={400}
                sizes="(max-width: 1280px) 100vw, 50vw"
                loading="lazy"
              />
              <Image
                className="h-auto w-full min-w-0 rounded-lg object-cover xl:w-1/2"
                src="/images/coursePage/course-2.webp"
                alt={t('certificates.images.alt2')}
                width={600}
                height={400}
                sizes="(max-width: 1280px) 100vw, 50vw"
                loading="lazy"
              />
            </div>
          </div>
        </FramerMotionContainer>

      </div>
    </section>
  )
}
