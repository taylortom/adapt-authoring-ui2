import { useCallback, useRef, useState } from 'react'
import { useApiQuery } from '../utils/api'

const SEARCH_DEBOUNCE_MS = 300

export default function useCollectionState ({
  apiRoot,
  queryBody,
  defaultSort = { field: 'updatedAt', order: -1 },
  defaultPageSize = 12,
  transformData
}) {
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(defaultPageSize)
  const [sortField, setSortField] = useState(defaultSort.field)
  const [sortOrder, setSortOrder] = useState(defaultSort.order)
  const [search, setSearch] = useState('')
  const searchTimer = useRef(null)

  const params = new URLSearchParams({
    skip: String(page * limit),
    limit: String(limit),
    sort: JSON.stringify({ [sortField]: sortOrder })
  })
  if (search) params.set('search', search)

  const { data, isLoading, error } = useApiQuery(
    apiRoot,
    (api) => api.query(`?${params}`, { body: queryBody }),
    { key: params.toString() }
  )

  const items = Array.isArray(data?.results) ? data.results : []
  const processedItems = transformData ? transformData(items) : items
  const totalPages = data?.pagination?.pageTotal || 0

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value
    clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => {
      setSearch(value)
      setPage(0)
    }, SEARCH_DEBOUNCE_MS)
  }, [])

  const handleSortFieldChange = (e) => {
    setSortField(e.target.value)
    setPage(0)
  }

  const handleToggleSortOrder = () => {
    setSortOrder(prev => prev === 1 ? -1 : 1)
    setPage(0)
  }

  const handlePageChange = (_, newPage) => {
    setPage(newPage)
  }

  const handleRowsPerPageChange = (e) => {
    setLimit(parseInt(e.target.value, 10))
    setPage(0)
  }

  return {
    items: processedItems,
    isLoading,
    error,
    totalPages,
    page,
    limit,
    sortField,
    sortOrder,
    search,
    handleSearchChange,
    handleSortFieldChange,
    handleToggleSortOrder,
    handlePageChange,
    handleRowsPerPageChange
  }
}
