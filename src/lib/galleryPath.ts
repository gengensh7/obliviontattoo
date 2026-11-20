export function galleryPath(page: number, basePath = '/gallery') {
  return page === 1 ? basePath : `${basePath}?page=${page}`
}
