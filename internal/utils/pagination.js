module.exports = {
  GetPagination: (page, size, sort = '') => {
    page ? (page = page) : (page = 1)
    const limit = size ? +size : 10
    const offset = page ? (page - 1) * limit : 1
    const parseSort = sort.split(':')

    return {
      limit,
      offset,
      orderField: parseSort.length > 1 ? parseSort[0] : 'createdAt',
      orderSort: parseSort.length > 1 ? parseSort[1] : 'desc',
    }
  },
  GetPagingData: (data, page, limit) => {
    const { count: totalItems, rows: items } = data
    const currentPage = page ? +page : 0
    const totalPages = Math.ceil(totalItems / limit)

    return { totalItems, items, totalPages, currentPage }
  },
  BuildMeta: (fetched, count, page, limit) => {
    return {
      total: count,
      currentPage: Number(page),
      nextPage:
        ((limit > 1 || limit < count) && fetched < limit) ||
        limit >= count ||
        (limit < 2 && page == count)
          ? null
          : Number(page) + 1,
    }
  },
}
