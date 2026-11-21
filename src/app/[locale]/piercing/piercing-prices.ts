const catalogGroups = ['ears', 'nose', 'lipsAndTongue', 'navel', 'other'] as const

type CatalogGroup = (typeof catalogGroups)[number]
type Service = { name: string; price: number; hasBase?: boolean; catalogGroup?: CatalogGroup }
export type PriceCategory = { services: Service[]; catalogGroup?: CatalogGroup }

export function groupPiercingPrices(categories: PriceCategory[]) {
  const servicesByGroup: Record<CatalogGroup, Service[]> = { ears: [], nose: [], lipsAndTongue: [], navel: [], other: [] }

  for (const category of categories) {
    for (const service of category.services) {
      const group = service.catalogGroup ?? category.catalogGroup ?? 'other'
      servicesByGroup[group].push(service)
    }
  }

  return catalogGroups.map((group) => ({ group, services: servicesByGroup[group] }))
}
