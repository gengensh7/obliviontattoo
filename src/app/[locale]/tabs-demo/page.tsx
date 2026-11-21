import type { Metadata } from 'next'
import TabsDemo from '@/components/tabs-demo'

export const metadata: Metadata = {
  title: 'Aceternity Tabs Demo',
  robots: { index: false }
}

export default function TabsDemoPage() {
  return (
    <main className="isolate flex min-h-screen bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white">
      <TabsDemo />
    </main>
  )
}
