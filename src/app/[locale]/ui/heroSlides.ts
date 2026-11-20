export const slides = [
  {
    imageSrc: '/images/homePage/hero-section/hero-1.webp',
    key: 'firstCard'
  },
  {
    imageSrc: '/images/homePage/hero-section/hero-2.webp',
    key: 'secondCard'
  },
  {
    imageSrc: '/images/homePage/hero-section/hero-3.webp',
    key: 'thirdCard'
  }
] as const

export type HeroSliderProps = {
  cards: Record<
    (typeof slides)[number]['key'],
    {
      imageAlt: string
      title: string
      text: string
      description: string
      button: string
    }
  >
  labels: {
    previousSlide: string
    nextSlide: string
    slide: string
    pause: string
    play: string
  }
}
