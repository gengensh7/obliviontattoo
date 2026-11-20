'use client'

import { parseAsInteger, useQueryState } from 'nuqs'
import { CustomPagination, type PaginationLabels } from './CustomPagination'

type NuqsPaginationProps = {
  labels: PaginationLabels
  basePath: string
  totalPages: number
}

export default function NuqsPagination({ labels, basePath, totalPages }: NuqsPaginationProps) {
  const [page, setPage] = useQueryState(
    'page',
    parseAsInteger.withDefault(1).withOptions({
      shallow: false
    })
  )

  const handlePageChange = (page: number) => {
    setPage(page)

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return <CustomPagination labels={labels} basePath={basePath} page={page} totalPages={totalPages} onPageChange={handlePageChange} />
}
