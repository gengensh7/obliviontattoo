import { Skeleton } from '@/components/ui/skeleton'

export default function PermanentLoading() {
  return (
    <main aria-busy="true">
      <div aria-hidden="true" className="permanent-hero-shell">
        <div className="container permanent-hero-layout">
          <div className="grid justify-items-start gap-5 sm:gap-8 lg:col-span-5">
            <div className="grid w-full gap-2">
              <Skeleton className="h-9 w-4/5 bg-zinc-800 motion-reduce:animate-none sm:h-12 xl:h-14" />
              <Skeleton className="h-9 w-2/5 bg-zinc-800 motion-reduce:animate-none sm:h-12 xl:h-14" />
              <Skeleton className="h-6 w-36 bg-zinc-800 motion-reduce:animate-none sm:h-8" />
            </div>
            <div className="grid w-full max-w-sm gap-2">
              <Skeleton className="h-4 w-full bg-zinc-800 motion-reduce:animate-none" />
              <Skeleton className="h-4 w-4/5 bg-zinc-800 motion-reduce:animate-none" />
            </div>
            <Skeleton className="h-12 w-60 bg-zinc-800 motion-reduce:animate-none" />
          </div>

          <ul className="permanent-hero-services">
            {['brows', 'lips', 'eyelids'].map((service) => (
              <li key={service} data-service={service}>
                <Skeleton className="rounded-md bg-zinc-800 motion-reduce:animate-none" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  )
}
