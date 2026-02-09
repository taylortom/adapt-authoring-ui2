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
  const data = response.status !== 204 && response.status !== 304 ? await response.json() : {}
  if (!response.ok) {
    throw new Error(data.message)
  }
  return data
}

export function useApi (root) {
  return {
    post: async function (data, options = {}) {
      return apiFetch(root, { method: 'POST', body: data, ...options })
    },
    get: async function (_id = '', options = {}) {
      return apiFetch(`${root}/${_id}`, options)
    },
    query: async function (queryData, options = {}) {
      const queryString = typeof queryData === 'string'
      return apiFetch(`${root}/query${typeof queryData === 'string' ? queryData : ''}`, { method: 'POST', body: queryString ? '' : queryData, ...options })
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
