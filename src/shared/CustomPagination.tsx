'use client'

import { galleryPath } from '@/lib/galleryPath'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'

export type PaginationLabels = { nav: string; previous: string; next: string }

type CustomPaginationProps = {
  labels: PaginationLabels
  page: number
  basePath: string
  totalPages: number
  onPageChange: (page: number) => void
}

export function CustomPagination({ labels, basePath, page, totalPages, onPageChange }: CustomPaginationProps) {
  if (totalPages <= 1) return null

  return (
    <Pagination aria-label={labels.nav}>
      <PaginationContent className="gap-2">
        <PaginationItem>
          <PaginationPrevious
            aria-label={labels.previous}
            href={page > 1 ? galleryPath(page - 1, basePath) : undefined}
            data-gtm="pagination-previous"
            className={`rounded-md bg-white text-black hover:bg-white hover:text-black ${page === 1 ? 'pointer-events-none opacity-50' : ''}`}
            aria-disabled={page === 1}
            tabIndex={page === 1 ? -1 : 0}
            onClick={(event) => {
              event.preventDefault()

              if (page > 1) {
                onPageChange(page - 1)
              }
            }}
          >
            {labels.previous}
          </PaginationPrevious>
        </PaginationItem>

        {Array.from({ length: totalPages }, (_, index) => {
          const pageNumber = index + 1

          return (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                href={galleryPath(pageNumber, basePath)}
                data-gtm="pagination-page"
                data-gtm-page={pageNumber}
                isActive={page === pageNumber}
                className={`rounded-md bg-white hover:bg-white ${page === pageNumber ? 'font-bold text-red-500 hover:text-red-500' : 'text-black hover:text-black'}`}
                onClick={(event) => {
                  event.preventDefault()
                  onPageChange(pageNumber)
                }}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          )
        })}

        <PaginationItem>
          <PaginationNext
            aria-label={labels.next}
            href={page < totalPages ? galleryPath(page + 1, basePath) : undefined}
            data-gtm="pagination-next"
            className={`rounded-md bg-white text-black hover:bg-white hover:text-black ${page === totalPages ? 'pointer-events-none opacity-50' : ''}`}
            aria-disabled={page === totalPages}
            tabIndex={page === totalPages ? -1 : 0}
            onClick={(event) => {
              event.preventDefault()

              if (page < totalPages) {
                onPageChange(page + 1)
              }
            }}
          >
            {labels.next}
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
