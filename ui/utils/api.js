import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryClient } from '../services/queryClient'

async function apiFetch (endpoint, options = {}) {
  const { body, headers, ...rest } = options
  const opts = {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(headers ?? {}) },
    body: body ? JSON.stringify(body) : undefined,
    ...rest
  }
  const response = await fetch(`/api/${endpoint}`, opts)
  if (!response.ok) {
    let message = response.statusText
    try { message = (await response.json()).message || message } catch {}
    throw new Error(message)
  }
  if (response.status === 204 || response.status === 304) return {}
  return response.json()
}

export function createApiClient (root) {
  return {
    key: root,
    post: async function (data, options = {}) {
      return apiFetch(root, { method: 'POST', body: data, ...options })
    },
    get: async function (_id, options = {}) {
      return apiFetch(_id ? `${root}/${_id}` : root, options)
    },
    getSchema: async function (queryString = '', options = {}) {
      return apiFetch(`${root}/schema?${queryString}`, options)
    },
    query: async function (queryData, options = {}) {
      const isString = typeof queryData === 'string'
      const endpoint = `${root}/query${isString ? queryData : ''}`
      const fetchOpts = { method: 'POST', body: isString ? undefined : queryData, ...options }
      const { body, headers: customHeaders, ...rest } = fetchOpts
      const response = await fetch(`/api/${endpoint}`, {
        method: rest.method || 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', ...(customHeaders ?? {}) },
        body: body ? JSON.stringify(body) : undefined,
        ...rest
      })
      if (!response.ok) {
        let message = response.statusText
        try { message = (await response.json()).message || message } catch {}
        throw new Error(message)
      }
      const results = await response.json()
      const pageTotal = Number(response.headers.get('X-Adapt-PageTotal'))
      return { results, pagination: { pageTotal: pageTotal || 0 } }
    },
    patch: async function (_id, data, options = {}) {
      if (!_id) throw new Error('Must provide \'_id\' param')
      return apiFetch(`${root}/${_id}`, { method: 'PATCH', body: data, ...options })
    },
    put: async function (_id, data, options = {}) {
      if (!_id) throw new Error('Must provide \'_id\' param')
      return apiFetch(`${root}/${_id}`, { method: 'PUT', body: data, ...options })
    },
    remove: async function (_id, options = {}) {
      if (!_id) throw new Error('Must provide \'_id\' param')
      return apiFetch(`${root}/${_id}`, { method: 'DELETE', ...options })
    }
  }
}

export function prefetchApiQuery (root, queryFn, { key, ...queryOptions } = {}) {
  const api = createApiClient(root)
  return queryClient.fetchQuery({
    queryKey: [root, ...(key ? [key] : [])],
    queryFn: () => queryFn(api),
    ...queryOptions
  })
}

export function getApiQueryData (root, key) {
  return queryClient.getQueryData([root, ...(key ? [key] : [])])
}

export function useApiQuery (root, queryFn, { key, ...queryOptions } = {}) {
  const api = createApiClient(root)
  return useQuery({
    queryKey: [root, ...(key ? [key] : [])],
    queryFn: () => queryFn(api),
    ...queryOptions
  })
}

export function useApiMutation (root, mutationFn, { onSuccess, ...mutationOptions } = {}) {
  const api = createApiClient(root)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (...args) => mutationFn(api, ...args),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: [root] })
      onSuccess?.(...args)
    },
    ...mutationOptions
  })
}
