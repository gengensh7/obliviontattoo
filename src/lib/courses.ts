import { SUPABASE_S3_URL } from '@/lib/config'

export const courseByKey = {
  tattoo: {
    key: 'tattoo', path: '/course/tattoo', price: 450, service: '/tattoo', tracking: 'tattoo-permanent',
    duration: 'longDuration', schedule: 'longSchedule', supplies: 'materials',
    image: '/images/homePage/hero-section/hero-1.webp'
  },
  permanent: {
    key: 'permanent', path: '/course/permanent-makeup', price: 450, service: '/permanent', tracking: 'tattoo-permanent',
    duration: 'longDuration', schedule: 'longSchedule', supplies: 'materials',
    image: '/images/permanentPage/permanent-brovi-kishinev.webp'
  },
  piercing: {
    key: 'piercing', path: '/course/piercing', price: 300, service: '/piercing', tracking: 'piercing',
    duration: 'shortDuration', schedule: 'shortSchedule', supplies: 'jewellery',
    image: SUPABASE_S3_URL ? `${SUPABASE_S3_URL}/Piercing/piercing-1.webp` : '/images/piercingPage/piercing.webp'
  }
} as const

export const courses = Object.values(courseByKey)

export type Course = (typeof courses)[number]
