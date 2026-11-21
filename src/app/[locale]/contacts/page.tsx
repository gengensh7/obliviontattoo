import { withSeo } from '@/lib/metadata'
import { LocationSection } from '../ui/LocationSection'
import { ContactsHero } from './ui/ContactsHero'

export const generateMetadata = withSeo('metadata.contactsPageMetadata', '/contacts')

export default function Contacts() {
  return (
    <main className="flex flex-col bg-zinc-900">
      <ContactsHero />
      <LocationSection animate />
    </main>
  )
}
